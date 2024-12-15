import * as hz from 'horizon/core';
import { ethers } from "ethers";
import * as dotenv from "dotenv";

dotenv.config(); // Load environment variables

// Smart contract ABI (Application Binary Interface)
const ABI = [
  "function startGame(address _player2) external payable",
  "function fundGame() external payable",
  "function declareWinner(address _winner) external",
  "function player1() public view returns (address)",
  "function player2() public view returns (address)",
  "function winner() public view returns (address)",
  "function totalWinnings() public view returns (uint256)"
];

// Zytron Testnet RPC URL and Contract Address
const RPC_URL = "https://rpc-testnet.zypher.network";
const CONTRACT_ADDRESS = "0x9661879Ba9dE1A96720E7950529C10954b87E798"; // Replace with your deployed contract address

// Wallet private key from environment variables
const PRIVATE_KEY = process.env.PRIVATE_KEY!; // Ensure `.env` contains PRIVATE_KEY

class ZypherNetwork extends hz.Component<typeof ZypherNetwork> {
  static propsDefinition = {};

  // Ethers.js instances
  private provider: ethers.JsonRpcProvider;
  private wallet: ethers.Wallet;
  private contract: ethers.Contract;

  constructor(props: any) {
    super(props);

    // Initialize ethers.js components
    this.provider = new ethers.JsonRpcProvider(RPC_URL);
    this.wallet = new ethers.Wallet(PRIVATE_KEY, this.provider);
    this.contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, this.wallet);
  }

  /**
   * Start a game session by player1.
   * @param {string} player2Address - The address of player2.
   * @param {string} value - The amount of ETH to deposit (in wei).
   */
  async startGame(player2Address: string, value: string) {
    try {
      console.log("Starting game...");
      const tx = await this.contract.startGame(player2Address, { value });
      await tx.wait();
      console.log("Game started successfully:", tx.hash);
    } catch (error) {
      console.error("Error starting game:", error);
    }
  }

  /**
   * Fund the game session by player2.
   */
  async fundGame() {
    try {
      console.log("Funding game...");
      const tx = await this.contract.fundGame({ value: ethers.parseEther("0.001") }); // Example: 0.001 ETH
      await tx.wait();
      console.log("Game funded successfully:", tx.hash);
    } catch (error) {
      console.error("Error funding game:", error);
    }
  }

  /**
   * Declare the winner of the game.
   * @param {string} winnerAddress - The address of the winner.
   */
  async declareWinner(winnerAddress: string) {
    try {
      console.log("Declaring winner...");
      const tx = await this.contract.declareWinner(winnerAddress);
      await tx.wait();
      console.log("Winner declared successfully:", tx.hash);
    } catch (error) {
      console.error("Error declaring winner:", error);
    }
  }

  /**
   * Fetch and log game details.
   */
  async getGameDetails() {
    try {
      console.log("Fetching game details...");
      const player1 = await this.contract.player1();
      const player2 = await this.contract.player2();
      const winner = await this.contract.winner();
      const totalWinnings = await this.contract.totalWinnings();

      console.log({
        player1,
        player2,
        winner,
        totalWinnings: ethers.formatEther(totalWinnings.toString()) + " ETH",
      });
    } catch (error) {
      console.error("Error fetching game details:", error);
    }
  }

  // Example entry point to call one of the methods
  async start() {
    try {
      // Call any contract function here, e.g., startGame
      const player2Address = "0xPlayer2Address"; // Replace with actual player2 address
      const depositAmount = ethers.parseEther("0.001").toString(); // Example: 0.001 ETH in wei

      // Start the game
      await this.startGame(player2Address, depositAmount);

      // Fetch game details
      await this.getGameDetails();
    } catch (error) {
      console.error("Error in ZypherNetwork start method:", error);
    }
  }
}

// Register the component
hz.Component.register(ZypherNetwork);
