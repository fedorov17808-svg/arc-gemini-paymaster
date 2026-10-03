import React from 'react';
import { 
  X, 
  ShieldCheck, 
  AlertTriangle, 
  ShieldAlert, 
  CheckCircle2, 
  ExternalLink, 
  Copy, 
  Zap, 
  Cpu, 
  FileText,
  Lock
} from 'lucide-react';
import { Invoice } from '../types';

interface InvoiceDetailModalProps {
  invoice: Invoice | null;
  onClose: () => void;
  onPayInvoice: (invoice: Invoice) => void;
  isProcessing: boolean;
}

export const InvoiceDetailModal: React.FC<InvoiceDetailModalProps> = ({
  invoice,
  onClose,
  onPayInvoice,
  isProcessing,
}) => {
  if (!invoice) return null;

  const isBlocked = invoice.riskLevel === 'CRITICAL_RISK' || invoice.status === 'REJECTED';
  const isWarning = invoice.riskLevel === 'WARNING';
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
          maxWidth: '680px',
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
              <span style={{ fontSize: '1.8rem', fontWeight: 800, color: '#f8fafc', fontFamily: 'var(--font-mono)' }}>
                ${invoice.amountUsdc.toFixed(2)}
              </span>
              <span style={{ fontSize: '0.9rem', color: '#00f2fe', fontWeight: 700 }}>USDC</span>
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Gemini Risk Score</span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', justifyContent: 'flex-end' }}>
              <span style={{ fontSize: '1.8rem', fontWeight: 800, color: riskColor, fontFamily: 'var(--font-mono)' }}>
                {invoice.riskScore}
              </span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>/ 100</span>
            </div>
          </div>
        </div>

        {/* Gemini AI Deep Reasoning Box */}
        <div 
          style={{
            background: 'rgba(0, 82, 255, 0.06)',
            border: '1px solid rgba(0, 82, 255, 0.25)',
            borderRadius: '12px',
            padding: '16px 18px',
            marginBottom: '20px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <Cpu size={16} color="#00f2fe" />
            <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#00f2fe' }}>
              Gemini 2.5 Multimodal Audit Report
            </h4>
          </div>
          <p style={{ fontSize: '0.82rem', color: '#cbd5e1', lineHeight: '1.5', marginBottom: '12px' }}>
            {invoice.aiReasoning}
          </p>

          {/* Risk Flags Checklist */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {invoice.riskFlags.map((flag, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem' }}>
                {isBlocked ? (
                  <ShieldAlert size={14} color="#ef4444" />
                ) : isWarning ? (
                  <AlertTriangle size={14} color="#f59e0b" />
                ) : (
                  <CheckCircle2 size={14} color="#10b981" />
                )}
                <span style={{ color: isBlocked ? '#fca5a5' : '#e2e8f0' }}>{flag}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Line Items Table */}
        <div style={{ marginBottom: '20px' }}>
          <h4 style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Line Items Breakdown
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

        {/* Arc Mainnet Execution & EIP-712 Proof Specs */}
        <div 
          style={{
            background: 'rgba(15, 23, 42, 0.6)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '10px',
            padding: '14px 16px',
            marginBottom: '24px',
            fontSize: '0.78rem',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span style={{ color: 'var(--text-muted)' }}>Target Network:</span>
            <span style={{ color: '#f8fafc', fontWeight: 600 }}>Circle Arc Mainnet (Chain ID 5042)</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span style={{ color: 'var(--text-muted)' }}>Recipient EVM Address:</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontFamily: 'var(--font-mono)', color: '#00f2fe' }}>
                {invoice.vendorAddress.slice(0, 10)}...{invoice.vendorAddress.slice(-8)}
              </span>
              <button onClick={copyAddress} style={{ background: 'none', color: 'var(--text-muted)' }}>
                <Copy size={12} />
              </button>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span style={{ color: 'var(--text-muted)' }}>Doc Keccak256 Hash:</span>
            <span style={{ fontFamily: 'var(--font-mono)', color: '#93c5fd' }}>
              {invoice.docHash ? `${invoice.docHash.slice(0, 12)}...${invoice.docHash.slice(-8)}` : '0x7f83b165...'}
            </span>
          </div>
          {invoice.agentSignature && (
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ color: 'var(--text-muted)' }}>EIP-712 Agent Oracle Signature:</span>
              <span style={{ fontFamily: 'var(--font-mono)', color: '#34d399' }}>
                {invoice.agentSignature.slice(0, 14)}...{invoice.agentSignature.slice(-8)}
              </span>
            </div>
          )}
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--text-muted)' }}>Estimated Gas Fee:</span>
            <span style={{ color: '#10b981', fontWeight: 600 }}>~0.00035 USDC (Paid Natively)</span>
          </div>
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
            }}
          >
            Close
          </button>

          {isPaid ? (
            <a
              href={`https://explorer.arc.io/tx/${invoice.txHash}`}
              target="_blank"
              rel="noreferrer"
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
                textDecoration: 'none',
              }}
            >
              <span>View On Arc Explorer</span>
              <ExternalLink size={14} />
            </a>
          ) : isBlocked ? (
            <button
              disabled
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
                cursor: 'not-allowed',
              }}
            >
              <Lock size={14} />
              <span>Payment Blocked by Gemini Policy</span>
            </button>
          ) : (
            <button
              onClick={() => onPayInvoice(invoice)}
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
              }}
            >
              <Zap size={16} />
              <span>{isWarning ? 'Human Override & Dispatch on Arc' : 'Authorize & Pay on Arc'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
