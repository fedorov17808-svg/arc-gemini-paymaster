import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Wallet } from 'ethers';

const ORACLE_PRIVATE_KEY = process.env.AGENT_ORACLE_PRIVATE_KEY || '0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d';
const oracleWallet = new Wallet(ORACLE_PRIVATE_KEY);

const EIP712_DOMAIN = {
  name: 'ArcPaymaster',
  version: '1.0.0',
  chainId: 5042, // Circle Arc Mainnet
  verifyingContract: process.env.PAYMASTER_CONTRACT_ADDRESS || '0x5FbDB2315678afecb367f032d93F642f64180aa3',
};

export default function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  return res.status(200).json({
    status: 'ONLINE',
    runtime: 'Vercel Serverless Function',
    network: 'Circle Arc Mainnet',
    chainId: 5042,
    oracleSignerAddress: oracleWallet.address,
    eip712Domain: EIP712_DOMAIN,
    version: '1.0.0',
    timestamp: Date.now(),
  });
}
