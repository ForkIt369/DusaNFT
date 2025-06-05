const { ethers } = require("hardhat");
const TransportNodeHid = require("@ledgerhq/hw-transport-node-hid").default;
const Eth = require("@ledgerhq/hw-app-eth").default;

async function deployWithLedger() {
  console.log("Connecting to Ledger...");
  
  // Connect to Ledger
  const transport = await TransportNodeHid.create();
  const eth = new Eth(transport);
  
  // Get address from Ledger (make sure Ethereum app is open)
  const result = await eth.getAddress("44'/60'/0'/0/0");
  console.log("Ledger address:", result.address);
  
  // Create custom signer for Ledger
  const provider = new ethers.providers.JsonRpcProvider("https://andromeda.metis.io/?owner=1088");
  
  const ledgerSigner = {
    getAddress: async () => result.address,
    signTransaction: async (tx) => {
      const serializedTx = ethers.utils.serializeTransaction(tx);
      const sig = await eth.signTransaction("44'/60'/0'/0/0", serializedTx.substring(2));
      return ethers.utils.serializeTransaction(tx, {
        v: parseInt(sig.v, 16),
        r: "0x" + sig.r,
        s: "0x" + sig.s,
      });
    },
    connect: () => ledgerSigner,
    provider: provider,
  };
  
  console.log("Deploying DusaNFT...");
  
  const DusaNFT = await ethers.getContractFactory("DusaNFT");
  const deployTx = await DusaNFT.getDeployTransaction();
  
  // Sign and send transaction
  const signedTx = await ledgerSigner.signTransaction(deployTx);
  const txResponse = await provider.sendTransaction(signedTx);
  
  console.log("Transaction sent:", txResponse.hash);
  const receipt = await txResponse.wait();
  
  console.log("DusaNFT deployed to:", receipt.contractAddress);
  
  await transport.close();
}

deployWithLedger().catch(console.error);