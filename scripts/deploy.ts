import { ethers } from "hardhat";

async function main() {
  const ColorBottleGame = await ethers.getContractFactory("ColorBottleGame");

  const colorBottleGame = await ColorBottleGame.deploy();

  await colorBottleGame.waitForDeployment();

  console.log("ColorBottleGame deployed to:", colorBottleGame.target);
}


main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});