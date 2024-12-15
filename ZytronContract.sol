// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract GameSession {
    address public player1;
    address public player2;
    address public winner;
    uint256 public totalWinnings;

    enum GameState { NotStarted, Started, Ended }
    GameState public gameState;

    constructor() {
        gameState = GameState.NotStarted;
    }

    // Initialize players and start the game
    function startGame(address _player2) external payable {
        require(gameState == GameState.NotStarted, "Game already started");
        require(msg.value > 0, "Must deposit ETH to start");

        player1 = msg.sender;
        player2 = _player2;
        totalWinnings = msg.value;
        gameState = GameState.Started;
    }

    // Fund the game session
    function fundGame() external payable {
        require(gameState == GameState.Started, "Game not active");
        require(msg.sender == player2, "Only player2 can fund");
        totalWinnings += msg.value;
    }

    // Declare the winner and transfer winnings
    function declareWinner(address _winner) external {
        require(gameState == GameState.Started, "Game not active");
        require(_winner == player1 || _winner == player2, "Invalid winner");

        winner = _winner;
        gameState = GameState.Ended;

        (bool success, ) = winner.call{value: totalWinnings}("");
        require(success, "Transfer failed");
    }
}
