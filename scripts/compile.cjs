const fs = require('fs');
const path = require('path');
const solc = require('solc');

function findImports(importPath) {
  if (importPath.startsWith('@openzeppelin/')) {
    const fullPath = path.resolve(__dirname, '../node_modules', importPath);
    if (fs.existsSync(fullPath)) {
      return { contents: fs.readFileSync(fullPath, 'utf8') };
    }
  }
  const localPath = path.resolve(__dirname, '../contracts', importPath);
  if (fs.existsSync(localPath)) {
    return { contents: fs.readFileSync(localPath, 'utf8') };
  }
  return { error: 'File not found: ' + importPath };
}

function compile() {
  const contractPath = path.resolve(__dirname, '../contracts/ArcPaymaster.sol');
  const sourceCode = fs.readFileSync(contractPath, 'utf8');

  const input = {
    language: 'Solidity',
    sources: {
      'ArcPaymaster.sol': {
        content: sourceCode,
      },
    },
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
      outputSelection: {
        '*': {
          '*': ['abi', 'evm.bytecode', 'evm.deployedBytecode'],
        },
      },
    },
  };

  console.log('⏳ Compiling ArcPaymaster.sol with solc 0.8.20 and OpenZeppelin contracts...');
  const output = JSON.parse(solc.compile(JSON.stringify(input), { import: findImports }));

  if (output.errors) {
    let hasFatal = false;
    for (const error of output.errors) {
      if (error.severity === 'error') {
        console.error('❌ Compilation Error:', error.formattedMessage);
        hasFatal = true;
      } else {
        console.warn('⚠️ Warning:', error.formattedMessage);
      }
    }
    if (hasFatal) {
      process.exit(1);
    }
  }

  const contractData = output.contracts['ArcPaymaster.sol']['ArcPaymaster'];
  const abi = contractData.abi;
  const bytecode = contractData.evm.bytecode.object;

  const artifactsDir = path.resolve(__dirname, '../artifacts');
  const srcContractsDir = path.resolve(__dirname, '../src/contracts');

  if (!fs.existsSync(artifactsDir)) fs.mkdirSync(artifactsDir, { recursive: true });
  if (!fs.existsSync(srcContractsDir)) fs.mkdirSync(srcContractsDir, { recursive: true });

  const artifactPayload = {
    contractName: 'ArcPaymaster',
    abi,
    bytecode: '0x' + bytecode,
    compiledAt: new Date().toISOString(),
  };

  fs.writeFileSync(
    path.join(artifactsDir, 'ArcPaymaster.json'),
    JSON.stringify(artifactPayload, null, 2)
  );

  fs.writeFileSync(
    path.join(srcContractsDir, 'ArcPaymaster.json'),
    JSON.stringify(artifactPayload, null, 2)
  );

  console.log('✅ ArcPaymaster.sol compiled successfully!');
  console.log(`📦 ABI Methods: ${abi.length} functions & events`);
  console.log(`📦 Bytecode Size: ${(bytecode.length / 2).toFixed(0)} bytes`);
  console.log('📁 Artifact saved to artifacts/ArcPaymaster.json and src/contracts/ArcPaymaster.json');
}

compile();
