const hre = require("hardhat");

async function main() {
  console.log("Deploying DusaNFT to Metis Andromeda...");

  const DusaNFT = await hre.ethers.getContractFactory("DusaNFT");
  const dusaNFT = await DusaNFT.deploy();

  await dusaNFT.deployed();

  console.log(`DusaNFT deployed to: ${dusaNFT.address}`);
  console.log(`Network: Metis Andromeda (Chain ID: 1088)`);
  
  // Wait for a few block confirmations
  console.log("Waiting for block confirmations...");
  await dusaNFT.deployTransaction.wait(5);
  
  console.log("Deployment complete!");
  console.log("\nNext steps:");
  console.log("1. Update CONTRACT_ADDRESS in app.js with:", dusaNFT.address);
  console.log("2. Upload metadata JSON to IPFS and update METADATA_URI in app.js");
  console.log("3. Verify the contract on Metis block explorer");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });