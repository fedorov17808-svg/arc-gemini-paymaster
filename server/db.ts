import * as fs from 'fs';
import * as path from 'path';

export interface StoredInvoice {
  id: string;
  invoiceNumber: string;
  vendorName: string;
  vendorCategory: string;
  vendorAddress: string;
  amountUsdc: number;
  issueDate: string;
  dueDate: string;
  lineItems: Array<{ description: string; quantity: number; unitPrice: number; total: number }>;
  riskScore: number;
  riskLevel: 'SAFE' | 'WARNING' | 'CRITICAL_RISK';
  riskSummary: string;
  riskFlags: string[];
  aiReasoning: string;
  status: 'PENDING_AUDIT' | 'AUDITED' | 'APPROVED' | 'PAID' | 'REJECTED';
  txHash?: string;
  arcBlockNumber?: number;
  gasPaidUsdc?: number;
  timestamp: number;
  memo?: string;
  docHash?: string;
  agentSignature?: string;
  oracleAddress?: string;
}

const DATA_DIR = path.resolve(process.cwd(), 'server/data');
const DB_FILE = path.join(DATA_DIR, 'invoices.json');

// Initialize DB file with default seed data if not present
function initDb() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (!fs.existsSync(DB_FILE)) {
    const seedInvoices: StoredInvoice[] = [
      {
        id: 'inv-cf-802',
        invoiceNumber: 'CF-2026-9481',
        vendorName: 'Cloudflare Network & AI Workers',
        vendorCategory: 'Infrastructure & Edge Cloud',
        vendorAddress: '0x17f6aD8eF329757995B054d4a78229F86C57FdE4',
        amountUsdc: 42.50,
        issueDate: '2026-10-01',
        dueDate: '2026-10-15',
        lineItems: [
          { description: 'Cloudflare Workers AI Inference (4.2M tokens)', quantity: 1, unitPrice: 22.50, total: 22.50 },
          { description: 'Global Anycast DNS & WAF Enterprise Pro', quantity: 1, unitPrice: 20.00, total: 20.00 },
        ],
        riskScore: 4,
        riskLevel: 'SAFE',
        riskSummary: 'Verified vendor with consistent billing history and matched Arc EVM address.',
        riskFlags: [
          'SSL/TLS domain authenticity verified (cloudflare.com)',
          'Arc EVM recipient address matches verified vendor registry',
          'Amount is within historical ±5% variance of previous monthly bills',
        ],
        aiReasoning: 'Gemini evaluated invoice structure, vendor tax ID (US-82-019482), and previous 6 billing cycles. Meets policy criteria for autonomous execution.',
        status: 'AUDITED',
        memo: 'CF-2026-9481:Cloudflare-Workers-AI',
        timestamp: Date.now() - 3600000 * 4,
        docHash: '0x7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069',
        agentSignature: '0xeb4c5e4498edc677d51266d2e3b374f18322ba24898aca6fe2aa288ffefcc7a73d30294511e74199e135ad1c0f63c579c1e85551eab5210145ff88738d73209d1b',
        oracleAddress: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
      },
      {
        id: 'inv-phish-666',
        invoiceNumber: 'CIRC-GRANT-EXP-991',
        vendorName: 'Circlе Foundation Grants Desk',
        vendorCategory: 'Grant Compliance & Expedited Escrow',
        vendorAddress: '0x9999dEAD8888beef111100007777cAFe00001234',
        amountUsdc: 150.00,
        issueDate: '2026-10-03',
        dueDate: '2026-10-04',
        lineItems: [
          { description: 'Urgent Microgrant Dispersal Verification Fee', quantity: 1, unitPrice: 150.00, total: 150.00 },
        ],
        riskScore: 98,
        riskLevel: 'CRITICAL_RISK',
        riskSummary: 'CRITICAL PHISHING ATTACK DETECTED: Homoglyph spoofing & unverified scam recipient.',
        riskFlags: [
          'HOMOGLYPH SPOOFING: Unicode U+0435 (Cyrillic "е") used in "Circlе"',
          'FRAUDULENT FEE: Official Circle Grant programs NEVER charge approval or processing fees',
          'SUSPICIOUS TIMELINE: Demands urgent payout within 24 hours to create false panic',
        ],
        aiReasoning: 'CRITICAL ALERT: Gemini Sentinel detected Cyrillic character substitution. Advance fee fraud disguised as grant compliance. QUARANTINED ON-CHAIN.',
        status: 'REJECTED',
        memo: 'BLOCKED:CIRC-PHISHING-ATTACK',
        timestamp: Date.now() - 3600000 * 1,
        docHash: '0x49281bcf764920b17492c109274019284719284719283749182b1c4918274019',
        oracleAddress: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
      },
      {
        id: 'inv-google-202',
        invoiceNumber: 'GCP-AI-82910',
        vendorName: 'Google Cloud Platform (Gemini 2.5 API)',
        vendorCategory: 'AI Model Inference & Vector Storage',
        vendorAddress: '0x32Be343B94f860124dC4fEe278FDCBD38C102D88',
        amountUsdc: 28.90,
        issueDate: '2026-10-03',
        dueDate: '2026-10-18',
        lineItems: [
          { description: 'Gemini 2.5 Flash Multimodal Document Tokens', quantity: 12.5, unitPrice: 1.20, total: 15.00 },
          { description: 'Google Cloud Storage Bucket (Invoice Vault)', quantity: 1, unitPrice: 13.90, total: 13.90 },
        ],
        riskScore: 2,
        riskLevel: 'SAFE',
        riskSummary: 'Official cloud supplier invoice with verified Google vendor tax credentials.',
        riskFlags: [
          'Zero anomaly score in document typography and tax breakdown',
          'Under autonomous policy limit ($500 USDC)',
          'Direct integration with AI pipeline billing',
        ],
        aiReasoning: 'Standard operational recurring charge. Token consumption metrics align with recorded API call volume. Approved for instant Arc settlement.',
        status: 'APPROVED',
        memo: 'GCP-AI-82910:Gemini-Tokens',
        timestamp: Date.now() - 1800000,
        docHash: '0x81927491029384719284719283749182b1c49182740194829102938471928374',
        agentSignature: '0x182736491029384719283746192837461928374619283746192837461928374619283746192837461928374619283746192837461928374619283746192837461b',
        oracleAddress: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
      },
    ];

    fs.writeFileSync(DB_FILE, JSON.stringify(seedInvoices, null, 2));
    console.log('📦 Database initialized with persistent seed records at server/data/invoices.json');
  }
}

initDb();

export class InvoiceDatabase {
  public static getAll(): StoredInvoice[] {
    initDb();
    try {
      const data = fs.readFileSync(DB_FILE, 'utf8');
      return JSON.parse(data);
    } catch {
      return [];
    }
  }

  public static add(invoice: StoredInvoice): StoredInvoice {
    const list = InvoiceDatabase.getAll();
    list.unshift(invoice);
    fs.writeFileSync(DB_FILE, JSON.stringify(list, null, 2));
    return invoice;
  }

  public static update(id: string, updates: Partial<StoredInvoice>): StoredInvoice | null {
    const list = InvoiceDatabase.getAll();
    const index = list.findIndex(i => i.id === id);
    if (index === -1) return null;

    list[index] = { ...list[index], ...updates };
    fs.writeFileSync(DB_FILE, JSON.stringify(list, null, 2));
    return list[index];
  }

  public static getById(id: string): StoredInvoice | null {
    const list = InvoiceDatabase.getAll();
    return list.find(i => i.id === id) || null;
  }
}
