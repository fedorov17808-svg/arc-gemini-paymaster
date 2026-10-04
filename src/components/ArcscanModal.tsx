import React, { useState } from 'react';
import { 
  X, 
  CheckCircle2, 
  ShieldAlert, 
  Zap, 
  ExternalLink, 
  Copy, 
  Check, 
  FileCode, 
  Activity, 
  Layers, 
  ArrowRight,
  ShieldCheck,
  Fuel
} from 'lucide-react';
import { Invoice } from '../types';
import { PAYMASTER_CONTRACT_ADDRESS, DEMO_AGENT_ADDRESS } from '../services/arcWeb3';

interface ArcscanModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: Invoice | null;
  txHashOverride?: string;
}

export const ArcscanModal: React.FC<ArcscanModalProps> = ({
  isOpen,
  onClose,
  invoice,
  txHashOverride,
}) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'events' | 'eip712'>('overview');

  if (!isOpen || !invoice) return null;

  const txHash = txHashOverride || invoice.txHash || '0x7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069';
  const blockNumber = invoice.arcBlockNumber || 1420958;
  const isQuarantine = invoice.status === 'REJECTED' || invoice.riskLevel === 'CRITICAL_RISK';
  const gasPaid = invoice.gasPaidUsdc ?? 0.00035;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div 
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(3, 7, 18, 0.85)',
        backdropFilter: 'blur(12px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        animation: 'fadeIn 0.2s ease-out',
      }}
      onClick={onClose}
    >
      <div 
        style={{
          background: 'linear-gradient(180deg, #0b1120 0%, #070b14 100%)',
          border: '1px solid rgba(0, 242, 254, 0.25)',
          borderRadius: '16px',
          width: '100%',
          maxWidth: '780px',
          boxShadow: '0 25px 60px -15px rgba(0, 242, 254, 0.2), 0 0 40px rgba(0, 82, 255, 0.1)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '90vh',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Explorer Header */}
        <div 
          style={{
            padding: '16px 24px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'rgba(15, 23, 42, 0.6)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div 
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #00f2fe 0%, #0052ff 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#070b14',
                fontWeight: 900,
                fontSize: '1rem',
              }}
            >
              ⟠
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#f8fafc', margin: 0 }}>
                  Arcscan Explorer
                </h3>
                <span 
                  style={{
                    fontSize: '0.68rem',
                    background: 'rgba(0, 242, 254, 0.12)',
                    border: '1px solid rgba(0, 242, 254, 0.3)',
                    color: '#00f2fe',
                    padding: '2px 8px',
                    borderRadius: '999px',
                    fontWeight: 700,
                  }}
                >
                  Circle Arc Mainnet (5042)
                </span>
              </div>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', margin: 0 }}>
                Real-Time Verified On-Chain Transaction Receipt
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: '6px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Status Highlight Banner */}
        <div 
          style={{
            padding: '14px 24px',
            background: isQuarantine ? 'rgba(239, 68, 68, 0.08)' : 'rgba(16, 185, 129, 0.08)',
            borderBottom: `1px solid ${isQuarantine ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)'}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {isQuarantine ? (
              <ShieldAlert size={20} color="#ef4444" />
            ) : (
              <CheckCircle2 size={20} color="#10b981" />
            )}
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: 800, color: isQuarantine ? '#f87171' : '#34d399' }}>
                {isQuarantine ? 'SCAM QUARANTINED ON-CHAIN (Address Blacklisted)' : 'TRANSACTION FINALIZED (Sub-second Arc Consensus)'}
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                Included in Arc Block <span style={{ color: '#f8fafc', fontWeight: 600 }}>#{blockNumber}</span>
              </div>
            </div>
          </div>

          {/* Paymaster Gas Sponsorship Pill */}
          <div 
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: '8px',
              background: 'rgba(0, 242, 254, 0.1)',
              border: '1px solid rgba(0, 242, 254, 0.3)',
              fontSize: '0.72rem',
              color: '#00f2fe',
              fontWeight: 700,
            }}
          >
            <Fuel size={14} />
            <span>Gas: 0.00 USDC</span>
            <span style={{ color: '#10b981', background: 'rgba(16, 185, 129, 0.2)', padding: '2px 6px', borderRadius: '4px' }}>
              ⚡ Sponsored by Circle Paymaster
            </span>
          </div>
        </div>

        {/* Tab Controls */}
        <div style={{ display: 'flex', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', padding: '0 24px' }}>
          <button
            onClick={() => setActiveTab('overview')}
            style={{
              padding: '12px 16px',
              background: 'transparent',
              border: 'none',
              borderBottom: activeTab === 'overview' ? '2px solid #00f2fe' : '2px solid transparent',
              color: activeTab === 'overview' ? '#00f2fe' : 'var(--text-muted)',
              fontWeight: 700,
              fontSize: '0.8rem',
              cursor: 'pointer',
            }}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('events')}
            style={{
              padding: '12px 16px',
              background: 'transparent',
              border: 'none',
              borderBottom: activeTab === 'events' ? '2px solid #00f2fe' : '2px solid transparent',
              color: activeTab === 'events' ? '#00f2fe' : 'var(--text-muted)',
              fontWeight: 700,
              fontSize: '0.8rem',
              cursor: 'pointer',
            }}
          >
            Event Logs (1)
          </button>
          <button
            onClick={() => setActiveTab('eip712')}
            style={{
              padding: '12px 16px',
              background: 'transparent',
              border: 'none',
              borderBottom: activeTab === 'eip712' ? '2px solid #00f2fe' : '2px solid transparent',
              color: activeTab === 'eip712' ? '#00f2fe' : 'var(--text-muted)',
              fontWeight: 700,
              fontSize: '0.8rem',
              cursor: 'pointer',
            }}
          >
            EIP-712 Typed Data
          </button>
        </div>

        {/* Content Body */}
        <div style={{ padding: '20px 24px', overflowY: 'auto', flex: 1 }}>
          {activeTab === 'overview' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.8rem' }}>
              {/* Tx Hash Row */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Transaction Hash:</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <code style={{ color: '#00f2fe', fontFamily: 'var(--font-mono)', fontSize: '0.78rem' }}>
                    {txHash}
                  </code>
                  <button
                    onClick={() => copyToClipboard(txHash)}
                    style={{ background: 'transparent', border: 'none', color: copied ? '#10b981' : 'var(--text-muted)', cursor: 'pointer' }}
                    title="Copy Hash"
                  >
                    {copied ? <Check size={14} /> : <Copy size={14} />}
                  </button>
                </div>
              </div>

              {/* Action Method */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Smart Contract Action:</span>
                <span style={{ fontWeight: 700, color: isQuarantine ? '#f87171' : '#f8fafc', background: 'rgba(255,255,255,0.05)', padding: '4px 10px', borderRadius: '6px' }}>
                  {isQuarantine ? 'quarantineFraudulentInvoice(invoiceId, scammer, riskScore)' : invoice.amountUsdc > 500 ? 'settleInvoiceDualApproval(Multi-Sig)' : 'settleInvoiceAutonomous(EIP-712)'}
                </span>
              </div>

              {/* From / Interacted With */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div style={{ padding: '12px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px' }}>
                  <div style={{ color: 'var(--text-muted)', marginBottom: '4px', fontSize: '0.72rem' }}>From (Fiscal Agent Oracle):</div>
                  <div style={{ color: '#93c5fd', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', fontWeight: 600 }}>
                    {DEMO_AGENT_ADDRESS}
                  </div>
                </div>

                <div style={{ padding: '12px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px' }}>
                  <div style={{ color: 'var(--text-muted)', marginBottom: '4px', fontSize: '0.72rem' }}>Interacted With (Contract):</div>
                  <div style={{ color: '#00f2fe', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', fontWeight: 600 }}>
                    {PAYMASTER_CONTRACT_ADDRESS}
                  </div>
                </div>
              </div>

              {/* Value & Transfer */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 14px', background: 'rgba(0, 242, 254, 0.03)', border: '1px solid rgba(0, 242, 254, 0.1)', borderRadius: '8px' }}>
                <div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>Settlement Value:</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: isQuarantine ? '#94a3b8' : '#10b981', fontFamily: 'var(--font-mono)' }}>
                    {isQuarantine ? '0.00 USDC (Blocked)' : `${invoice.amountUsdc.toFixed(2)} USDC`}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>Recipient:</div>
                  <div style={{ color: '#f8fafc', fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>
                    {invoice.vendorAddress.slice(0, 10)}...{invoice.vendorAddress.slice(-8)}
                  </div>
                </div>
              </div>

              {/* Gas Breakdown */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Estimated Gas Used:</span>
                <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-main)' }}>
                  62,419 Gas Units ({(gasPaid).toFixed(5)} USDC - Fully Sponsored)
                </span>
              </div>
            </div>
          )}

          {activeTab === 'events' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ padding: '14px', background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: isQuarantine ? '#ef4444' : '#10b981' }} />
                  <strong style={{ color: isQuarantine ? '#f87171' : '#34d399', fontSize: '0.85rem' }}>
                    {isQuarantine ? 'event AddressBlacklisted(address indexed target, string reason)' : 'event InvoiceSettled(bytes32 indexed invoiceId, address indexed recipient, uint256 amount, uint8 riskScore, string vendorName, bool dualApproved, uint256 timestamp)'}
                  </strong>
                </div>
                <pre style={{ margin: 0, padding: '10px', background: 'rgba(0,0,0,0.4)', borderRadius: '6px', fontSize: '0.72rem', color: '#93c5fd', overflowX: 'auto', fontFamily: 'var(--font-mono)' }}>
{isQuarantine ? JSON.stringify({
  target: invoice.vendorAddress,
  reason: "Gemini Sentinel: Homoglyph Cyrillic spoofing & unauthorized advance fee phishing",
  blockNumber: blockNumber,
  contract: PAYMASTER_CONTRACT_ADDRESS,
}, null, 2) : JSON.stringify({
  invoiceId: invoice.docHash || txHash,
  recipient: invoice.vendorAddress,
  amountWei: `${invoice.amountUsdc * 1e18}`,
  amountUsdc: `${invoice.amountUsdc} USDC`,
  riskScore: invoice.riskScore,
  vendorName: invoice.vendorName,
  dualApproved: invoice.amountUsdc > 500,
  timestamp: Math.floor(Date.now() / 1000),
}, null, 2)}
                </pre>
              </div>
            </div>
          )}

          {activeTab === 'eip712' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                EIP-712 Structured Data Payload used for hardware-grade ECDSA signer verification:
              </div>
              <pre style={{ margin: 0, padding: '14px', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', fontSize: '0.72rem', color: '#38bdf8', overflowX: 'auto', fontFamily: 'var(--font-mono)' }}>
{JSON.stringify({
  domain: {
    name: 'ArcPaymaster',
    version: '1.0.0',
    chainId: 5042,
    verifyingContract: PAYMASTER_CONTRACT_ADDRESS,
  },
  types: {
    InvoiceVerdict: [
      { name: 'invoiceId', type: 'bytes32' },
      { name: 'recipient', type: 'address' },
      { name: 'amount', type: 'uint256' },
      { name: 'riskScore', type: 'uint8' },
      { name: 'nonce', type: 'uint256' },
      { name: 'deadline', type: 'uint256' },
      { name: 'vendorName', type: 'string' },
    ],
  },
  message: {
    invoiceId: invoice.docHash || '0x7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069',
    recipient: invoice.vendorAddress,
    amount: `${invoice.amountUsdc * 1e18}`,
    riskScore: invoice.riskScore,
    nonce: 0,
    deadline: Math.floor(Date.now() / 1000) + 86400,
    vendorName: invoice.vendorName,
  },
  signature: invoice.agentSignature || '0xeb4c5e4498edc677d51266d2e3b374f18322ba24898aca6fe2aa288ffefcc7a73d30294511e74199e135ad1c0f63c579c1e85551eab5210145ff88738d73209d1b',
  recoveredOracleAddress: DEMO_AGENT_ADDRESS,
}, null, 2)}
              </pre>
            </div>
          )}
        </div>

        {/* Footer */}
        <div 
          style={{
            padding: '14px 24px',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'rgba(15, 23, 42, 0.6)',
          }}
        >
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
            Circle Arc L1 Consensus • Gas Sponsored by Paymaster
          </span>
          <button
            onClick={onClose}
            style={{
              padding: '8px 20px',
              borderRadius: '8px',
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid var(--border-subtle)',
              color: '#ffffff',
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Close Explorer
          </button>
        </div>
      </div>
    </div>
  );
};
