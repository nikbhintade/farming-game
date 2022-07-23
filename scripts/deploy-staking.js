const hre = require("hardhat");

async function main() {
  const provider = hre.ethers.provider;
  const deployerWallet = new hre.ethers.Wallet(process.env.PRIVATE_KEY, provider);

  console.log("Deploying contracts with the account:", deployerWallet.address);
  console.log("Account balance:", (await deployerWallet.getBalance()).toString());

  const Random = await hre.ethers.getContractFactory("Random");
  const Wools = await hre.ethers.getContractFactory("Wools");
  const Token1 = await hre.ethers.getContractFactory("Token1");
  const Token2 = await hre.ethers.getContractFactory("Token2");
  const Metadata = await hre.ethers.getContractFactory("Metadata");
  const HoundLaama = await hre.ethers.getContractFactory("HoundLaama");
  const LaamaHouse = await hre.ethers.getContractFactory("LaamaHouse");

  let nonce = await provider.getTransactionCount(deployerWallet.address);
  console.log("nonce0: ", nonce);

  // deploy Random
  const random = await Random.connect(deployerWallet).deploy({nonce: nonce});
  await random.deployed();
  console.log("Random deployed to:", random.address);

  nonce = await provider.getTransactionCount(deployerWallet.address);
  console.log("nonce1: ", nonce);

  // deploy Wools token
  const wools = await Wools.connect(deployerWallet).deploy({nonce: nonce});
  await wools.deployed();
  console.log("Wools deployed to:", wools.address);

  nonce = await provider.getTransactionCount(deployerWallet.address);
  console.log("nonce2: ", nonce);

  // deploy Token1 token
  const token1 = await Token1.connect(deployerWallet).deploy({nonce: nonce});
  await token1.deployed();
  console.log("Token1 deployed to:", token1.address);

  nonce = await provider.getTransactionCount(deployerWallet.address);
  console.log("nonce3: ", nonce);

  // deploy Token2 token
  const token2 = await Token2.connect(deployerWallet).deploy({nonce: nonce});
  await token2.deployed();
  console.log("Token2 deployed to:", token2.address);

  nonce = await provider.getTransactionCount(deployerWallet.address);
  console.log("nonce4: ", nonce);

  // deploy Metadata
  const metadata = await Metadata.connect(deployerWallet).deploy({nonce: nonce});
  await metadata.deployed();
  console.log("Metadata deployed to:", metadata.address);

  nonce = await provider.getTransactionCount(deployerWallet.address);
  console.log("nonce5: ", nonce);

  // deploy HoundLaama NFT
  const houndlaama = await HoundLaama.connect(deployerWallet).deploy(
    wools.address, 
    metadata.address, 
    {nonce: nonce, gasLimit: 15000000}
  );
  await houndlaama.deployed();
  console.log("HoundLaama deployed to:", houndlaama.address);

  nonce = await provider.getTransactionCount(deployerWallet.address);
  console.log("nonce6: ", nonce);

  const laamahouse = await LaamaHouse.connect(deployerWallet).deploy(
    houndlaama.address,
    random.address,
    wools.address,
    token1.address,
    token2.address,
    {nonce: nonce, gasLimit: 10000000}
  )
  await laamahouse.deployed();
  console.log("LaamaHouse deployed to:", laamahouse.address);
  
  // Old contracts
  // Random deployed to: 0x212cb7fc1aF3208CCF614E380909F2E2A28e9D2c
  // Wools deployed to: 0x0bFEB2746Ec40434DE91020CeA5Fe342526D58e4
  // Token1 deployed to: 0x96c1179a419f620105Dd7D282688D8C993AacC80
  // Token2 deployed to: 0xa5C3708df0A9082a46cDE8645be88b857A2BF990
  // Metadata deployed to: 0xe6b66039242f7c0e2f6a469c931B48f2b1c3179c
  // FoxHen deployed to: 0xD265d19ABfc18Db0F523217b5ba1F48280FFC2F1
  // HenHouse deployed to: 0x74d5ed62512b624ca3e4387abda9dc52faaf5823

  // New contracts
  // Random deployed to: 0x510EeD4567dB3c9A7103303Be7b56CDACA55C5b8
  // Wools deployed to: 0x2AE2E47EA3aA1226B59da1C4dad226956F634De0
  // Token1 deployed to: 0xf28D323f16538494ca22Ebb6fbBfF963483e6a2d
  // Token2 deployed to: 0xE231300aA4455000d1A3d79071B2379f64c21601
  // Metadata deployed to: 0x69fC38d9F4dBaFa8f671560C0331E69C53f1a16a
  // HoundLaama deployed to: 0xd7EB7C191802954177F605227091e32c15f940a0
  // LaamaHouse deployed to: 0x784A04133E5810615B3042820D51984813e25551
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
