import React from 'react';
import { 
  Zap, 
  KeyRound, 
  ShieldAlert, 
  UploadCloud, 
  ArrowRight, 
  CheckCircle2,
  Fuel,
  Activity
} from 'lucide-react';
import { Invoice } from '../types';

interface JudgeShowcaseProps {
  onSelectScenario: (scenario: 'autonomous' | 'multisig' | 'phishing' | 'upload') => void;
  invoices: Invoice[];
}

export const JudgeShowcase: React.FC<JudgeShowcaseProps> = ({
  onSelectScenario,
  invoices,
}) => {
  const cloudflareInv = invoices.find(i => i.id === 'inv-cf-802');
  const phishInv = invoices.find(i => i.id === 'inv-phish-666');
  const isCloudflarePaid = cloudflareInv?.status === 'PAID';
  const isPhishQuarantined = phishInv?.status === 'REJECTED' && !!phishInv?.txHash;

  return (
    <div 
      className="glass-panel" 
      style={{ 
        margin: '0 0 28px 0', 
        padding: '24px', 
        border: '1px solid rgba(0, 242, 254, 0.3)',
        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(7, 11, 20, 0.95) 100%)',
        boxShadow: '0 10px 40px -10px rgba(0, 242, 254, 0.15)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <Activity size={18} color="#00f2fe" />
            <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#f8fafc', margin: 0, letterSpacing: '-0.02em' }}>
              Enterprise Operations & Continuous Sentinel Streams
            </h2>
            <span 
              style={{ 
                fontSize: '0.65rem', 
                background: 'linear-gradient(90deg, #00f2fe, #0052ff)', 
                color: '#070b14', 
                fontWeight: 800, 
                padding: '2px 8px', 
                borderRadius: '999px',
                textTransform: 'uppercase'
              }}
            >
              Active Pipeline
            </span>
          </div>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0 }}>
            Automated pipeline for verified recurring expenses, executive multi-sig escalations, and active threat neutralization on Circle Arc.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.72rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(16, 185, 129, 0.1)', padding: '4px 10px', borderRadius: '6px', border: '1px solid rgba(16, 185, 129, 0.25)' }}>
            <Fuel size={12} />
            <span>Circle Paymaster Gas: $0.00 (Native Sponsored)</span>
          </span>
        </div>
      </div>

      {/* 4 Enterprise Operational Stream Cards */}
      <div 
        style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', 
          gap: '16px' 
        }}
      >
        {/* Stream 1: Autonomous */}
        <div 
          onClick={() => onSelectScenario('autonomous')}
          style={{
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            borderRadius: '12px',
            padding: '16px',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            position: 'relative',
            overflow: 'hidden',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#10b981';
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 8px 25px rgba(16, 185, 129, 0.2)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'rgba(16, 185, 129, 0.3)';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#10b981', background: 'rgba(16, 185, 129, 0.12)', padding: '2px 8px', borderRadius: '4px' }}>
                VERIFIED STREAM • AUTONOMOUS
              </span>
              {isCloudflarePaid && (
                <span style={{ fontSize: '0.68rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '3px', fontWeight: 700 }}>
                  <CheckCircle2 size={12} /> Disbursed
                </span>
              )}
            </div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f8fafc', margin: '0 0 6px 0' }}>
              Cloudflare Network & AI ($42.50)
            </h4>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '0 0 12px 0', lineHeight: 1.4 }}>
              Low-risk recurring cloud infrastructure. Validated via EIP-712 ECDSA oracle signature with sub-second Arc finality.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '10px' }}>
            <span style={{ fontSize: '0.72rem', color: '#93c5fd', fontWeight: 600 }}>
              Risk: 4/100 (Verified)
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#10b981', fontSize: '0.75rem', fontWeight: 700 }}>
              <span>{isCloudflarePaid ? 'Inspect Arc Receipt' : 'Execute Disburse'}</span>
              <ArrowRight size={14} />
            </div>
          </div>
        </div>

        {/* Stream 2: Dual Multi-Sig */}
        <div 
          onClick={() => onSelectScenario('multisig')}
          style={{
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            borderRadius: '12px',
            padding: '16px',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#f59e0b';
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 8px 25px rgba(245, 158, 11, 0.2)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'rgba(245, 158, 11, 0.3)';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#f59e0b', background: 'rgba(245, 158, 11, 0.12)', padding: '2px 8px', borderRadius: '4px' }}>
                THRESHOLD ESCALATION • MULTI-SIG
              </span>
              <KeyRound size={14} color="#f59e0b" />
            </div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f8fafc', margin: '0 0 6px 0' }}>
              ConsenSys Diligence Audit ($850.00)
            </h4>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '0 0 12px 0', lineHeight: 1.4 }}>
              Exceeds the $500.00 USDC autonomous threshold. Halts autonomous execution; routes to Treasury Officer for co-signature.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '10px' }}>
            <span style={{ fontSize: '0.72rem', color: '#f59e0b', fontWeight: 600 }}>
              Cap: $500 Exceeded
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#f59e0b', fontSize: '0.75rem', fontWeight: 700 }}>
              <span>Review Multi-Sig</span>
              <ArrowRight size={14} />
            </div>
          </div>
        </div>

        {/* Stream 3: Phishing & Quarantine */}
        <div 
          onClick={() => onSelectScenario('phishing')}
          style={{
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '12px',
            padding: '16px',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#ef4444';
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 8px 25px rgba(239, 68, 68, 0.2)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.3)';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#f87171', background: 'rgba(239, 68, 68, 0.12)', padding: '2px 8px', borderRadius: '4px' }}>
                SENTINEL QUARANTINE • THREAT BLOCKED
              </span>
              <ShieldAlert size={14} color="#f87171" />
            </div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f8fafc', margin: '0 0 6px 0' }}>
              Circlе Grants Phish ($150.00)
            </h4>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '0 0 12px 0', lineHeight: 1.4 }}>
              Cyrillic homoglyph advance-fee exploit. Gemini Sentinel quarantined the fraudulent bill and blacklisted the scammer on Arc.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '10px' }}>
            <span style={{ fontSize: '0.72rem', color: '#f87171', fontWeight: 600 }}>
              Risk: 98/100 (Critical)
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#f87171', fontSize: '0.75rem', fontWeight: 700 }}>
              <span>{isPhishQuarantined ? 'View On-Chain Block' : 'Inspect Threat'}</span>
              <ArrowRight size={14} />
            </div>
          </div>
        </div>

        {/* Stream 4: Upload Custom */}
        <div 
          onClick={() => onSelectScenario('upload')}
          style={{
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid rgba(0, 242, 254, 0.3)',
            borderRadius: '12px',
            padding: '16px',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#00f2fe';
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 242, 254, 0.2)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'rgba(0, 242, 254, 0.3)';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#00f2fe', background: 'rgba(0, 242, 254, 0.12)', padding: '2px 8px', borderRadius: '4px' }}>
                DOCUMENT INGESTION • MULTIMODAL OCR
              </span>
              <UploadCloud size={14} color="#00f2fe" />
            </div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f8fafc', margin: '0 0 6px 0' }}>
              Ingest Vendor Invoice
            </h4>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '0 0 12px 0', lineHeight: 1.4 }}>
              Drop invoice PDF or image. Gemini 2.5 Flash Vision extracts line items, validates tax credentials, and generates EIP-712 proofs.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '10px' }}>
            <span style={{ fontSize: '0.72rem', color: '#00f2fe', fontWeight: 600 }}>
              Gemini 2.5 Flash
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#00f2fe', fontSize: '0.75rem', fontWeight: 700 }}>
              <span>Launch Ingestion</span>
              <ArrowRight size={14} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
