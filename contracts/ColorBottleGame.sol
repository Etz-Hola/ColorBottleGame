// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ColorBottleGame {
    
    uint256[] private currentSequence;
    uint256 public attemptsLeft = 5;
    bool public gameOver = false;

    constructor() {
        currentSequence = [uint256(1), 2, 3, 4, 5];
        shuffleSequence();
    }

    function shuffleSequence() private {
        for (uint256 i = 0; i < currentSequence.length; i++) {
            uint256 n = i + uint256(keccak256(abi.encodePacked(block.timestamp, msg.sender, i))) % (currentSequence.length - i);
            uint256 temp = currentSequence[n];
            currentSequence[n] = currentSequence[i];
            currentSequence[i] = temp;
        }
    }

    function play(uint256[5] memory _attempt) public returns (uint256) {
        require(!gameOver, "Game is over, start a new game.");
        require(attemptsLeft > 0, "No attempts left. Game Over.");
        
        uint256 correctCount = 0;
        for (uint256 i = 0; i < 5; i++) {
            if (currentSequence[i] == _attempt[i]) {
                correctCount++;
            }
        }

        attemptsLeft--;

        if (correctCount == 5) {
            gameOver = true;
        }

        if (attemptsLeft == 0) {
            shuffleSequence();
            attemptsLeft = 5;
        }

        return correctCount;
    }

    function startNewGame() public {
        gameOver = false;
        attemptsLeft = 5;
        shuffleSequence();
    }

    function getAttemptsLeft() public view returns (uint256) {
        return attemptsLeft;
    }
}