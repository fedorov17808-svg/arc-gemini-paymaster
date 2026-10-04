# ⚡ ArcPaymaster AI
### Autonomous Gemini Fiscal Agent & Fraud Sentinel on Circle's Arc Mainnet

[![Network: Circle Arc Mainnet](https://img.shields.io/badge/Network-Circle_Arc_Mainnet_(5042)-0052ff?style=for-the-badge&logo=circle)](https://arc.io)
[![Model: Google Gemini 2.5 Flash](https://img.shields.io/badge/AI_Engine-Gemini_2.5_Flash-4285F4?style=for-the-badge&logo=google)](https://ai.google.dev)
[![Solidity: 0.8.28](https://img.shields.io/badge/Solidity-0.8.28_EIP--712-363636?style=for-the-badge&logo=solidity)](https://soliditylang.org)
[![Deployment: Vercel Production](https://img.shields.io/badge/Deployment-Live_on_Vercel-000000?style=for-the-badge&logo=vercel)](https://arc-gemini-paymaster.vercel.app)
[![Tests: 6/6 Passed](https://img.shields.io/badge/Security_Tests-6%2F6_Passing_(100%25)-10b981?style=for-the-badge)](https://github.com)

> **Live Production URL:** [https://arc-gemini-paymaster.vercel.app](https://arc-gemini-paymaster.vercel.app)  
> **DoraHacks Hackathon Track:** Arc Microgrants (Powered by Circle)

---

## 🎯 Executive Overview & Problem Statement

Corporate treasuries, DAO grant programs, and Web3 foundations lose tens of millions of dollars each year to **invoice fraud**, **advance fee scams**, and **Unicode homoglyph phishing** (such as substituting Cyrillic `\u0435` into brand names like *Circlе*).

Furthermore, automated fiscal agents on traditional chains face high friction because gas is paid in volatile assets (like ETH), requiring awkward bridges and balance management.

### The Solution: ArcPaymaster AI
**ArcPaymaster AI** couples **Google Gemini 2.5 Flash Multimodal Vision** with **Circle's Arc Mainnet** (Chain ID `5042`):
1. **Multimodal Invoice Forensics:** Evaluates uploaded PDF/image bills, extracts line items, validates tax credentials, and identifies subtle homoglyph attacks.
2. **EIP-712 Cryptographic AI Oracle:** Signs a cryptographically binding typed data verdict (`InvoiceVerdict`) using ECDSA.
3. **Smart Contract Settlement (`ArcPaymaster.sol`):** Automatically disburses funds on Circle Arc using **native USDC for gas**, enforcing spending caps ($500 limit), anti-replay nonces, and dual-approval multi-sig for high-ticket invoices.

---

## 🏗️ System Architecture

```mermaid
flowchart TD
    subgraph Client ["Frontend & Document Submission"]
        User[Corporate Officer / Judge] -->|Upload Invoice PDF/Image| UI[ArcPaymaster Web3 Dashboard]
    end

    subgraph AI_Engine ["Gemini AI & Forensic Sentinel"]
        UI -->|Base64 Document Stream| API["/api/audit-invoice (Vercel Serverless)"]
        API -->|Multimodal Prompt| Gemini["Gemini 2.5 Flash Vision"]
        Gemini -->|Line Items, Risk Score, Anomaly Flags| API
        API -->|Cyrillic & Greek Lookalike Scanner| Homoglyph["Homoglyph Defense Engine"]
        API -->|Keccak256 Document Hash| Hash["Doc Keccak256 Digest"]
        API -->|ECDSA Sign TypedData| Oracle["Gemini Agent Oracle Key (0x7099...79C8)"]
    end

    subgraph Security_Gate ["Cryptographic Policy Enforcement"]
        Oracle -->|EIP-712 Signature + Verdict| UI
        UI -->|Interactive Client Check| InBrowserVerifier["In-Browser ECDSA Verifier"]
        UI -->|If Invoice > $500 USDC| MultiSig["Treasury Officer Co-Signature (eth_signTypedData_v4)"]
    end

    subgraph Arc_L1 ["Circle Arc Mainnet (Chain ID: 5042)"]
        MultiSig -->|settleInvoiceDualApproval| Contract["ArcPaymaster.sol"]
        UI -->|settleInvoiceAutonomous| Contract
        Contract -->|Verify Oracle & Officer Signatures| ECDSA_Recover["OpenZeppelin ECDSA Recover"]
        Contract -->|Double Spend & Nonce Check| NonceCheck["Mapping: isSettled & nonces"]
        Contract -->|Check Blacklist| Blacklist["Quarantine Malicious Wallets"]
        Contract -->|Native USDC Transfer| Vendor["Supplier / Contractor Wallet"]
        Contract -->|Native USDC Gas (~0.00035 USDC)| ArcMiners["Arc Network Block Settlement"]
    end
```

---

## 🛡️ Smart Contract Security Matrix (`ArcPaymaster.sol`)

The smart contract is written in **Solidity 0.8.28** and inherits OpenZeppelin's `EIP712`, `Ownable`, `ReentrancyGuard`, and `SafeERC20`.

| Security Feature | Implementation Mechanism | Attack Vector Mitigated |
| :--- | :--- | :--- |
| **EIP-712 Signature Verification** | `_hashTypedDataV4(structHash)` + `ECDSA.recover` | Tampered invoice amounts, spoofed verdicts |
| **Replay Attack Defense** | `mapping(bytes32 => bool) isSettled` | Submitting the same invoice twice |
| **Dynamic Recipient Nonces** | `mapping(address => uint256) nonces` | Cross-invoice transaction reordering |
| **Autonomous Spend Cap** | `verdict.amount <= maxAutonomousLimit ($500 USDC)` | Unauthorized large fund drain |
| **Dual-Approval Multi-Sig** | `settleInvoiceDualApproval(...)` requiring officer sig | Rogue AI actions on high-value milestones |
| **On-Chain Scam Blacklist** | `mapping(address => bool) isBlacklisted` | Disbursing funds to flagged phishers |
| **Reentrancy Protection** | OpenZeppelin `nonReentrant` modifier | Malicious fallback contracts |
| **Deadline Expiration** | `require(block.timestamp <= verdict.deadline)` | Stale oracle verdict exploitation |

---

## 🧪 Comprehensive Test Suite (100% Passing)

Run the contract test suite locally with:
```bash
npm run test:contract
```

### Verified Output:
```text
🧪 Starting ArcPaymaster Smart Contract Rigorous Test Suite...
================================================================
👤 Deployer:         0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
🤖 Gemini Oracle:    0x70997970C51812dc3A010C7d01b50e0d17dc79C8
👔 Treasury Officer: 0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC
👷 Contractor:       0x90F79bf6EB2c4f870365E785982E1f101E93b906
🦹 Scammer Address:  0x9999dEAD8888beef111100007777cAFe00001234
----------------------------------------------------------------

[TEST 1] EIP-712 Signature Recovery & Verification...
  ✅ PASSED: EIP-712 ECDSA signature accurately recovered Gemini Oracle address!

[TEST 2] Tamper Resistance & Replay Attack Defense...
  ✅ PASSED: Tampered invoice amount invalidated Oracle signature (Attacker blocked)!

[TEST 3] Policy Engine: Risk Score Boundary Defense (maxAllowedRiskScore = 40)...
  ✅ PASSED: Safe invoice (Score: 12) permits payment.
  ✅ PASSED: High-risk phishing bill (Score: 88) triggers EVM revert!

[TEST 4] Policy Engine: Autonomous Spending Cap (maxAutonomousLimit = 500 USDC)...
  ✅ PASSED: $45.00 bill eligible for autonomous 1-click settlement.
  ✅ PASSED: $850.00 milestone halts autonomous execution, requesting dual-approval.

[TEST 5] Dual-Approval Multi-Sig Execution for High-Ticket Bills...
  ✅ PASSED: Both AI Agent and Human Treasury Officer signatures verified successfully!

[TEST 6] On-Chain Scam Defense & Automatic Address Blacklisting...
  ✅ PASSED: Scammer address 0x9999dEAD... quarantined and blacklisted.
  ✅ PASSED: Any subsequent payments to blacklisted account immediately blocked!

================================================================
🎉 TEST RESULTS: 6 / 6 TESTS PASSED (100% SUCCESS)
================================================================
```

---

## 🚀 Live Demo & Interactive Scenarios for DoraHacks Judges

The web application is live at **[https://arc-gemini-paymaster.vercel.app](https://arc-gemini-paymaster.vercel.app)**.

### 4 Pre-Configured Test Scenarios
Judges can test the full pipeline in seconds by clicking **"Upload & Audit Invoice"**:

1. **🟢 Cloudflare AI Compute ($42.50 USDC):**
   - Authentic recurring invoice with zero anomalies.
   - Generates valid EIP-712 oracle verdict.
   - Click **"Verify Cryptographic Proof"** to see live ECDSA public key recovery in browser.
   - Settles instantly within autonomous spending cap ($500).

2. **🟡 Smart Contract Audit ($850.00 USDC):**
   - High-value security audit milestone.
   - Exceeds the $500 autonomous cap.
   - Triggers the **Dual-Approval Multi-Sig Flow**: Click **"✍️ Officer Co-Sign & Settle on Arc"** to watch the secondary officer signature generated and validated on-chain.

3. **🔴 Phishing Homoglyph Scam ($150.00 USDC):**
   - Malicious bill masquerading as *Circlе Foundation* using Cyrillic `\u0435`.
   - Demands upfront advance verification fee.
   - Gemini Sentinel blocks payout, flags score `98/100`, and adds recipient wallet `0x9999dEAD...` to the blacklist.

4. **🔵 Gemini API Token Bill ($28.90 USDC):**
   - Operational token consumption bill.
   - Demonstrates sub-second Circle Arc finality and native USDC gas fee (~0.00035 USDC).

---

## ⚡ Quickstart & Local Development

### 1. Clone & Install
```bash
git clone https://github.com/<your-account>/arc-gemini-paymaster.git
cd arc-gemini-paymaster
npm install
```

### 2. Compile Contracts & Run Tests
```bash
npm run compile
npm run test:contract
```

### 3. Run Web App Locally
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🌐 Circle Arc Network Parameters

```json
{
  "chainId": 5042,
  "chainName": "Arc Mainnet",
  "nativeCurrency": {
    "name": "USD Coin",
    "symbol": "USDC",
    "decimals": 18
  },
  "rpcUrls": ["https://rpc.mainnet.arc.io"],
  "blockExplorerUrls": ["https://explorer.arc.io"]
}
```

---

## 📄 License

MIT License. Developed for the **DoraHacks Arc Microgrants Hackathon** powered by Circle.
