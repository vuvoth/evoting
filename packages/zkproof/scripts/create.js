// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");
const OffChainManager = require("../src/OffChainManager");
async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  await hre.deployments.fixture(['Voting']);

  const deployInfo = await hre.deployments.get("Voting");

  const Voting = await hre.ethers.getContractFactory("Voting");
  const voting = Voting.attach(deployInfo.address);

  console.log(deployInfo.address)
  let sessionOffChain = OffChainManager.createVoteSession(4);
  mTree = sessionOffChain.mTree;
  tickets = sessionOffChain.tickets;
  root = sessionOffChain.root;

  let tx = await voting.createVoteSession(root);
  await tx.wait();

  console.log("finished......");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
