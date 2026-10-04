import React from 'react';
import { 
  Bot, 
  Wallet as WalletIcon, 
  ShieldCheck, 
  Terminal, 
  HelpCircle, 
  PlusCircle, 
  SlidersHorizontal,
  ExternalLink,
  RotateCcw
} from 'lucide-react';
import { WalletState } from '../types';

interface HeaderProps {
  wallet: WalletState;
  onConnectWallet: () => void;
  onSwitchToArc: () => void;
  onToggleAutonomousMode: () => void;
  onOpenTerminal: () => void;
  onOpenPolicy: () => void;
  onOpenHackathonInfo: () => void;
  onOpenUploader: () => void;
  onResetDemo?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  wallet,
  onConnectWallet,
  onSwitchToArc,
  onToggleAutonomousMode,
  onOpenTerminal,
  onOpenPolicy,
  onOpenHackathonInfo,
  onOpenUploader,
  onResetDemo,
}) => {
  return (
    <header className="glass-panel" style={{ margin: '16px 20px', padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
      {/* Brand & Project Identity */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div 
          style={{ 
            width: '44px', 
            height: '44px', 
            borderRadius: '12px', 
            background: 'linear-gradient(135deg, #00f2fe 0%, #0052ff 100%)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            boxShadow: '0 0 20px rgba(0, 242, 254, 0.4)'
          }}
        >
          <Bot size={26} color="#070b14" strokeWidth={2.5} />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 800, background: 'linear-gradient(90deg, #ffffff 40%, #00f2fe 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              ArcPaymaster AI
            </h1>
            <span style={{ fontSize: '0.65rem', padding: '2px 8px', borderRadius: '999px', background: 'rgba(0, 242, 254, 0.12)', border: '1px solid rgba(0, 242, 254, 0.3)', color: '#00f2fe', fontWeight: 600 }}>
              Gemini 2.5 Flash
            </span>
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Autonomous Fiscal Agent on <strong style={{ color: '#f8fafc' }}>Circle Arc Mainnet</strong>
          </p>
        </div>
      </div>

      {/* Network & Track Badges */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
        {/* DoraHacks Tag */}
        <button
          onClick={onOpenHackathonInfo}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: 'rgba(255, 107, 107, 0.12)',
            border: '1px solid rgba(255, 107, 107, 0.35)',
            color: '#ff8787',
            padding: '6px 12px',
            borderRadius: '999px',
            fontSize: '0.75rem',
            fontWeight: 600,
          }}
          title="Click to view Hackathon Details & Judge Rubric"
        >
          <span>🏆 DoraHacks Arc Microgrant</span>
          <HelpCircle size={14} />
        </button>

        {/* Arc Network Status */}
        <div 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '7px', 
            background: 'rgba(15, 23, 42, 0.8)', 
            border: '1px solid var(--border-subtle)', 
            padding: '6px 14px', 
            borderRadius: '999px',
            fontSize: '0.75rem',
            color: 'var(--text-main)'
          }}
        >
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px #10b981' }} />
          <span>Arc Mainnet (ID: 5042)</span>
          <span style={{ color: 'var(--text-dim)' }}>|</span>
          <span style={{ color: '#00f2fe', fontWeight: 600 }}>Gas: USDC</span>
          <span style={{ color: 'var(--text-dim)' }}>|</span>
          <span style={{ color: '#34d399', fontWeight: 700 }} title="Circle Paymaster sponsors gas fees automatically">
            ⚡ Gas Sponsored
          </span>
        </div>
      </div>

      {/* Action Controls & Wallet */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {/* New Invoice Button */}
        <button
          onClick={onOpenUploader}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: 'linear-gradient(135deg, #00f2fe 0%, #0052ff 100%)',
            color: '#070b14',
            fontWeight: 700,
            fontSize: '0.82rem',
            padding: '8px 16px',
            borderRadius: '10px',
            boxShadow: '0 4px 15px rgba(0, 242, 254, 0.25)',
          }}
        >
          <PlusCircle size={16} />
          <span>Audit Invoice</span>
        </button>

        {/* Terminal Button */}
        <button
          onClick={onOpenTerminal}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid var(--border-subtle)',
            color: 'var(--text-main)',
            fontSize: '0.82rem',
            padding: '8px 14px',
            borderRadius: '10px',
          }}
          title="Open Natural Language Gemini Terminal"
        >
          <Terminal size={16} color="#00f2fe" />
          <span>Agent Terminal</span>
        </button>

        {/* Policy Config */}
        <button
          onClick={onOpenPolicy}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid var(--border-subtle)',
            color: 'var(--text-main)',
            fontSize: '0.82rem',
            padding: '8px 12px',
            borderRadius: '10px',
          }}
          title="Adjust Guardrails & Limits"
        >
          <SlidersHorizontal size={16} color="#94a3b8" />
        </button>

        {/* Reset Demo State */}
        {onResetDemo && (
          <button
            onClick={onResetDemo}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-muted)',
              fontSize: '0.82rem',
              padding: '8px 12px',
              borderRadius: '10px',
            }}
            title="Reset Invoices & Treasury Balance to Initial Demo State"
          >
            <RotateCcw size={15} color="#94a3b8" />
            <span>Reset Demo</span>
          </button>
        )}

        {/* Web3 / Autonomous Wallet */}
        {wallet.isConnected ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {!wallet.isArcMainnet && (
              <button
                onClick={onSwitchToArc}
                style={{
                  background: 'rgba(239, 68, 68, 0.2)',
                  border: '1px solid #ef4444',
                  color: '#fca5a5',
                  padding: '6px 12px',
                  borderRadius: '8px',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                }}
              >
                Switch to Arc
              </button>
            )}
            <div 
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                padding: '7px 14px',
                borderRadius: '10px',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.8rem',
                color: '#6ee7b7',
              }}
            >
              <WalletIcon size={14} />
              <span>{wallet.address?.slice(0, 6)}...{wallet.address?.slice(-4)}</span>
              <span style={{ color: '#f8fafc', fontWeight: 700 }}>
                {wallet.balanceUsdc.toFixed(2)} USDC
              </span>
            </div>
          </div>
        ) : (
          <button
            onClick={onConnectWallet}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(0, 82, 255, 0.2)',
              border: '1px solid rgba(0, 82, 255, 0.5)',
              color: '#93c5fd',
              fontSize: '0.82rem',
              fontWeight: 600,
              padding: '8px 14px',
              borderRadius: '10px',
            }}
          >
            <WalletIcon size={16} />
            <span>Connect Wallet</span>
          </button>
        )}
      </div>
    </header>
  );
};
