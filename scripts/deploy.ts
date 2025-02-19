import { ethers } from "hardhat";

async function main() {
  // Get the contract factory for the ColorBottleGame
  const ColorBottleGame = await ethers.getContractFactory("ColorBottleGame");

  // Deploy the contract
  const colorBottleGame = await ColorBottleGame.deploy();

  // Wait for the contract to be deployed
  await colorBottleGame.waitForDeployment();

  console.log("ColorBottleGame deployed to:", colorBottleGame.target);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});