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
  onOpenSecurityModal: () => void;
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
  onOpenSecurityModal,
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

      {/* Network & Security Badges */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
        {/* Security Suite 10/10 In-App Runner */}
        <button
          onClick={onOpenSecurityModal}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid rgba(16, 185, 129, 0.4)',
            color: '#34d399',
            padding: '6px 12px',
            borderRadius: '999px',
            fontSize: '0.75rem',
            fontWeight: 700,
            cursor: 'pointer',
          }}
          title="Click to execute 10-Point Smart Contract & Cryptographic Security Suite"
        >
          <ShieldCheck size={14} color="#34d399" />
          <span>Security Suite (10/10)</span>
        </button>

        {/* Execution Mode Selector */}
        <button
          onClick={onToggleAutonomousMode}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: wallet.isAutonomousAgentMode ? 'rgba(0, 242, 254, 0.12)' : 'rgba(0, 82, 255, 0.12)',
            border: `1px solid ${wallet.isAutonomousAgentMode ? 'rgba(0, 242, 254, 0.35)' : 'rgba(0, 82, 255, 0.35)'}`,
            color: wallet.isAutonomousAgentMode ? '#00f2fe' : '#93c5fd',
            padding: '6px 12px',
            borderRadius: '999px',
            fontSize: '0.75rem',
            fontWeight: 600,
            cursor: 'pointer',
          }}
          title="Toggle between Autonomous EIP-712 Paymaster and Web3 Signer Mode"
        >
          <Bot size={13} color={wallet.isAutonomousAgentMode ? '#00f2fe' : '#93c5fd'} />
          <span>{wallet.isAutonomousAgentMode ? 'Mode: Autonomous EIP-712' : 'Mode: Web3 Signer'}</span>
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
          <span>Circle Arc Mainnet (5042)</span>
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
          <span>+ Ingest Invoice</span>
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
          title="Open Natural Language Gemini Fiscal Terminal"
        >
          <Terminal size={16} color="#00f2fe" />
          <span>Gemini Terminal</span>
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
          title="Configure Treasury Policy Guardrails & Limits"
        >
          <SlidersHorizontal size={16} color="#94a3b8" />
          <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>Policy</span>
        </button>

        {/* Sync Ledger State */}
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
            title="Synchronize and refresh local ledger with Circle Arc Mainnet state"
          >
            <RotateCcw size={15} color="#94a3b8" />
            <span>Sync Ledger</span>
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
