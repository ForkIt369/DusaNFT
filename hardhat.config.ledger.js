require("@nomicfoundation/hardhat-toolbox");
require("@nomiclabs/hardhat-ledger");
require("dotenv").config();

module.exports = {
  solidity: "0.8.19",
  networks: {
    metis: {
      url: "https://andromeda.metis.io/?owner=1088",
      chainId: 1088,
      accounts: {
        ledgerAccounts: ["0xYOUR_LEDGER_ADDRESS_HERE"],
      }
    }
  }
};