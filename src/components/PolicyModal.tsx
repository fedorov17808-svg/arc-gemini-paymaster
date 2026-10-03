import React, { useState } from 'react';
import { 
  X, 
  SlidersHorizontal, 
  ShieldCheck, 
  Save 
} from 'lucide-react';
import { TreasuryPolicy } from '../types';

interface PolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
  policy: TreasuryPolicy;
  onSavePolicy: (newPolicy: TreasuryPolicy) => void;
}

export const PolicyModal: React.FC<PolicyModalProps> = ({
  isOpen,
  onClose,
  policy,
  onSavePolicy,
}) => {
  const [formData, setFormData] = useState<TreasuryPolicy>({ ...policy });

  if (!isOpen) return null;

  const handleSave = () => {
    onSavePolicy(formData);
    onClose();
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
          maxWidth: '540px',
          padding: '28px',
          background: '#0d1322',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6)',
          borderRadius: '16px',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShieldCheck size={20} color="#10b981" />
            </div>
            <div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#f8fafc' }}>
                Treasury Policy & Safety Limits
              </h2>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Configure rules enforced by Gemini before signing Arc transactions.
              </p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', color: 'var(--text-muted)' }}>
            <X size={18} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
          {/* Max Single Auto-Approval */}
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#e2e8f0', marginBottom: '6px' }}>
              Max Single Auto-Approval Limit (USDC)
            </label>
            <input 
              type="number"
              value={formData.maxAutoApproveUsdc}
              onChange={(e) => setFormData({ ...formData, maxAutoApproveUsdc: Number(e.target.value) })}
              style={{
                width: '100%',
                padding: '10px 14px',
                background: 'rgba(7, 11, 20, 0.8)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '8px',
                color: '#f8fafc',
                fontSize: '0.85rem',
                fontFamily: 'var(--font-mono)',
              }}
            />
            <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>
              Invoices above this amount will be flagged as WARNING and require manual confirmation.
            </span>
          </div>

          {/* Daily Budget Cap */}
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#e2e8f0', marginBottom: '6px' }}>
              Daily Maximum Expenditure Budget (USDC)
            </label>
            <input 
              type="number"
              value={formData.dailyBudgetUsdc}
              onChange={(e) => setFormData({ ...formData, dailyBudgetUsdc: Number(e.target.value) })}
              style={{
                width: '100%',
                padding: '10px 14px',
                background: 'rgba(7, 11, 20, 0.8)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '8px',
                color: '#f8fafc',
                fontSize: '0.85rem',
                fontFamily: 'var(--font-mono)',
              }}
            />
          </div>

          {/* Fraud Threshold */}
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#e2e8f0', marginBottom: '6px' }}>
              Fraud Quarantine Threshold: {formData.fraudThresholdScore} / 100
            </label>
            <input 
              type="range"
              min="20"
              max="90"
              value={formData.fraudThresholdScore}
              onChange={(e) => setFormData({ ...formData, fraudThresholdScore: Number(e.target.value) })}
              style={{ width: '100%', accentColor: '#00f2fe' }}
            />
            <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>
              Any document with Gemini Risk Score &gt; {formData.fraudThresholdScore} is permanently locked.
            </span>
          </div>

          {/* Auto-execute checkbox */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '6px' }}>
            <input 
              type="checkbox"
              id="auto-exec"
              checked={formData.autoExecuteSafe}
              onChange={(e) => setFormData({ ...formData, autoExecuteSafe: e.target.checked })}
              style={{ width: '18px', height: '18px', accentColor: '#10b981' }}
            />
            <label htmlFor="auto-exec" style={{ fontSize: '0.82rem', color: '#e2e8f0' }}>
              Enable Autonomous Execution for verified Low-Risk bills
            </label>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <button
            onClick={onClose}
            style={{
              padding: '10px 16px',
              borderRadius: '8px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-main)',
              fontSize: '0.82rem',
              fontWeight: 600,
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '10px 20px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #00f2fe 0%, #0052ff 100%)',
              color: '#070b14',
              fontSize: '0.82rem',
              fontWeight: 800,
            }}
          >
            <Save size={16} />
            <span>Save Policies</span>
          </button>
        </div>
      </div>
    </div>
  );
};
