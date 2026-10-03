import React, { useState } from 'react';
import { 
  CheckCircle2, 
  AlertTriangle, 
  ShieldAlert, 
  Zap, 
  ExternalLink, 
  Search, 
  Eye, 
  ArrowUpRight,
  Filter
} from 'lucide-react';
import { Invoice } from '../types';

interface InvoiceListProps {
  invoices: Invoice[];
  onSelectInvoice: (invoice: Invoice) => void;
  onPayInvoice: (invoice: Invoice) => void;
  onPayAllSafe: () => void;
  isProcessing: boolean;
}

export const InvoiceList: React.FC<InvoiceListProps> = ({
  invoices,
  onSelectInvoice,
  onPayInvoice,
  onPayAllSafe,
  isProcessing,
}) => {
  const [filter, setFilter] = useState<'ALL' | 'SAFE' | 'WARNING' | 'BLOCKED' | 'PAID'>('ALL');
  const [search, setSearch] = useState('');

  const filteredInvoices = invoices.filter((inv) => {
    const matchesSearch = 
      inv.vendorName.toLowerCase().includes(search.toLowerCase()) ||
      inv.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
      inv.vendorCategory.toLowerCase().includes(search.toLowerCase());

    if (!matchesSearch) return false;

    if (filter === 'SAFE') return inv.riskLevel === 'SAFE' && inv.status !== 'PAID';
    if (filter === 'WARNING') return inv.riskLevel === 'WARNING' && inv.status !== 'PAID';
    if (filter === 'BLOCKED') return inv.riskLevel === 'CRITICAL_RISK' || inv.status === 'REJECTED';
    if (filter === 'PAID') return inv.status === 'PAID';
    return true;
  });

  const safeCount = invoices.filter(i => i.riskLevel === 'SAFE' && (i.status === 'AUDITED' || i.status === 'APPROVED')).length;
  const safeSum = invoices
    .filter(i => i.riskLevel === 'SAFE' && (i.status === 'AUDITED' || i.status === 'APPROVED'))
    .reduce((acc, i) => acc + i.amountUsdc, 0);

  return (
    <div className="glass-panel" style={{ margin: '0 20px 24px 20px', padding: '24px' }}>
      {/* Top Controls: Search, Tabs & Batch Action */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap', marginBottom: '20px' }}>
        <div>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>Fiscal Audit & Paymaster Queue</span>
            <span style={{ fontSize: '0.75rem', background: 'rgba(255,255,255,0.08)', padding: '2px 8px', borderRadius: '12px', color: 'var(--text-muted)' }}>
              {invoices.length} total
            </span>
          </h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Gemini parses incoming bills, evaluates treasury risk policies, and signs Arc transactions.
          </p>
        </div>

        {/* Batch Pay Button */}
        {safeCount > 0 && (
          <button
            onClick={onPayAllSafe}
            disabled={isProcessing}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: '#ffffff',
              fontWeight: 700,
              fontSize: '0.85rem',
              padding: '10px 18px',
              borderRadius: '10px',
              boxShadow: '0 4px 20px rgba(16, 185, 129, 0.3)',
              opacity: isProcessing ? 0.7 : 1,
            }}
          >
            <Zap size={16} />
            <span>Batch Settle {safeCount} Safe Invoices (${safeSum.toFixed(2)} USDC)</span>
          </button>
        )}
      </div>

      {/* Filter Tabs & Search */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '14px', flexWrap: 'wrap', marginBottom: '20px' }}>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {[
            { key: 'ALL', label: 'All Invoices' },
            { key: 'SAFE', label: `⚡ Ready to Pay (${invoices.filter(i => i.riskLevel === 'SAFE' && i.status !== 'PAID').length})` },
            { key: 'WARNING', label: `⚠️ Over Limit / Review (${invoices.filter(i => i.riskLevel === 'WARNING' && i.status !== 'PAID').length})` },
            { key: 'BLOCKED', label: `🛡️ Blocked Scams (${invoices.filter(i => i.riskLevel === 'CRITICAL_RISK' || i.status === 'REJECTED').length})` },
            { key: 'PAID', label: `✅ Settled on Arc (${invoices.filter(i => i.status === 'PAID').length})` },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key as any)}
              style={{
                fontSize: '0.8rem',
                fontWeight: 600,
                padding: '6px 14px',
                borderRadius: '8px',
                background: filter === tab.key ? 'rgba(0, 242, 254, 0.15)' : 'rgba(255, 255, 255, 0.04)',
                border: filter === tab.key ? '1px solid rgba(0, 242, 254, 0.4)' : '1px solid transparent',
                color: filter === tab.key ? '#00f2fe' : 'var(--text-muted)',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div style={{ position: 'relative', width: '260px' }}>
          <Search size={16} color="var(--text-dim)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Search vendor or ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px 8px 36px',
              background: 'rgba(15, 23, 42, 0.6)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '8px',
              color: 'var(--text-main)',
              fontSize: '0.82rem',
            }}
          />
        </div>
      </div>

      {/* Invoice Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '16px' }}>
        {filteredInvoices.map((inv) => {
          const isBlocked = inv.riskLevel === 'CRITICAL_RISK' || inv.status === 'REJECTED';
          const isWarning = inv.riskLevel === 'WARNING';
          const isPaid = inv.status === 'PAID';

          let borderStyle = '1px solid var(--border-subtle)';
          let badgeBg = 'rgba(16, 185, 129, 0.15)';
          let badgeColor = '#34d399';
          let badgeLabel = 'SAFE • 1-CLICK ARC PAY';

          if (isBlocked) {
            borderStyle = '1px solid rgba(239, 68, 68, 0.4)';
            badgeBg = 'rgba(239, 68, 68, 0.15)';
            badgeColor = '#f87171';
            badgeLabel = 'CRITICAL FRAUD BLOCKED';
          } else if (isWarning) {
            borderStyle = '1px solid rgba(245, 158, 11, 0.4)';
            badgeBg = 'rgba(245, 158, 11, 0.15)';
            badgeColor = '#fbbf24';
            badgeLabel = 'REQUIRES REVIEW (> $500)';
          } else if (isPaid) {
            borderStyle = '1px solid rgba(0, 242, 254, 0.3)';
            badgeBg = 'rgba(0, 242, 254, 0.15)';
            badgeColor = '#00f2fe';
            badgeLabel = 'SETTLED ON ARC MAINNET';
          }

          return (
            <div
              key={inv.id}
              style={{
                background: 'rgba(13, 20, 36, 0.75)',
                border: borderStyle,
                borderRadius: '12px',
                padding: '18px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'transform 0.2s ease, border-color 0.2s ease',
              }}
            >
              <div>
                {/* Header row: ID & Status Badge */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-dim)' }}>
                    {inv.invoiceNumber}
                  </span>
                  <span
                    style={{
                      fontSize: '0.68rem',
                      fontWeight: 700,
                      padding: '3px 8px',
                      borderRadius: '6px',
                      background: badgeBg,
                      color: badgeColor,
                      letterSpacing: '0.02em',
                    }}
                  >
                    {badgeLabel}
                  </span>
                </div>

                {/* Vendor & Category */}
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#f8fafc', marginBottom: '4px' }}>
                  {inv.vendorName}
                </h3>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
                  {inv.vendorCategory}
                </p>

                {/* Amount display */}
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginBottom: '14px' }}>
                  <span style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f8fafc', fontFamily: 'var(--font-mono)' }}>
                    {inv.amountUsdc.toFixed(2)}
                  </span>
                  <span style={{ fontSize: '0.85rem', color: '#00f2fe', fontWeight: 700 }}>USDC</span>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginLeft: 'auto' }}>
                    Gas: ~0.00035 USDC
                  </span>
                </div>

                {/* AI Reasoning Preview */}
                <div 
                  style={{
                    background: 'rgba(0, 0, 0, 0.25)',
                    borderLeft: `3px solid ${badgeColor}`,
                    padding: '8px 12px',
                    borderRadius: '0 6px 6px 0',
                    fontSize: '0.74rem',
                    color: 'var(--text-muted)',
                    lineHeight: '1.4',
                    marginBottom: '16px',
                  }}
                >
                  <strong style={{ color: '#f8fafc' }}>Gemini Analysis: </strong>
                  {inv.riskSummary}
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '14px' }}>
                <button
                  onClick={() => onSelectInvoice(inv)}
                  style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--text-main)',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    padding: '8px 12px',
                    borderRadius: '8px',
                  }}
                >
                  <Eye size={14} />
                  <span>Inspect Audit</span>
                </button>

                {isPaid ? (
                  <a
                    href={`https://explorer.arc.io/tx/${inv.txHash}`}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      color: '#00f2fe',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      padding: '8px 10px',
                      textDecoration: 'none',
                    }}
                  >
                    <span>Tx Hash</span>
                    <ExternalLink size={12} />
                  </a>
                ) : isBlocked ? (
                  <button
                    disabled
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      background: 'rgba(239, 68, 68, 0.1)',
                      border: '1px solid rgba(239, 68, 68, 0.25)',
                      color: '#f87171',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      padding: '8px 14px',
                      borderRadius: '8px',
                      cursor: 'not-allowed',
                      opacity: 0.8,
                    }}
                  >
                    <ShieldAlert size={14} />
                    <span>Payout Blocked</span>
                  </button>
                ) : (
                  <button
                    onClick={() => onPayInvoice(inv)}
                    disabled={isProcessing}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      background: isWarning 
                        ? 'rgba(245, 158, 11, 0.15)' 
                        : 'linear-gradient(135deg, #00f2fe 0%, #0052ff 100%)',
                      border: isWarning ? '1px solid #f59e0b' : 'none',
                      color: isWarning ? '#fbbf24' : '#070b14',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      padding: '8px 14px',
                      borderRadius: '8px',
                      boxShadow: isWarning ? 'none' : '0 2px 10px rgba(0, 242, 254, 0.2)',
                    }}
                  >
                    <Zap size={14} />
                    <span>{isWarning ? 'Override & Pay' : 'Pay on Arc'}</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
