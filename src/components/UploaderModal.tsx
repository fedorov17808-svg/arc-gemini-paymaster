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

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setSelectedFileName(file.name);
      onAuditFile(file.name, file);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFileName(file.name);
      onAuditFile(file.name, file);
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
          maxWidth: '600px',
          padding: '28px',
          background: '#0d1322',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6)',
          borderRadius: '16px',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={20} color="#00f2fe" />
              <span>Audit Invoice with Gemini</span>
            </h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Multimodal document OCR, fraud verification, and policy conformance check.
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
            accept="image/*,.pdf" 
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

        {/* 1-Click Samples for DoraHacks Judges */}
        <div style={{ marginBottom: '22px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Or Test Instant Scenarios (For Judges):
            </span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
            <button
              onClick={() => onLoadSample(SAMPLE_INVOICES[0])}
              style={{
                textAlign: 'left',
                padding: '10px 12px',
                background: 'rgba(16, 185, 129, 0.08)',
                border: '1px solid rgba(16, 185, 129, 0.25)',
                borderRadius: '8px',
                color: '#e2e8f0',
                fontSize: '0.76rem',
              }}
            >
              <div style={{ fontWeight: 700, color: '#34d399', marginBottom: '2px' }}>🟢 Cloudflare AI Compute</div>
              <div style={{ color: 'var(--text-dim)' }}>$42.50 USDC • Safe & Valid</div>
            </button>

            <button
              onClick={() => onLoadSample(SAMPLE_INVOICES[1])}
              style={{
                textAlign: 'left',
                padding: '10px 12px',
                background: 'rgba(245, 158, 11, 0.08)',
                border: '1px solid rgba(245, 158, 11, 0.25)',
                borderRadius: '8px',
                color: '#e2e8f0',
                fontSize: '0.76rem',
              }}
            >
              <div style={{ fontWeight: 700, color: '#fbbf24', marginBottom: '2px' }}>🟡 Smart Contract Audit</div>
              <div style={{ color: 'var(--text-dim)' }}>$850.00 USDC • Over Limit</div>
            </button>

            <button
              onClick={() => onLoadSample(SAMPLE_INVOICES[2])}
              style={{
                textAlign: 'left',
                padding: '10px 12px',
                background: 'rgba(239, 68, 68, 0.08)',
                border: '1px solid rgba(239, 68, 68, 0.25)',
                borderRadius: '8px',
                color: '#e2e8f0',
                fontSize: '0.76rem',
              }}
            >
              <div style={{ fontWeight: 700, color: '#f87171', marginBottom: '2px' }}>🔴 Phishing Homoglyph Scam</div>
              <div style={{ color: 'var(--text-dim)' }}>$150.00 USDC • Blocked Threat</div>
            </button>

            <button
              onClick={() => onLoadSample(SAMPLE_INVOICES[3])}
              style={{
                textAlign: 'left',
                padding: '10px 12px',
                background: 'rgba(0, 242, 254, 0.08)',
                border: '1px solid rgba(0, 242, 254, 0.25)',
                borderRadius: '8px',
                color: '#e2e8f0',
                fontSize: '0.76rem',
              }}
            >
              <div style={{ fontWeight: 700, color: '#00f2fe', marginBottom: '2px' }}>🔵 Gemini API Token Bill</div>
              <div style={{ color: 'var(--text-dim)' }}>$28.90 USDC • Auto-Approved</div>
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
              padding: '8px 12px',
              background: 'rgba(7, 11, 20, 0.8)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '6px',
              color: '#f8fafc',
              fontSize: '0.78rem',
              fontFamily: 'var(--font-mono)',
            }}
          />
        </div>
      </div>
    </div>
  );
};
