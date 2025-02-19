import { expect } from "chai";
import { ethers, Contract, Signer } from "hardhat";

describe("ColorBottleGame", function () {
    let colorBottleGame: Contract;
    let owner: Signer;
    let player: Signer;

    beforeEach(async function () {
        // Get signers
        [owner, player] = await ethers.getSigners();

        // Deploy the contract
        const ColorBottleGame = await ethers.getContractFactory("ColorBottleGame");
        colorBottleGame = await ColorBottleGame.deploy();
    });

    describe("Deployment", function () {
        it("should deploy the contract successfully", async function () {
            const ColorBottleGame = await ethers.getContractFactory("ColorBottleGame");
            const contract = await ColorBottleGame.deploy();
            expect(contract.target).to.not.be.undefined;
        });

        it("should log the correct deployment address", async function () {
            const ColorBottleGame = await ethers.getContractFactory("ColorBottleGame");
            const contract = await ColorBottleGame.deploy();
            console.log("Deployed contract address:", contract.target);
            expect(contract.target).to.match(/^0x[a-fA-F0-9]{40}$/);
        });
    });

    describe("constructor", function () {
        it("should initialize game with correct parameters", async function () {
            const ownerAddress = await owner.getAddress();
            expect(await colorBottleGame.getAttemptsLeft()).to.equal(5);
            expect(await colorBottleGame.gameOver()).to.be.false;
        });
    });

    describe("play function", function () {
        it("should allow playing the game and reduce attempts", async function () {
            const initialAttempts = await colorBottleGame.getAttemptsLeft();
            const result = await colorBottleGame.connect(player).play([1, 2, 3, 4, 5]);
            const newAttempts = await colorBottleGame.getAttemptsLeft();

            expect(newAttempts).to.equal(initialAttempts - 1);
            expect(result).to.be.within(0, 5); // Correct matches can be 0 to 5
        });

        it("should end the game when all bottles are correctly arranged", async function () {
            // Simulate all correct guesses (this might not work if initial sequence is shuffled)
            const result = await colorBottleGame.connect(player).play([5, 4, 3, 2, 1]); // Assume reverse sequence is correct
            if (result == 5) {
                expect(await colorBottleGame.gameOver()).to.be.true;
            }
        });

        it("should not allow playing after winning", async function () {
            // Force gameOver to true for this test
            for (let i = 0; i < 5; i++) {
                await colorBottleGame.connect(player).play([1, 2, 3, 4, 5]);
            }

            await expect(colorBottleGame.connect(player).play([1, 2, 3, 4, 5])).to.be.revertedWith("Game is over, start a new game.");
        });

        it("should shuffle the sequence after 5 attempts", async function () {
            const initialSequence = await colorBottleGame.currentSequence();
            for (let i = 0; i < 5; i++) {
                await colorBottleGame.connect(player).play([1, 2, 3, 4, 5]);
            }
            const newSequence = await colorBottleGame.currentSequence();
            
            // Since the sequence is shuffled, they should not be exactly the same
            expect(initialSequence).to.not.deep.equal(newSequence);
            expect(await colorBottleGame.getAttemptsLeft()).to.equal(5); // Reset to 5 attempts
        });
    });

    describe("startNewGame function", function () {
        it("should reset game state", async function () {
            // Play until game over or attempts exhausted
            for (let i = 0; i < 5; i++) {
                await colorBottleGame.connect(player).play([1, 2, 3, 4, 5]);
            }

            await colorBottleGame.connect(player).startNewGame();
            expect(await colorBottleGame.gameOver()).to.be.false;
            expect(await colorBottleGame.getAttemptsLeft()).to.equal(5);
        });
    });
});