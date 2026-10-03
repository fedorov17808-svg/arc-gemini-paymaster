import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Terminal, 
  Send, 
  Bot, 
  User, 
  Sparkles, 
  CornerDownLeft, 
  Zap, 
  ShieldCheck 
} from 'lucide-react';
import { AgentChatMessage, Invoice, TreasuryPolicy } from '../types';
import { geminiService } from '../services/geminiService';

interface AgentTerminalModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoices: Invoice[];
  policy: TreasuryPolicy;
  apiKey: string;
  onExecuteBatchPay: () => void;
  onSwitchToArc: () => void;
}

export const AgentTerminalModal: React.FC<AgentTerminalModalProps> = ({
  isOpen,
  onClose,
  invoices,
  policy,
  apiKey,
  onExecuteBatchPay,
  onSwitchToArc,
}) => {
  const [messages, setMessages] = useState<AgentChatMessage[]>([
    {
      id: 'init-1',
      sender: 'gemini',
      text: `👋 Greetings! I am your **Autonomous Gemini Fiscal Agent** operating on **Circle's Arc Mainnet** (Chain ID: 5042).\n\nI monitor incoming invoices, detect spoofing/homoglyph phishing attempts, and execute sub-second settlements with native USDC gas. How can I assist your treasury today?`,
      timestamp: Date.now(),
      suggestedAction: {
        label: '⚡ Check Invoices Ready to Pay',
        actionType: 'PAY_APPROVED',
      },
    },
  ]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  if (!isOpen) return null;

  const handleSend = async (userQuery?: string) => {
    const textToSend = userQuery || input;
    if (!textToSend.trim() || isThinking) return;

    const userMsg: AgentChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsThinking(true);

    try {
      const response = await geminiService.chatWithAgent(textToSend, invoices, policy, apiKey);
      setMessages((prev) => [...prev, response]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: 'system',
          text: 'Error processing prompt. Please check your network or try a sample prompt.',
          timestamp: Date.now(),
        },
      ]);
    } finally {
      setIsThinking(false);
    }
  };

  const handleActionClick = (action: any) => {
    if (action.actionType === 'PAY_APPROVED') {
      onExecuteBatchPay();
      onClose();
    } else if (action.actionType === 'SWITCH_NETWORK') {
      onSwitchToArc();
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
          maxWidth: '720px',
          height: '620px',
          display: 'flex',
          flexDirection: 'column',
          background: '#0d1322',
          border: '1px solid rgba(0, 242, 254, 0.25)',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.7)',
          borderRadius: '16px',
          overflow: 'hidden',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Terminal Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid var(--border-subtle)', background: 'rgba(15, 23, 42, 0.6)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(0, 242, 254, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Terminal size={18} color="#00f2fe" />
            </div>
            <div>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f8fafc' }}>
                Gemini Agentic Terminal
              </h3>
              <p style={{ fontSize: '0.72rem', color: '#00f2fe' }}>
                Interactive Treasury Intelligence & Tool Execution
              </p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', color: 'var(--text-muted)' }}>
            <X size={18} />
          </button>
        </div>

        {/* Message Thread */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {messages.map((msg) => (
            <div 
              key={msg.id}
              style={{
                display: 'flex',
                gap: '12px',
                alignItems: 'flex-start',
                alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '85%',
              }}
            >
              {msg.sender !== 'user' && (
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'linear-gradient(135deg, #00f2fe, #0052ff)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Bot size={16} color="#070b14" />
                </div>
              )}
              <div>
                <div 
                  style={{
                    background: msg.sender === 'user' ? 'rgba(0, 82, 255, 0.25)' : 'rgba(15, 23, 42, 0.8)',
                    border: msg.sender === 'user' ? '1px solid rgba(0, 82, 255, 0.4)' : '1px solid var(--border-subtle)',
                    padding: '12px 16px',
                    borderRadius: msg.sender === 'user' ? '12px 12px 2px 12px' : '12px 12px 12px 2px',
                    fontSize: '0.82rem',
                    lineHeight: '1.5',
                    color: '#f8fafc',
                    whiteSpace: 'pre-wrap',
                  }}
                >
                  {msg.text}
                </div>

                {/* Suggested Action Pill */}
                {msg.suggestedAction && (
                  <button
                    onClick={() => handleActionClick(msg.suggestedAction)}
                    style={{
                      marginTop: '8px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      background: 'rgba(0, 242, 254, 0.15)',
                      border: '1px solid rgba(0, 242, 254, 0.4)',
                      color: '#00f2fe',
                      padding: '6px 14px',
                      borderRadius: '8px',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                    }}
                  >
                    <span>{msg.suggestedAction.label}</span>
                    <Zap size={14} />
                  </button>
                )}
              </div>
            </div>
          ))}

          {isThinking && (
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(0, 242, 254, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Bot size={16} color="#00f2fe" />
              </div>
              <div style={{ fontSize: '0.8rem', color: '#00f2fe', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#00f2fe', animation: 'pulseGlow 1s infinite' }} />
                <span>Gemini reasoning across treasury policies & Arc network state...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Query Suggestions */}
        <div style={{ padding: '8px 16px', borderTop: '1px solid var(--border-subtle)', background: 'rgba(7, 11, 20, 0.5)', display: 'flex', gap: '8px', overflowX: 'auto' }}>
          {[
            '⚡ Which invoices can I pay right now?',
            '🛡️ Why was the Circle invoice blocked?',
            '🌐 Explain Arc Mainnet & USDC gas',
            '💰 What is our total fraud savings?',
          ].map((promptText, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(promptText)}
              style={{
                whiteSpace: 'nowrap',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                color: 'var(--text-muted)',
                fontSize: '0.72rem',
                padding: '4px 10px',
                borderRadius: '6px',
              }}
            >
              {promptText}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div style={{ padding: '14px 20px', borderTop: '1px solid var(--border-subtle)', background: 'rgba(15, 23, 42, 0.6)', display: 'flex', gap: '10px' }}>
          <input
            type="text"
            placeholder="Ask Gemini to audit, explain, or execute Arc payouts..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            style={{
              flex: 1,
              padding: '10px 14px',
              background: 'rgba(7, 11, 20, 0.8)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '8px',
              color: '#f8fafc',
              fontSize: '0.85rem',
            }}
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || isThinking}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '42px',
              height: '42px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #00f2fe 0%, #0052ff 100%)',
              color: '#070b14',
            }}
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
