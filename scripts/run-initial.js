const hre = require("hardhat");
const ethers = require('ethers');
const HoundLaamaABI = require('../artifacts/contracts/HoundLaama.sol/HoundLaama.json');

async function main() {
  const provider = new ethers.providers.JsonRpcProvider("https://testnet.aurora.dev/");
  const deployerWallet = new hre.ethers.Wallet(process.env.PRIVATE_KEY, provider);
  const contractFatory = new ethers.Contract(
    "0xd7EB7C191802954177F605227091e32c15f940a0", // HoundLaama contract address
    HoundLaamaABI.abi,
    deployerWallet
  );

  let nonce = await provider.getTransactionCount(deployerWallet.address);
  console.log("nonce: ", nonce);
  
  /* set mainSale active */
  // await contractFatory.connect(deployerWallet).toggleMainSale({nonce: nonce});

  /* add to whitelist */
  const whitelistUser = [
    { "user": "0xE8DAC12f7A4b0a47e8e2Af2b96db6F54e2E2C9C3", "check": true, "userType": true }
  ]
  await contractFatory.connect(deployerWallet).setAirdropOrWhitelistUser(
    whitelistUser,
    {nonce: nonce}
  );

}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});