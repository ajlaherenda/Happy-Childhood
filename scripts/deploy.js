const hre = require("hardhat");
async function main () {
  // We get the contract to deploy.
  const HappyChildhood = await hre.ethers.getContractFactory("HappyChildhood");
  const happyChildhood = await HappyChildhood.deploy();
  await happyChildhood.deployed();
  console.log("HappyChildhood deployed to:", happyChildhood.address);

}
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });