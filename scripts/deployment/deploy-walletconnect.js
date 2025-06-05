const WalletConnectProvider = require("@walletconnect/web3-provider");
const { ethers } = require("ethers");
const contractJSON = require("../artifacts/contracts/DusaNFT.sol/DusaNFT.json");

async function deployWithWalletConnect() {
  // Initialize WalletConnect Provider
  const provider = new WalletConnectProvider({
    rpc: {
      1088: "https://andromeda.metis.io/?owner=1088",
    },
  });

  // Enable session (triggers QR Code modal)
  await provider.enable();
  
  const web3Provider = new ethers.providers.Web3Provider(provider);
  const signer = web3Provider.getSigner();
  
  console.log("Connected to:", await signer.getAddress());
  
  // Deploy contract
  const factory = new ethers.ContractFactory(
    contractJSON.abi,
    contractJSON.bytecode,
    signer
  );
  
  const contract = await factory.deploy();
  await contract.deployed();
  
  console.log("Contract deployed to:", contract.address);
  
  // Disconnect
  await provider.disconnect();
}

deployWithWalletConnect().catch(console.error);