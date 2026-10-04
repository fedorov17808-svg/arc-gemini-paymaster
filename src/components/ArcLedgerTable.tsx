import React from 'react';
import { ExternalLink, CheckCircle2, Zap, ShieldAlert } from 'lucide-react';
import { Invoice } from '../types';

interface ArcLedgerTableProps {
  paidInvoices: Invoice[];
  onOpenExplorer?: (invoice: Invoice) => void;
}

export const ArcLedgerTable: React.FC<ArcLedgerTableProps> = ({ paidInvoices, onOpenExplorer }) => {
  if (paidInvoices.length === 0) return null;

  return (
    <div className="glass-panel" style={{ margin: '0 0 24px 0', padding: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Zap size={18} color="#00f2fe" />
            <span>On-Chain Arc Mainnet Settlement Ledger</span>
          </h3>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Immutable records broadcasted to Arc Network (Chain ID: 5042) with native USDC gas sponsored by Paymaster.
          </p>
        </div>
        <span style={{ fontSize: '0.75rem', color: '#10b981', background: 'rgba(16, 185, 129, 0.1)', padding: '4px 10px', borderRadius: '999px', border: '1px solid rgba(16, 185, 129, 0.3)', fontWeight: 600 }}>
          {paidInvoices.length} Finalized Arc Transactions
        </span>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.8rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)', color: 'var(--text-muted)' }}>
              <th style={{ padding: '10px 12px', fontWeight: 600 }}>Invoice / Vendor</th>
              <th style={{ padding: '10px 12px', fontWeight: 600 }}>Status / Action</th>
              <th style={{ padding: '10px 12px', fontWeight: 600 }}>Settled Value</th>
              <th style={{ padding: '10px 12px', fontWeight: 600 }}>Arc Gas</th>
              <th style={{ padding: '10px 12px', fontWeight: 600 }}>Arc Block</th>
              <th style={{ padding: '10px 12px', fontWeight: 600 }}>Transaction Hash</th>
              <th style={{ padding: '10px 12px', fontWeight: 600 }}>Arcscan</th>
            </tr>
          </thead>
          <tbody>
            {paidInvoices.map((inv) => {
              const isQuarantine = inv.status === 'REJECTED' || inv.riskLevel === 'CRITICAL_RISK';
              return (
                <tr key={inv.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                  <td style={{ padding: '12px 12px' }}>
                    <div style={{ fontWeight: 600, color: '#f8fafc' }}>{inv.vendorName}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>{inv.invoiceNumber}</div>
                  </td>
                  <td style={{ padding: '12px 12px' }}>
                    {isQuarantine ? (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.7rem', color: '#f87171', background: 'rgba(239, 68, 68, 0.1)', padding: '3px 8px', borderRadius: '4px', border: '1px solid rgba(239, 68, 68, 0.3)', fontWeight: 700 }}>
                        <ShieldAlert size={12} /> QUARANTINED
                      </span>
                    ) : (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.7rem', color: '#34d399', background: 'rgba(16, 185, 129, 0.1)', padding: '3px 8px', borderRadius: '4px', border: '1px solid rgba(16, 185, 129, 0.3)', fontWeight: 700 }}>
                        <CheckCircle2 size={12} /> SETTLED
                      </span>
                    )}
                  </td>
                  <td style={{ padding: '12px 12px', fontFamily: 'var(--font-mono)', fontWeight: 700, color: isQuarantine ? '#94a3b8' : '#10b981' }}>
                    {isQuarantine ? '$0.00 USDC' : `$${inv.amountUsdc.toFixed(2)} USDC`}
                  </td>
                  <td style={{ padding: '12px 12px', fontFamily: 'var(--font-mono)', color: '#00f2fe' }}>
                    <span style={{ color: '#10b981', fontWeight: 600 }}>0.00 USDC</span>{' '}
                    <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>(Sponsored)</span>
                  </td>
                  <td style={{ padding: '12px 12px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                    #{inv.arcBlockNumber ?? 1420108}
                  </td>
                  <td style={{ padding: '12px 12px', fontFamily: 'var(--font-mono)', color: '#93c5fd' }}>
                    {inv.txHash ? `${inv.txHash.slice(0, 10)}...${inv.txHash.slice(-8)}` : '0x...'}
                  </td>
                  <td style={{ padding: '12px 12px' }}>
                    <button
                      onClick={() => onOpenExplorer && onOpenExplorer(inv)}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        background: 'rgba(0, 242, 254, 0.1)',
                        border: '1px solid rgba(0, 242, 254, 0.3)',
                        color: '#00f2fe',
                        padding: '4px 10px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                      }}
                    >
                      <span>Arcscan</span>
                      <ExternalLink size={12} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
