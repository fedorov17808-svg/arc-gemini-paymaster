import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Header } from './components/Header';
import { StatsBar } from './components/StatsBar';
import { InvoiceList } from './components/InvoiceList';
import { InvoiceDetailModal } from './components/InvoiceDetailModal';
import { UploaderModal } from './components/UploaderModal';
import { AgentTerminalModal } from './components/AgentTerminalModal';
import { PolicyModal } from './components/PolicyModal';
import { HackathonInfoModal } from './components/HackathonInfoModal';
import { ArcLedgerTable } from './components/ArcLedgerTable';

import { Invoice, TreasuryPolicy, WalletState } from './types';
import { SAMPLE_INVOICES } from './data/sampleInvoices';
import { arcWeb3, ARC_MAINNET_CONFIG, DEMO_AGENT_ADDRESS } from './services/arcWeb3';
import { geminiService } from './services/geminiService';

export const App: React.FC = () => {
  const [invoices, setInvoices] = useState<Invoice[]>(SAMPLE_INVOICES);
  const [treasuryBalance, setTreasuryBalance] = useState<number>(10000.00);

  const [wallet, setWallet] = useState<WalletState>({
    isConnected: true,
    address: DEMO_AGENT_ADDRESS,
    balanceUsdc: 10000.00,
    chainId: 5042,
    networkName: 'Arc Mainnet',
    isArcMainnet: true,
    isAutonomousAgentMode: true,
    agentAddress: DEMO_AGENT_ADDRESS,
  });

  const [policy, setPolicy] = useState<TreasuryPolicy>({
    maxAutoApproveUsdc: 500,
    dailyBudgetUsdc: 2500,
    dailySpentUsdc: 42.50,
    requireMultiSigAboveUsdc: 500,
    fraudThresholdScore: 60,
    autoExecuteSafe: true,
  });

  const [apiKey, setApiKey] = useState<string>('');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isUploaderOpen, setIsUploaderOpen] = useState(false);
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [isPolicyOpen, setIsPolicyOpen] = useState(false);
  const [isHackathonInfoOpen, setIsHackathonInfoOpen] = useState(false);
  const [isAuditing, setIsAuditing] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'info' | 'error' } | null>(null);

  // Fetch persistent invoices on mount
  useEffect(() => {
    fetch('http://localhost:3001/api/invoices')
      .then((res) => res.json())
      .then((data) => {
        if (data?.invoices && Array.isArray(data.invoices) && data.invoices.length > 0) {
          setInvoices(data.invoices);
        }
      })
      .catch((err) => {
        console.warn('Backend API not reachable, using local seed dataset:', err);
      });
  }, []);

  const showToast = (text: string, type: 'success' | 'info' | 'error' = 'info') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Connect Web3 Browser Wallet (MetaMask / Rabby)
  const handleConnectWallet = async () => {
    try {
      const res = await arcWeb3.connectBrowserWallet();
      setWallet({
        isConnected: true,
        address: res.address,
        balanceUsdc: 450.00,
        chainId: res.chainId,
        networkName: res.isArc ? 'Arc Mainnet' : 'Other Network',
        isArcMainnet: res.isArc,
        isAutonomousAgentMode: false,
      });
      showToast(`Connected: ${res.address.slice(0, 6)}...${res.address.slice(-4)}`, 'success');
      if (!res.isArc) {
        showToast('Please switch network to Arc Mainnet (ID 5042)', 'info');
      }
    } catch (err: any) {
      showToast(err.message || 'Could not connect wallet. Using autonomous agent mode.', 'info');
    }
  };

  // Switch network to Arc Mainnet
  const handleSwitchToArc = async () => {
    try {
      await arcWeb3.switchToArcNetwork();
      setWallet((prev) => ({
        ...prev,
        chainId: ARC_MAINNET_CONFIG.chainId,
        networkName: 'Arc Mainnet',
        isArcMainnet: true,
      }));
      showToast('Switched to Circle Arc Mainnet (5042)', 'success');
    } catch (err: any) {
      showToast('Failed to switch network: ' + err.message, 'error');
    }
  };

  // Pay single invoice on Arc
  const handlePayInvoice = async (inv: Invoice) => {
    if (inv.riskLevel === 'CRITICAL_RISK' || inv.status === 'REJECTED') {
      showToast('Action Blocked: Invoice is flagged with critical fraud risk!', 'error');
      return;
    }

    setIsProcessing(true);
    showToast(`Dispatching payment for ${inv.amountUsdc.toFixed(2)} USDC on Arc Mainnet...`, 'info');

    try {
      const res = await arcWeb3.sendArcPayment(inv.vendorAddress, inv.amountUsdc, inv.memo);

      // Persist settlement to backend database
      fetch(`http://localhost:3001/api/invoices/${inv.id}/settle`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          txHash: res.txHash,
          arcBlockNumber: res.blockNumber,
          gasPaidUsdc: res.gasPaidUsdc,
        }),
      }).catch((err) => console.warn('Could not persist settlement to backend:', err));

      // Deduct balance and update invoice status
      setTreasuryBalance((prev) => Math.max(0, prev - inv.amountUsdc - res.gasPaidUsdc));
      setInvoices((prev) =>
        prev.map((item) =>
          item.id === inv.id
            ? {
                ...item,
                status: 'PAID',
                txHash: res.txHash,
                arcBlockNumber: res.blockNumber,
                gasPaidUsdc: res.gasPaidUsdc,
              }
            : item
        )
      );

      if (selectedInvoice && selectedInvoice.id === inv.id) {
        setSelectedInvoice((prev) =>
          prev
            ? {
                ...prev,
                status: 'PAID',
                txHash: res.txHash,
                arcBlockNumber: res.blockNumber,
                gasPaidUsdc: res.gasPaidUsdc,
              }
            : null
        );
      }

      // Celebrate success!
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#00f2fe', '#0052ff', '#10b981'],
      });

      showToast(`Settled on Arc! Tx: ${res.txHash.slice(0, 10)}... (Gas: ${res.gasPaidUsdc} USDC)`, 'success');
    } catch (err: any) {
      showToast('Transaction error: ' + err.message, 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  // Pay all safe invoices in batch
  const handlePayAllSafe = async () => {
    const safeInvoices = invoices.filter(
      (i) => i.riskLevel === 'SAFE' && (i.status === 'AUDITED' || i.status === 'APPROVED')
    );

    if (safeInvoices.length === 0) {
      showToast('No pending safe invoices to pay.', 'info');
      return;
    }

    setIsProcessing(true);
    showToast(`Initiating batch payment of ${safeInvoices.length} invoices on Arc...`, 'info');

    for (const inv of safeInvoices) {
      await handlePayInvoice(inv);
    }

    setIsProcessing(false);
  };

  // Audit new file uploaded
  const handleAuditFile = async (fileName: string, fileObj?: File) => {
    setIsAuditing(true);
    try {
      const audited = await geminiService.auditInvoice(fileName, fileObj, policy, apiKey);
      setInvoices((prev) => [audited, ...prev]);
      setSelectedInvoice(audited);
      setIsUploaderOpen(false);

      if (audited.riskLevel === 'CRITICAL_RISK') {
        showToast('🚨 Critical Scam Blocked: Gemini Sentinel quarantined malicious invoice!', 'error');
      } else {
        showToast(`Audit Completed: ${audited.vendorName} ($${audited.amountUsdc} USDC)`, 'success');
      }
    } catch (err: any) {
      showToast('Failed to audit document: ' + err.message, 'error');
    } finally {
      setIsAuditing(false);
    }
  };

  // Load preset sample for DoraHacks judges
  const handleLoadSample = (sample: Invoice) => {
    const sampleCopy = {
      ...sample,
      id: `inv-${Date.now()}`,
      timestamp: Date.now(),
    };
    setInvoices((prev) => [sampleCopy, ...prev]);
    setSelectedInvoice(sampleCopy);
    setIsUploaderOpen(false);

    if (sampleCopy.riskLevel === 'CRITICAL_RISK') {
      showToast('🚨 Threat Intercepted: Gemini Sentinel detected spoofed phishing bill!', 'error');
    } else {
      showToast(`Loaded Sample: ${sampleCopy.vendorName}`, 'info');
    }
  };

  const paidInvoices = invoices.filter((i) => i.status === 'PAID');

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Toast Notification */}
      {toastMessage && (
        <div 
          style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            zIndex: 9999,
            background: toastMessage.type === 'error' ? 'rgba(239, 68, 68, 0.95)' : toastMessage.type === 'success' ? 'rgba(16, 185, 129, 0.95)' : 'rgba(15, 23, 42, 0.95)',
            border: `1px solid ${toastMessage.type === 'error' ? '#ef4444' : toastMessage.type === 'success' ? '#10b981' : '#00f2fe'}`,
            color: '#ffffff',
            padding: '12px 20px',
            borderRadius: '10px',
            fontSize: '0.85rem',
            fontWeight: 600,
            boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
            backdropFilter: 'blur(10px)',
          }}
        >
          {toastMessage.text}
        </div>
      )}

      {/* Main Navigation Header */}
      <Header
        wallet={wallet}
        onConnectWallet={handleConnectWallet}
        onSwitchToArc={handleSwitchToArc}
        onToggleAutonomousMode={() => setWallet(w => ({ ...w, isAutonomousAgentMode: !w.isAutonomousAgentMode }))}
        onOpenTerminal={() => setIsTerminalOpen(true)}
        onOpenPolicy={() => setIsPolicyOpen(true)}
        onOpenHackathonInfo={() => setIsHackathonInfoOpen(true)}
        onOpenUploader={() => setIsUploaderOpen(true)}
      />

      {/* Primary KPI & Treasury Metrics */}
      <StatsBar
        invoices={invoices}
        policy={policy}
        treasuryBalance={treasuryBalance}
      />

      {/* Main Invoice List & Paymaster Queue */}
      <div style={{ flex: 1 }}>
        <InvoiceList
          invoices={invoices}
          onSelectInvoice={(inv) => setSelectedInvoice(inv)}
          onPayInvoice={handlePayInvoice}
          onPayAllSafe={handlePayAllSafe}
          isProcessing={isProcessing}
        />

        {/* On-Chain Arc Transaction Ledger */}
        <ArcLedgerTable paidInvoices={paidInvoices} />
      </div>

      {/* Modals */}
      <InvoiceDetailModal
        invoice={selectedInvoice}
        onClose={() => setSelectedInvoice(null)}
        onPayInvoice={handlePayInvoice}
        isProcessing={isProcessing}
      />

      <UploaderModal
        isOpen={isUploaderOpen}
        onClose={() => setIsUploaderOpen(false)}
        onAuditFile={handleAuditFile}
        onLoadSample={handleLoadSample}
        isAuditing={isAuditing}
        apiKey={apiKey}
        onApiKeyChange={setApiKey}
      />

      <AgentTerminalModal
        isOpen={isTerminalOpen}
        onClose={() => setIsTerminalOpen(false)}
        invoices={invoices}
        policy={policy}
        apiKey={apiKey}
        onExecuteBatchPay={handlePayAllSafe}
        onSwitchToArc={handleSwitchToArc}
      />

      <PolicyModal
        isOpen={isPolicyOpen}
        onClose={() => setIsPolicyOpen(false)}
        policy={policy}
        onSavePolicy={(p) => {
          setPolicy(p);
          showToast('Treasury Policy updated successfully!', 'success');
        }}
      />

      <HackathonInfoModal
        isOpen={isHackathonInfoOpen}
        onClose={() => setIsHackathonInfoOpen(false)}
      />

      {/* Footer */}
      <footer style={{ margin: '20px', padding: '16px 24px', borderTop: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
        <div>
          <span>ArcPaymaster AI • Built for </span>
          <strong style={{ color: '#00f2fe' }}>Circle Arc Microgrants</strong>
          <span> on DoraHacks</span>
        </div>
        <div style={{ display: 'flex', gap: '16px' }}>
          <span>Chain ID: <strong>5042</strong></span>
          <span>Gas Currency: <strong style={{ color: '#10b981' }}>USDC</strong></span>
          <span>AI Model: <strong style={{ color: '#00f2fe' }}>Google Gemini 2.5 Flash</strong></span>
        </div>
      </footer>
    </div>
  );
};

export default App;
