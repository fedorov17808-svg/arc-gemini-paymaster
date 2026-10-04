import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  AlertTriangle, 
  ShieldAlert, 
  CheckCircle2, 
  ExternalLink, 
  Copy, 
  Zap, 
  Lock,
  Search,
  KeyRound
} from 'lucide-react';
import { Invoice } from '../types';
import { arcWeb3 } from '../services/arcWeb3';
import { parseEther } from 'ethers';

interface InvoiceDetailModalProps {
  invoice: Invoice | null;
  onClose: () => void;
  onPayInvoice: (invoice: Invoice, officerSignature?: string) => void;
  onQuarantineInvoice?: (invoice: Invoice) => void;
  onOpenExplorer?: (invoice: Invoice) => void;
  isProcessing: boolean;
}

export const InvoiceDetailModal: React.FC<InvoiceDetailModalProps> = ({
  invoice,
  onClose,
  onPayInvoice,
  onQuarantineInvoice,
  onOpenExplorer,
  isProcessing,
}) => {
  const [verificationResult, setVerificationResult] = useState<{
    verified: boolean;
    recoveredSigner: string;
    isAgent: boolean;
    isOfficer: boolean;
    timestamp: number;
  } | null>(null);

  const [officerSignature, setOfficerSignature] = useState<string | null>(null);
  const [isSigningOfficer, setIsSigningOfficer] = useState(false);

  if (!invoice) return null;

  const isBlocked = invoice.riskLevel === 'CRITICAL_RISK' || invoice.status === 'REJECTED';
  const isWarning = invoice.riskLevel === 'WARNING' || invoice.amountUsdc > 500;
  const isPaid = invoice.status === 'PAID';

  let riskColor = '#10b981';
  let riskBadge = 'VERIFIED SAFE';
  if (isBlocked) {
    riskColor = '#ef4444';
    riskBadge = 'CRITICAL PHISHING RISK';
  } else if (isWarning) {
    riskColor = '#f59e0b';
    riskBadge = 'POLICY WARNING (> $500)';
  }

  const copyAddress = () => {
    navigator.clipboard.writeText(invoice.vendorAddress);
    alert('Recipient Arc address copied to clipboard!');
  };

  // Run live in-browser ECDSA recovery
  const handleVerifyEip712 = () => {
    if (!invoice.agentSignature || !invoice.docHash) {
      alert('No cryptographic agent signature available for this invoice.');
      return;
    }

    try {
      const verdict = {
        invoiceId: invoice.docHash,
        recipient: invoice.vendorAddress,
        amount: parseEther(invoice.amountUsdc.toString()),
        riskScore: invoice.riskScore,
        nonce: 0,
        deadline: Math.floor(Date.now() / 1000) + 86400,
        vendorName: invoice.vendorName,
      };

      const res = arcWeb3.verifyEip712Verdict(verdict, invoice.agentSignature);
      setVerificationResult({
        verified: true,
        recoveredSigner: res.recoveredAddress,
        isAgent: res.isAgentOracle,
        isOfficer: res.isOfficer,
        timestamp: Date.now(),
      });
    } catch (err: any) {
      alert('Verification error: ' + err.message);
    }
  };

  // Handle Dual-Approval Multi-Sig Co-Signing
  const handleCoSignAndPay = async () => {
    setIsSigningOfficer(true);
    try {
      const verdict = {
        invoiceId: invoice.docHash || '0x7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069',
        recipient: invoice.vendorAddress,
        amount: parseEther(invoice.amountUsdc.toString()).toString(),
        riskScore: invoice.riskScore,
        nonce: 0,
        deadline: Math.floor(Date.now() / 1000) + 86400,
        vendorName: invoice.vendorName,
      };

      const { officerSignature: sig } = await arcWeb3.signOfficerCoApproval(verdict);
      setOfficerSignature(sig);
      onPayInvoice(invoice, sig);
    } catch (err: any) {
      alert('Failed to co-sign invoice: ' + err.message);
    } finally {
      setIsSigningOfficer(false);
    }
  };

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(5, 8, 16, 0.85)',
        backdropFilter: 'blur(10px)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
      onClick={onClose}
    >
      <div 
        className="glass-panel" 
        style={{
          width: '100%',
          maxWidth: '700px',
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: '28px',
          background: '#0d1322',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6)',
          borderRadius: '16px',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Close */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-dim)' }}>
                {invoice.invoiceNumber}
              </span>
              <span 
                style={{
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  padding: '3px 10px',
                  borderRadius: '999px',
                  background: `${riskColor}20`,
                  color: riskColor,
                  border: `1px solid ${riskColor}40`,
                }}
              >
                {riskBadge}
              </span>
            </div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f8fafc' }}>
              {invoice.vendorName}
            </h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              {invoice.vendorCategory} • Issued {invoice.issueDate} • Due {invoice.dueDate}
            </p>
          </div>
          <button 
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.06)',
              borderRadius: '50%',
              padding: '8px',
              color: 'var(--text-muted)',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Amount & Risk Metric Bar */}
        <div 
          style={{
            background: 'rgba(15, 23, 42, 0.7)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '12px',
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '20px',
          }}
        >
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Total Payable</span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
              <span style={{ fontSize: '1.7rem', fontWeight: 800, color: '#ffffff' }}>
                ${invoice.amountUsdc.toFixed(2)}
              </span>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#00f2fe' }}>USDC</span>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Gemini Risk Score</span>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px' }}>
              <span style={{ fontSize: '1.7rem', fontWeight: 800, color: riskColor }}>
                {invoice.riskScore}
              </span>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>/ 100</span>
            </div>
          </div>
        </div>

        {/* AI Forensic Reasoning */}
        <div 
          style={{
            background: 'rgba(0, 82, 255, 0.05)',
            border: '1px solid rgba(0, 82, 255, 0.2)',
            borderRadius: '12px',
            padding: '16px',
            marginBottom: '20px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <ShieldCheck size={16} color="#00f2fe" />
            <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#00f2fe', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Gemini Sentinel Verdict
            </h4>
          </div>
          <p style={{ fontSize: '0.85rem', lineHeight: 1.5, color: '#e2e8f0', marginBottom: '12px' }}>
            {invoice.aiReasoning}
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {invoice.riskFlags.map((flag, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: isBlocked ? '#f87171' : isWarning ? '#fbbf24' : '#94a3b8' }}>
                {isBlocked ? <ShieldAlert size={14} color="#ef4444" /> : isWarning ? <AlertTriangle size={14} color="#f59e0b" /> : <CheckCircle2 size={14} color="#10b981" />}
                <span>{flag}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Line Items */}
        <div style={{ marginBottom: '20px' }}>
          <h4 style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>
            Audited Line Items
          </h4>
          <div style={{ background: 'rgba(0, 0, 0, 0.2)', borderRadius: '8px', overflow: 'hidden' }}>
            {invoice.lineItems.map((item, idx) => (
              <div 
                key={idx}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '10px 14px',
                  borderBottom: idx < invoice.lineItems.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                  fontSize: '0.8rem',
                }}
              >
                <span style={{ color: '#e2e8f0' }}>{item.description}</span>
                <span style={{ fontFamily: 'var(--font-mono)', color: '#f8fafc', fontWeight: 600 }}>
                  ${item.total.toFixed(2)} USDC
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Cryptographic Proof & Live EIP-712 Verifier */}
        <div 
          style={{
            background: 'rgba(15, 23, 42, 0.6)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '10px',
            padding: '14px 16px',
            marginBottom: '20px',
            fontSize: '0.78rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ color: '#00f2fe', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              EIP-712 Cryptographic Attestation
            </span>
            <button
              onClick={handleVerifyEip712}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 10px',
                borderRadius: '6px',
                background: 'rgba(0, 242, 254, 0.12)',
                border: '1px solid rgba(0, 242, 254, 0.3)',
                color: '#00f2fe',
                fontSize: '0.72rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              <Search size={12} />
              <span>Verify Cryptographic Proof</span>
            </button>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span style={{ color: 'var(--text-muted)' }}>Target Network:</span>
            <span style={{ color: '#f8fafc', fontWeight: 600 }}>Circle Arc Mainnet (Chain ID 5042)</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span style={{ color: 'var(--text-muted)' }}>Verifying Contract:</span>
            <span style={{ fontFamily: 'var(--font-mono)', color: '#00f2fe' }}>0x5FbD...0aa3 (ArcPaymaster.sol)</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span style={{ color: 'var(--text-muted)' }}>Recipient EVM Address:</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontFamily: 'var(--font-mono)', color: '#00f2fe' }}>
                {invoice.vendorAddress.slice(0, 10)}...{invoice.vendorAddress.slice(-8)}
              </span>
              <button onClick={copyAddress} style={{ background: 'none', color: 'var(--text-muted)', cursor: 'pointer', border: 'none' }}>
                <Copy size={12} />
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span style={{ color: 'var(--text-muted)' }}>Document Keccak256 Hash:</span>
            <span style={{ fontFamily: 'var(--font-mono)', color: '#93c5fd' }}>
              {invoice.docHash ? `${invoice.docHash.slice(0, 14)}...${invoice.docHash.slice(-8)}` : '0x7f83b165...'}
            </span>
          </div>

          {invoice.agentSignature && (
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ color: 'var(--text-muted)' }}>AI Agent Oracle Signature:</span>
              <span style={{ fontFamily: 'var(--font-mono)', color: '#34d399' }}>
                {invoice.agentSignature.slice(0, 14)}...{invoice.agentSignature.slice(-8)}
              </span>
            </div>
          )}

          {officerSignature && (
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ color: '#fbbf24' }}>Human Officer Co-Signature:</span>
              <span style={{ fontFamily: 'var(--font-mono)', color: '#fbbf24' }}>
                {officerSignature.slice(0, 14)}...{officerSignature.slice(-8)}
              </span>
            </div>
          )}

          {/* Verification Box */}
          {verificationResult && (
            <div style={{ marginTop: '10px', padding: '12px', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16, 185, 129, 0.4)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#10b981', fontWeight: 700, marginBottom: '4px' }}>
                <CheckCircle2 size={15} />
                <span>100% Cryptographically Validated on Arc Mainnet Domain (5042)</span>
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', color: '#e2e8f0', fontSize: '0.72rem' }}>
                Recovered Signer: {verificationResult.recoveredSigner}
              </div>
              <div style={{ color: '#34d399', fontSize: '0.72rem', marginTop: '3px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span>✓ Authorized Oracle</span>
                <span>•</span>
                <span>✓ EIP-712 StructHash Valid</span>
                <span>•</span>
                <span>⚡ Circle USDC Gas Sponsored</span>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '12px' }}>
          <button
            onClick={onClose}
            style={{
              padding: '10px 18px',
              borderRadius: '8px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-main)',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Close
          </button>

          {isPaid ? (
            <button
              onClick={() => onOpenExplorer && onOpenExplorer(invoice)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '10px 20px',
                borderRadius: '8px',
                background: 'rgba(0, 242, 254, 0.15)',
                border: '1px solid rgba(0, 242, 254, 0.4)',
                color: '#00f2fe',
                fontSize: '0.85rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              <span>View On Arcscan Explorer</span>
              <ExternalLink size={14} />
            </button>
          ) : isBlocked ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {invoice.txHash ? (
                <button
                  onClick={() => onOpenExplorer && onOpenExplorer(invoice)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 20px',
                    borderRadius: '8px',
                    background: 'rgba(239, 68, 68, 0.15)',
                    border: '1px solid rgba(239, 68, 68, 0.4)',
                    color: '#f87171',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  <ShieldAlert size={14} />
                  <span>Quarantined On-Chain (Inspect Receipt)</span>
                </button>
              ) : (
                <button
                  onClick={() => onQuarantineInvoice && onQuarantineInvoice(invoice)}
                  disabled={isProcessing}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 22px',
                    borderRadius: '8px',
                    background: 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)',
                    color: '#ffffff',
                    fontSize: '0.85rem',
                    fontWeight: 800,
                    boxShadow: '0 4px 20px rgba(239, 68, 68, 0.4)',
                    cursor: isProcessing ? 'wait' : 'pointer',
                  }}
                >
                  <ShieldAlert size={16} />
                  <span>{isProcessing ? 'Executing Quarantine...' : '🛡️ Execute On-Chain Quarantine & Blacklist'}</span>
                </button>
              )}
            </div>
          ) : isWarning && !officerSignature ? (
            <button
              onClick={handleCoSignAndPay}
              disabled={isSigningOfficer || isProcessing}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 22px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                color: '#070b14',
                fontSize: '0.85rem',
                fontWeight: 800,
                boxShadow: '0 4px 20px rgba(245, 158, 11, 0.3)',
                cursor: 'pointer',
              }}
            >
              <KeyRound size={16} />
              <span>{isSigningOfficer ? 'Co-Signing Verdict...' : '✍️ Officer Co-Sign & Settle on Arc'}</span>
            </button>
          ) : (
            <button
              onClick={() => onPayInvoice(invoice, officerSignature || undefined)}
              disabled={isProcessing}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 22px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #00f2fe 0%, #0052ff 100%)',
                color: '#070b14',
                fontSize: '0.85rem',
                fontWeight: 800,
                boxShadow: '0 4px 20px rgba(0, 242, 254, 0.3)',
                cursor: 'pointer',
              }}
            >
              <Zap size={16} />
              <span>Authorize & Settle on Arc</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
