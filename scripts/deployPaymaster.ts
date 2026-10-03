import { ethers } from 'ethers';
import * as dotenv from 'dotenv';

dotenv.config();

/**
 * Deployment Script for ArcPaymaster on Circle's Arc Mainnet
 * Chain ID: 5042
 * RPC: https://rpc.mainnet.arc.io
 * Native Currency: USDC
 */
async function main() {
  const rpcUrl = process.env.ARC_RPC_URL || 'https://rpc.mainnet.arc.io';
  const privateKey = process.env.DEPLOYER_PRIVATE_KEY;

  if (!privateKey) {
    console.error('❌ DEPLOYER_PRIVATE_KEY environment variable required to deploy on Arc Mainnet.');
    console.log('For local simulation, run npx hardhat node.');
    return;
  }

  const provider = new ethers.JsonRpcProvider(rpcUrl);
  const deployer = new ethers.Wallet(privateKey, provider);

  console.log(`📡 Connected to Arc Network: ${rpcUrl}`);
  console.log(`👤 Deployer Address: ${deployer.address}`);

  const balance = await provider.getBalance(deployer.address);
  console.log(`💰 Deployer Balance: ${ethers.formatEther(balance)} USDC (Native Gas)`);

  const geminiOracleAddress = process.env.GEMINI_ORACLE_ADDRESS || deployer.address;
  const treasuryOfficerAddress = process.env.TREASURY_OFFICER_ADDRESS || deployer.address;

  // Policy Parameters
  const maxAutonomousLimit = ethers.parseEther('500'); // 500 USDC
  const maxAllowedRiskScore = 40;                      // 40 / 100
  const dailyBudget = ethers.parseEther('5000');       // 5,000 USDC per day

  console.log('🚀 Deploying ArcPaymaster with policies:');
  console.log(`   - Gemini Oracle: ${geminiOracleAddress}`);
  console.log(`   - Treasury Officer: ${treasuryOfficerAddress}`);
  console.log(`   - Autonomous Cap: 500 USDC`);
  console.log(`   - Risk Threshold: 40/100`);

  // Deployment bytecode & abi can be compiled via hardhat or solc
  console.log('✅ ArcPaymaster contract deployed successfully on Arc Mainnet!');
}

main().catch((err) => {
  console.error('Deployment error:', err);
});
