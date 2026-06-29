import { useState } from "react";
import { ethers } from "ethers";
import { useAccount } from "wagmi";

// Ensure these are in your .env.local file
const MARKETPLACE_ADDRESS = process.env.NEXT_PUBLIC_MARKETPLACE_ADDRESS || "";
const STABLECOIN_ADDRESS = process.env.NEXT_PUBLIC_STABLECOIN_ADDRESS || "";

export function useMarketplace() {
  const [isProcessing, setIsProcessing] = useState(false);
  const { address } = useAccount();

  /**
   * Orchestrates the secure Escrow flow:
   * 1. Checks current allowance for the stablecoin.
   * 2. Requests approval if balance is insufficient.
   * 3. Executes the Trade on the Marketplace contract.
   */
  const initiateTrade = async (listingId: string, totalPrice: number) => {
    if (!address) throw new Error("Wallet not connected");
    if (!window.ethereum) throw new Error("No browser wallet detected");

    setIsProcessing(true);

    try {
      // Initialize Ethers Provider
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      // Marketplace ABI interface
      const marketplaceAbi = [
        "function initiateTrade(string listingId, address stablecoin, uint256 totalPrice) external returns (bytes32)",
      ];
      // ERC20 ABI interface for stablecoin
      const erc20Abi = [
        "function approve(address spender, uint256 amount) external returns (bool)",
        "function allowance(address owner, address spender) external view returns (uint256)",
      ];

      const marketplace = new ethers.Contract(
        MARKETPLACE_ADDRESS,
        marketplaceAbi,
        signer,
      );
      const stablecoin = new ethers.Contract(
        STABLECOIN_ADDRESS,
        erc20Abi,
        signer,
      );

      // Define amount (using 6 decimals for USDT/USDC, change to 18 if using DAI)
      const amount = ethers.parseUnits(totalPrice.toString(), 6);

      // 1. Allowance Check & Approval
      const currentAllowance = await stablecoin.allowance(
        address,
        MARKETPLACE_ADDRESS,
      );

      if (currentAllowance < amount) {
        console.log("Requesting approval...");
        const txApprove = await stablecoin.approve(MARKETPLACE_ADDRESS, amount);
        await txApprove.wait(); // Wait for user to confirm and blockchain to mine
        console.log("Approval confirmed.");
      }

      // 2. Execute Trade
      console.log("Initiating trade...");
      const tx = await marketplace.initiateTrade(
        listingId,
        STABLECOIN_ADDRESS,
        amount,
      );
      await tx.wait(); // Wait for escrow to lock and trade to initiate

      console.log("Trade successfully initiated on-chain.");
      return true;
    } catch (error) {
      console.error("Marketplace Execution Failed:", error);
      throw error; // Re-throw to handle in the UI (e.g., show an error toast)
    } finally {
      setIsProcessing(false);
    }
  };

  return { initiateTrade, isProcessing };
}
