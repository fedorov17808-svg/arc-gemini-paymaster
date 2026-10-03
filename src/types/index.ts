export type RiskLevel = 'SAFE' | 'WARNING' | 'CRITICAL_RISK';

export type InvoiceStatus = 'PENDING_AUDIT' | 'AUDITING' | 'AUDITED' | 'APPROVED' | 'PAID' | 'REJECTED';

export interface LineItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  vendorName: string;
  vendorCategory: string;
  vendorAddress: string; // EVM address on Arc
  amountUsdc: number;
  issueDate: string;
  dueDate: string;
  lineItems: LineItem[];
  riskScore: number; // 0 to 100 (higher = riskier)
  riskLevel: RiskLevel;
  riskSummary: string;
  riskFlags: string[];
  aiReasoning: string;
  status: InvoiceStatus;
  rawImage?: string;
  txHash?: string;
  arcBlockNumber?: number;
  gasPaidUsdc?: number;
  timestamp: number;
  memo?: string;
  docHash?: string; // Keccak256 hash of invoice document bytes
  agentSignature?: string; // EIP-712 ECDSA signature from Gemini Oracle
  oracleAddress?: string; // Authorized Oracle public key
}

export interface TreasuryPolicy {
  maxAutoApproveUsdc: number;
  dailyBudgetUsdc: number;
  dailySpentUsdc: number;
  requireMultiSigAboveUsdc: number;
  fraudThresholdScore: number;
  autoExecuteSafe: boolean;
}

export interface WalletState {
  isConnected: boolean;
  address: string | null;
  balanceUsdc: number;
  chainId: number | null;
  networkName: string;
  isArcMainnet: boolean;
  isAutonomousAgentMode: boolean;
  agentAddress?: string;
}

export interface AgentChatMessage {
  id: string;
  sender: 'user' | 'gemini' | 'system';
  text: string;
  timestamp: number;
  suggestedAction?: {
    label: string;
    actionType: 'AUDIT_ALL' | 'PAY_APPROVED' | 'INSPECT_INVOICE' | 'SWITCH_NETWORK';
    payload?: string;
  };
  toolCall?: {
    name: string;
    params: Record<string, unknown>;
    result?: unknown;
  };
}
