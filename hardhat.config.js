require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  solidity: "0.8.19",
  networks: {
    metis: {
      url: "https://andromeda.metis.io/?owner=1088",
      chainId: 1088,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    }
  },
  etherscan: {
    apiKey: {
      metis: "YOUR_METIS_API_KEY" // Get from Metis block explorer if available
    },
    customChains: [
      {
        network: "metis",
        chainId: 1088,
        urls: {
          apiURL: "https://andromeda-explorer.metis.io/api",
          browserURL: "https://andromeda-explorer.metis.io"
        }
      }
    ]
  }
};