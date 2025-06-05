const { ethers } = require("hardhat");

// Frame.sh deployment script for Ledger
async function main() {
  // Frame provides a local RPC endpoint when running
  const FRAME_RPC = "http://127.0.0.1:1248";
  
  // Connect to Frame
  const provider = new ethers.providers.JsonRpcProvider(FRAME_RPC);
  
  // Your Ledger address
  const signer = provider.getSigner("0x6Cb5365ADfC0fdFc2aD7C02151A04e9f0F9eBeCA");
  
  console.log("Deploying with Frame + Ledger...");
  
  const DusaNFT = await ethers.getContractFactory("DusaNFT");
  const contract = await DusaNFT.connect(signer).deploy();
  
  await contract.deployed();
  
  console.log("DusaNFT deployed to:", contract.address);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});