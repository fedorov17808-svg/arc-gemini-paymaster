import React, { useState } from 'react';
import { 
  X, 
  Upload, 
  FileText, 
  Sparkles, 
  Key, 
  CheckCircle, 
  ShieldAlert, 
  AlertTriangle 
} from 'lucide-react';
import { SAMPLE_INVOICES } from '../data/sampleInvoices';
import { Invoice } from '../types';

interface UploaderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuditFile: (fileName: string, fileObj?: File) => Promise<void>;
  onLoadSample: (sample: Invoice) => void;
  isAuditing: boolean;
  apiKey: string;
  onApiKeyChange: (key: string) => void;
}

export const UploaderModal: React.FC<UploaderModalProps> = ({
  isOpen,
  onClose,
  onAuditFile,
  onLoadSample,
  isAuditing,
  apiKey,
  onApiKeyChange,
}) => {
  const [dragOver, setDragOver] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);

  if (!isOpen) return null;

  const MAX_FILE_SIZE_BYTES = 4 * 1024 * 1024; // 4MB maximum payload for Vercel Serverless

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.size > MAX_FILE_SIZE_BYTES) {
        alert('File size exceeds 4MB limit. Please upload an optimized PDF or image.');
        return;
      }
      setSelectedFileName(file.name);
      await onAuditFile(file.name, file);
    }
  };

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > MAX_FILE_SIZE_BYTES) {
        alert('File size exceeds 4MB limit. Please upload an optimized PDF or image.');
        return;
      }
      setSelectedFileName(file.name);
      await onAuditFile(file.name, file);
    }
  };

  // Helper to trigger realistic live document forensics
  const handleRunLiveScenarioAudit = async (scenarioType: 'SAFE' | 'AUDIT' | 'PHISHING' | 'GCP') => {
    let fileName = 'cloudflare_compute_bill.pdf';
    let content = `INVOICE #CF-2026-9481\nVENDOR: Cloudflare Network & AI Workers\nADDRESS: 0x17f6aD8eF329757995B054d4a78229F86C57FdE4\nAMOUNT: $42.50 USDC\nITEM: Workers AI Compute 4.2M tokens ($22.50)\nITEM: Global WAF Enterprise ($20.00)`;

    if (scenarioType === 'PHISHING') {
      fileName = 'circle_grant_verification_fee.pdf';
      // Note Cyrillic 'е' in Circlе
      content = `URGENT GRANT DISPERSAL NOTICE\nFROM: Circl\u0435 Foundation Grants Desk\nRECIPIENT WALLET: 0x9999dEAD8888beef111100007777cAFe00001234\nAMOUNT: $150.00 USDC\nFEE: Advance compliance escrow verification fee required within 24 hours.`;
    } else if (scenarioType === 'AUDIT') {
      fileName = 'smart_contract_audit_milestone.pdf';
      content = `DELIVERABLE INVOICE\nVENDOR: CipherDefend Smart Contract Labs\nADDRESS: 0x70997970C51812dc3A010C7d01b50e0d17dc79C8\nAMOUNT: $850.00 USDC\nITEM: ArcPaymaster.sol Formal Verification & Slither Audit Report`;
    } else if (scenarioType === 'GCP') {
      fileName = 'gcp_gemini_token_usage.pdf';
      content = `GOOGLE CLOUD PLATFORM\nVENDOR: Google Cloud Platform (Gemini 2.5 API)\nADDRESS: 0x32Be343B94f860124dC4fEe278FDCBD38C102D88\nAMOUNT: $28.90 USDC\nITEM: Gemini 2.5 Flash Tokens & Cloud Storage Bucket`;
    }

    const file = new File([new Blob([content], { type: 'text/plain' })], fileName, { type: 'text/plain' });
    setSelectedFileName(fileName);
    await onAuditFile(fileName, file);
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
          maxWidth: '560px',
          padding: '28px',
          background: '#0d1322',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6)',
          borderRadius: '16px',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc', marginBottom: '4px' }}>
              Upload & Audit Invoice Document
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Gemini 2.5 Flash inspects typography, EVM recipients, and homoglyphs.
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.06)',
              borderRadius: '50%',
              padding: '8px',
              color: 'var(--text-muted)',
              cursor: 'pointer',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Drag & Drop Area */}
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          style={{
            border: dragOver ? '2px dashed #00f2fe' : '2px dashed rgba(255, 255, 255, 0.15)',
            background: dragOver ? 'rgba(0, 242, 254, 0.05)' : 'rgba(15, 23, 42, 0.5)',
            borderRadius: '12px',
            padding: '30px 20px',
            textAlign: 'center',
            marginBottom: '20px',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
          onClick={() => document.getElementById('file-input-id')?.click()}
        >
          <input 
            type="file" 
            id="file-input-id" 
            style={{ display: 'none' }} 
            accept="image/*,.pdf,.txt" 
            onChange={handleFileInput} 
          />
          <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(0, 242, 254, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px auto' }}>
            <Upload size={24} color="#00f2fe" />
          </div>
          <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#f8fafc', marginBottom: '4px' }}>
            {selectedFileName ? selectedFileName : 'Upload Invoice, Receipt, or Bill'}
          </h4>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Drag and drop PNG, JPG, or PDF here, or click to browse
          </p>
          {isAuditing && (
            <div style={{ marginTop: '14px', color: '#00f2fe', fontSize: '0.8rem', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#00f2fe', animation: 'pulseGlow 1s infinite' }} />
              <span>Gemini 2.5 Flash analyzing visual structure & fraud markers...</span>
            </div>
          )}
        </div>

        {/* 1-Click Live Forensic Scenarios for Judges */}
        <div style={{ marginBottom: '22px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Or Trigger Live Forensic Scenarios (For Judges):
            </span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
            <button
              onClick={() => handleRunLiveScenarioAudit('SAFE')}
              disabled={isAuditing}
              style={{
                textAlign: 'left',
                padding: '10px 12px',
                background: 'rgba(16, 185, 129, 0.08)',
                border: '1px solid rgba(16, 185, 129, 0.25)',
                borderRadius: '8px',
                color: '#e2e8f0',
                fontSize: '0.76rem',
                cursor: 'pointer',
              }}
            >
              <div style={{ fontWeight: 700, color: '#34d399', marginBottom: '2px' }}>🟢 Cloudflare AI Compute</div>
              <div style={{ color: 'var(--text-dim)' }}>$42.50 USDC • Live Forensic Run</div>
            </button>

            <button
              onClick={() => handleRunLiveScenarioAudit('AUDIT')}
              disabled={isAuditing}
              style={{
                textAlign: 'left',
                padding: '10px 12px',
                background: 'rgba(245, 158, 11, 0.08)',
                border: '1px solid rgba(245, 158, 11, 0.25)',
                borderRadius: '8px',
                color: '#e2e8f0',
                fontSize: '0.76rem',
                cursor: 'pointer',
              }}
            >
              <div style={{ fontWeight: 700, color: '#fbbf24', marginBottom: '2px' }}>🟡 Smart Contract Audit</div>
              <div style={{ color: 'var(--text-dim)' }}>$850.00 USDC • Multi-Sig Flow</div>
            </button>

            <button
              onClick={() => handleRunLiveScenarioAudit('PHISHING')}
              disabled={isAuditing}
              style={{
                textAlign: 'left',
                padding: '10px 12px',
                background: 'rgba(239, 68, 68, 0.08)',
                border: '1px solid rgba(239, 68, 68, 0.25)',
                borderRadius: '8px',
                color: '#e2e8f0',
                fontSize: '0.76rem',
                cursor: 'pointer',
              }}
            >
              <div style={{ fontWeight: 700, color: '#f87171', marginBottom: '2px' }}>🔴 Phishing Homoglyph Scam</div>
              <div style={{ color: 'var(--text-dim)' }}>$150.00 USDC • Circlе Spoofing</div>
            </button>

            <button
              onClick={() => handleRunLiveScenarioAudit('GCP')}
              disabled={isAuditing}
              style={{
                textAlign: 'left',
                padding: '10px 12px',
                background: 'rgba(0, 242, 254, 0.08)',
                border: '1px solid rgba(0, 242, 254, 0.25)',
                borderRadius: '8px',
                color: '#e2e8f0',
                fontSize: '0.76rem',
                cursor: 'pointer',
              }}
            >
              <div style={{ fontWeight: 700, color: '#00f2fe', marginBottom: '2px' }}>🔵 Gemini API Token Bill</div>
              <div style={{ color: 'var(--text-dim)' }}>$28.90 USDC • Autonomous Cap</div>
            </button>
          </div>
        </div>

        {/* Optional Gemini API Key configuration */}
        <div style={{ background: 'rgba(15, 23, 42, 0.6)', border: '1px solid var(--border-subtle)', borderRadius: '10px', padding: '12px 14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <Key size={14} color="#00f2fe" />
            <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-main)' }}>
              Gemini API Key (Optional)
            </span>
          </div>
          <input
            type="password"
            placeholder="AIzaSy... (leave blank to run high-fidelity local AI engine)"
            value={apiKey}
            onChange={(e) => onApiKeyChange(e.target.value)}
            style={{
              width: '100%',
              background: 'rgba(0, 0, 0, 0.3)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '6px',
              padding: '8px 12px',
              color: '#ffffff',
              fontSize: '0.78rem',
              fontFamily: 'monospace',
              outline: 'none',
            }}
          />
        </div>
      </div>
    </div>
  );
};
