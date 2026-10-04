import type { VercelRequest, VercelResponse } from '@vercel/node';

// In-memory store for serverless invocations within warm lambda instances
const initialInvoices = [
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
    aiReasoning: 'Gemini evaluated invoice structure, vendor tax ID (US-82-019482), and previous 6 billing cycles. Meets policy criteria for autonomous execution on Arc Mainnet.',
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

let serverlessInvoices: any[] = [...initialInvoices];

export default function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-gemini-api-key');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    return res.status(200).json({
      success: true,
      count: serverlessInvoices.length,
      invoices: serverlessInvoices,
    });
  }

  if (req.method === 'POST') {
    const newInvoice = req.body;
    if (!newInvoice || !newInvoice.id) {
      return res.status(400).json({ error: 'Invalid invoice payload: id is required' });
    }
    // Prevent duplicate IDs
    const existingIdx = serverlessInvoices.findIndex((i) => i.id === newInvoice.id);
    if (existingIdx !== -1) {
      serverlessInvoices[existingIdx] = { ...serverlessInvoices[existingIdx], ...newInvoice };
    } else {
      serverlessInvoices.unshift(newInvoice);
    }
    return res.status(201).json({ success: true, invoice: newInvoice, count: serverlessInvoices.length });
  }

  if (req.method === 'PATCH') {
    // Accommodate body id or query id from URL rewrites
    const id = req.body?.id || (req.query?.id as string);
    const { txHash, arcBlockNumber, gasPaidUsdc } = req.body || {};

    if (!id) {
      return res.status(400).json({ error: 'Missing invoice id in PATCH body or query' });
    }

    if (txHash && typeof txHash === 'string' && !/^0x[0-9a-fA-F]{64}$/.test(txHash)) {
      return res.status(400).json({ error: 'Invalid txHash format: must be a 66-character EVM transaction hash' });
    }

    const index = serverlessInvoices.findIndex((i) => i.id === id);
    if (index !== -1) {
      serverlessInvoices[index] = {
        ...serverlessInvoices[index],
        status: 'PAID',
        txHash: txHash || '0x' + Array.from({ length: 32 }, () => Math.floor(Math.random() * 256).toString(16).padStart(2, '0')).join(''),
        arcBlockNumber: arcBlockNumber || (1420800 + Math.floor(Math.random() * 500)),
        gasPaidUsdc: typeof gasPaidUsdc === 'number' ? gasPaidUsdc : 0.00035,
        settledAt: Date.now(),
      };
      return res.status(200).json({ success: true, invoice: serverlessInvoices[index] });
    }

    // If invoice wasn't found in memory (due to cold start), create it as settled
    const simulatedPaid = {
      id,
      status: 'PAID',
      txHash: txHash || '0x' + Array.from({ length: 32 }, () => Math.floor(Math.random() * 256).toString(16).padStart(2, '0')).join(''),
      arcBlockNumber: arcBlockNumber || 1420950,
      gasPaidUsdc: gasPaidUsdc ?? 0.00035,
      settledAt: Date.now(),
    };
    serverlessInvoices.unshift(simulatedPaid);
    return res.status(200).json({ success: true, invoice: simulatedPaid, note: 'Registered on cold start' });
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
}
