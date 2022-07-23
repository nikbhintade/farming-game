require("dotenv").config();
require("@nomiclabs/hardhat-etherscan");
require("@nomiclabs/hardhat-waffle");
require('hardhat-contract-sizer');
require('solidity-coverage');

module.exports = {
  defaultNetwork: 'hardhat',
  solidity: {
    compilers: [
      { version: "0.8.0" },
      { version: "0.8.1" },
      { version: "<0.9.0", settings: {} }
    ],
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    hardhat: {
      allowUnlimitedContractSize: true,
      blockGasLimit: 100000000000
    },
    auroratestnet: {
      chainId: 1313161555,
      url: "https://testnet.aurora.dev",
      accounts: [process.env.PRIVATE_KEY],
      timeout: 100000
    }
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
  mocha: {
    timeout: 1000000
  }
};
