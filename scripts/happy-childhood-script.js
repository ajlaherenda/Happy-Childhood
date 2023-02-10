// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

// Returns the Ether balance of a given address.
async function getBalance(address) {
  const balanceBigInt = await hre.ethers.provider.getBalance(address);
  return hre.ethers.utils.formatEther(balanceBigInt);
}

// Logs the Ether balances for a list of addresses.
async function printBalances(addresses) {
  let idx = 0;
  for (const address of addresses) {
    console.log(`Address ${idx} balance: `, await getBalance(address));
    idx ++;
  }
}

// Logs the memos stored on-chain from coffee purchases.
async function printMemos(memos) {
  for (const memo of memos) {
    const timestamp = memo.timestamp;
    const donor = memo.name;
    const donorAddress = memo.from;
    const message = memo.message;
    console.log(`At ${timestamp}, ${donor} (${donorAddress}) said: "${message}"`);
  }
}

async function main() {
 
  // Get the example accounts we'll be working with.
  const [owner, donor, donor2, donor3] = await hre.ethers.getSigners();

  // We get the contract to deploy.
  const HappyChildhood = await hre.ethers.getContractFactory("HappyChildhood");
  const happyChildhood = await HappyChildhood.deploy();

  // Deploy the contract.
  await happyChildhood.deployed();
  console.log("HappyChildhood deployed to:", happyChildhood.address);

  // Check balances before the donations are made.
  const addresses = [owner.address, donor.address, happyChildhood.address];
  console.log("== start ==");
  await printBalances(addresses);

  // Make the owner a few donations.
  const donation = {value: hre.ethers.utils.parseEther("1")};
  await happyChildhood.connect(donor).supportHappyChildhood("Carolina", "You're the best organization!", donation);
  await happyChildhood.connect(donor2).supportHappyChildhood("Vitto", "Everythig for the sake of children!", donation);
  await happyChildhood.connect(donor3).supportHappyChildhood("Kay", "There is someone thinking about you!", donation);

  // Check balances after the donations have been made.
  console.log("== donations ==");
  await printBalances(addresses);

  // Withdraw all of the donations.
  await happyChildhood.connect(owner).withdrawDonations();

  // Check balances after withdrawal.
  console.log("== withdrawDonations ==");
  await printBalances(addresses);

  // Check out the memos.
  console.log("== memos ==");
  const memos = await happyChildhood.getMemos();
  printMemos(memos);
  
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
