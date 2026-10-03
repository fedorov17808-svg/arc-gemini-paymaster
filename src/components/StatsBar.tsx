import React from 'react';
import { 
  ShieldAlert, 
  Coins, 
  FileCheck2, 
  Zap, 
  Lock 
} from 'lucide-react';
import { Invoice, TreasuryPolicy } from '../types';

interface StatsBarProps {
  invoices: Invoice[];
  policy: TreasuryPolicy;
  treasuryBalance: number;
}

export const StatsBar: React.FC<StatsBarProps> = ({ invoices, policy, treasuryBalance }) => {
  const totalAudited = invoices.length;
  const paidInvoices = invoices.filter(i => i.status === 'PAID');
  const totalPaidUsdc = paidInvoices.reduce((acc, i) => acc + i.amountUsdc, 0);

  const blockedInvoices = invoices.filter(i => i.status === 'REJECTED' || i.riskLevel === 'CRITICAL_RISK');
  const fraudSavedUsdc = blockedInvoices.reduce((acc, i) => acc + i.amountUsdc, 0);

  const pendingSafe = invoices.filter(i => (i.status === 'AUDITED' || i.status === 'APPROVED') && i.riskLevel === 'SAFE');

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '14px', margin: '0 20px 20px 20px' }}>
      {/* Treasury Card */}
      <div className="glass-panel" style={{ padding: '16px 20px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>Arc Treasury Balance</span>
          <Coins size={18} color="#00f2fe" />
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
          <span style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f8fafc', fontFamily: 'var(--font-mono)' }}>
            {treasuryBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
          <span style={{ fontSize: '0.85rem', color: '#00f2fe', fontWeight: 700 }}>USDC</span>
        </div>
        <p style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginTop: '4px' }}>
          Native Gas & Treasury on Arc
        </p>
      </div>

      {/* Settled On Arc */}
      <div className="glass-panel" style={{ padding: '16px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>Settled on Arc Mainnet</span>
          <Zap size={18} color="#10b981" />
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
          <span style={{ fontSize: '1.5rem', fontWeight: 800, color: '#10b981', fontFamily: 'var(--font-mono)' }}>
            ${totalPaidUsdc.toFixed(2)}
          </span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            ({paidInvoices.length} txs)
          </span>
        </div>
        <p style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginTop: '4px' }}>
          Avg finality: ~0.4s • Avg gas: 0.00035 USDC
        </p>
      </div>

      {/* Fraud Blocked */}
      <div className="glass-panel" style={{ padding: '16px 20px', border: '1px solid rgba(239, 68, 68, 0.25)', background: 'rgba(239, 68, 68, 0.04)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span style={{ fontSize: '0.78rem', color: '#fca5a5', fontWeight: 600 }}>Fraud Blocked by Gemini</span>
          <ShieldAlert size={18} color="#ef4444" />
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
          <span style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ef4444', fontFamily: 'var(--font-mono)' }}>
            +${fraudSavedUsdc.toFixed(2)}
          </span>
          <span style={{ fontSize: '0.75rem', color: '#f87171' }}>
            saved
          </span>
        </div>
        <p style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginTop: '4px' }}>
          Homoglyph & spoofed invoices quarantined
        </p>
      </div>

      {/* Pipeline Status */}
      <div className="glass-panel" style={{ padding: '16px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>Queue & Safe Payouts</span>
          <FileCheck2 size={18} color="#60a5fa" />
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
          <span style={{ fontSize: '1.5rem', fontWeight: 800, color: '#60a5fa', fontFamily: 'var(--font-mono)' }}>
            {pendingSafe.length} ready
          </span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            / {totalAudited} total
          </span>
        </div>
        <p style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginTop: '4px' }}>
          Cap: &lt; ${policy.maxAutoApproveUsdc} auto-sign
        </p>
      </div>
    </div>
  );
};
