import React from 'react';
import { 
  X, 
  Award, 
  CheckCircle2, 
  ExternalLink, 
  Cpu, 
  Zap, 
  ShieldCheck, 
  FileCode2 
} from 'lucide-react';
import { ARC_MAINNET_CONFIG } from '../services/arcWeb3';

interface HackathonInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HackathonInfoModal: React.FC<HackathonInfoModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(5, 8, 16, 0.88)',
        backdropFilter: 'blur(12px)',
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
          maxWidth: '740px',
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: '30px',
          background: '#0d1322',
          border: '1px solid rgba(0, 242, 254, 0.3)',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.75)',
          borderRadius: '16px',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '22px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'linear-gradient(135deg, #ff6b6b 0%, #ff8e53 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Award size={24} color="#ffffff" />
            </div>
            <div>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#f8fafc' }}>
                DoraHacks Judge Hub • Arc Microgrants (Circle)
              </h2>
              <p style={{ fontSize: '0.8rem', color: '#00f2fe' }}>
                Project Overview, Architecture & Evaluation Rubric
              </p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', color: 'var(--text-muted)' }}>
            <X size={18} />
          </button>
        </div>

        {/* Executive Summary */}
        <div style={{ background: 'rgba(0, 242, 254, 0.05)', border: '1px solid rgba(0, 242, 254, 0.2)', borderRadius: '12px', padding: '16px 20px', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f8fafc', marginBottom: '6px' }}>
            💡 Why ArcPaymaster AI is built for Circle Arc
          </h3>
          <p style={{ fontSize: '0.82rem', color: '#cbd5e1', lineHeight: '1.5' }}>
            Circle designed <strong>Arc Mainnet</strong> as an EVM Layer 1 with <strong>native USDC gas</strong> specifically to enable <em>agentic economic activity</em>. 
            Before Arc, AI agents faced a severe UX bottleneck: holding volatile gas tokens (like ETH), managing balance rebalancing, and suffering from opaque invoices.
            <strong> ArcPaymaster AI</strong> couples <strong>Google Gemini’s multimodal intelligence</strong> with Arc’s native USDC architecture to create a true autonomous corporate & DAO fiscal officer.
          </p>
        </div>

        {/* Core Pillars */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', marginBottom: '24px' }}>
          <div style={{ background: 'rgba(15, 23, 42, 0.6)', border: '1px solid var(--border-subtle)', borderRadius: '10px', padding: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', color: '#00f2fe' }}>
              <Cpu size={16} />
              <strong style={{ fontSize: '0.85rem' }}>Gemini Multimodal</strong>
            </div>
            <p style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
              Reads PDF bills, photos of receipts, and Slack/Telegram requests. Extracts line items, vendor taxes, and checks addresses.
            </p>
          </div>

          <div style={{ background: 'rgba(15, 23, 42, 0.6)', border: '1px solid var(--border-subtle)', borderRadius: '10px', padding: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', color: '#ef4444' }}>
              <ShieldCheck size={16} />
              <strong style={{ fontSize: '0.85rem' }}>Fraud Sentinel</strong>
            </div>
            <p style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
              Detects homoglyph domain attacks (e.g. Cyrillic lookalikes), advance fee fraud, duplicate submissions, and budget overflows.
            </p>
          </div>

          <div style={{ background: 'rgba(15, 23, 42, 0.6)', border: '1px solid var(--border-subtle)', borderRadius: '10px', padding: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', color: '#10b981' }}>
              <Zap size={16} />
              <strong style={{ fontSize: '0.85rem' }}>Arc Native USDC</strong>
            </div>
            <p style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
              Sub-second finality on Arc Mainnet (Chain ID 5042). Gas is deducted natively in USDC without wrapping or bridging.
            </p>
          </div>
        </div>

        {/* Network & Specs table */}
        <div style={{ marginBottom: '24px' }}>
          <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Circle Arc Network Connection Details
          </h4>
          <div style={{ background: 'rgba(7, 11, 20, 0.6)', border: '1px solid var(--border-subtle)', borderRadius: '10px', padding: '14px 16px', fontSize: '0.78rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0' }}>
              <span style={{ color: 'var(--text-muted)' }}>Network Name:</span>
              <span style={{ fontFamily: 'var(--font-mono)', color: '#f8fafc' }}>{ARC_MAINNET_CONFIG.chainName}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0' }}>
              <span style={{ color: 'var(--text-muted)' }}>Chain ID:</span>
              <span style={{ fontFamily: 'var(--font-mono)', color: '#00f2fe' }}>{ARC_MAINNET_CONFIG.chainId} (Hex: {ARC_MAINNET_CONFIG.chainIdHex})</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0' }}>
              <span style={{ color: 'var(--text-muted)' }}>RPC URL:</span>
              <span style={{ fontFamily: 'var(--font-mono)', color: '#f8fafc' }}>{ARC_MAINNET_CONFIG.rpcUrls[0]}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0' }}>
              <span style={{ color: 'var(--text-muted)' }}>Native Gas & Currency:</span>
              <span style={{ fontFamily: 'var(--font-mono)', color: '#10b981', fontWeight: 700 }}>USDC (18 Decimals)</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0' }}>
              <span style={{ color: 'var(--text-muted)' }}>Arc Explorer:</span>
              <a href={ARC_MAINNET_CONFIG.blockExplorerUrls[0]} target="_blank" rel="noreferrer" style={{ color: '#00f2fe', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span>{ARC_MAINNET_CONFIG.blockExplorerUrls[0]}</span>
                <ExternalLink size={12} />
              </a>
            </div>
          </div>
        </div>

        {/* Interactive Judge Walkthrough */}
        <div style={{ background: 'rgba(15, 23, 42, 0.4)', border: '1px solid var(--border-subtle)', borderRadius: '10px', padding: '16px', marginBottom: '20px' }}>
          <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f8fafc', marginBottom: '8px' }}>
            🎯 30-Second Testing Instructions for Judges:
          </h4>
          <ol style={{ fontSize: '0.8rem', color: '#cbd5e1', paddingLeft: '20px', lineHeight: '1.6' }}>
            <li>Click <strong>"Audit Invoice"</strong> in top header.</li>
            <li>Click the red <strong>"🔴 Phishing Homoglyph Scam"</strong> sample to see Gemini immediately quarantine the attack and prevent treasury loss.</li>
            <li>Click <strong>"⚡ Batch Settle Safe Invoices"</strong> to see native Arc sub-second transaction dispatch with celebratory confetti!</li>
            <li>Open <strong>"Agent Terminal"</strong> to query Gemini in natural language ("Which invoices can I pay right now?").</li>
          </ol>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button
            onClick={onClose}
            style={{
              padding: '10px 22px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #00f2fe 0%, #0052ff 100%)',
              color: '#070b14',
              fontSize: '0.85rem',
              fontWeight: 800,
            }}
          >
            Got it, Let's Explore!
          </button>
        </div>
      </div>
    </div>
  );
};
