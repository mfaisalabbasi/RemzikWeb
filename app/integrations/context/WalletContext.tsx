"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useWallets, usePrivy } from "@privy-io/react-auth";
import { BrowserProvider } from "ethers";

interface WalletContextType {
  userProfile: any | null;
  loading: boolean;
  getVerifiedSigner: (
    expectedAddress?: string,
  ) => Promise<{ signer: any; address: string }>;
  refreshProfile: () => Promise<void>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const { authenticated } = usePrivy();
  const { wallets } = useWallets();
  const [userProfile, setUserProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Calls your backend route: GET /investors/me
  const fetchProfile = async () => {
    if (!authenticated) {
      setUserProfile(null);
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/investors/me`,
        {
          credentials: "include",
        },
      );
      if (res.ok) {
        const data = await res.json();
        setUserProfile(data);
      }
    } catch (err) {
      console.error("Failed to fetch investor profile:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [authenticated]);

  // Universal Signer Resolver with automatic mismatch prevention
  const getVerifiedSigner = async (overrideTargetAddress?: string) => {
    if (wallets.length === 0)
      throw new Error("No connected wallets found in session.");

    // Priority: Explicit override -> Database user profile wallet -> First privy wallet
    const targetAddress =
      overrideTargetAddress ||
      userProfile?.user?.walletAddress ||
      wallets[0].address;

    const matchedWallet =
      wallets.find(
        (w) => w.address.toLowerCase() === targetAddress.toLowerCase(),
      ) || wallets[0];

    const provider = new BrowserProvider(
      await matchedWallet.getEthereumProvider(),
    );
    const signer = await provider.getSigner();
    const connectedAddress = await signer.getAddress();

    if (connectedAddress.toLowerCase() !== targetAddress.toLowerCase()) {
      throw new Error(
        `Wallet mismatch! Please switch your wallet to match the active account address: ${targetAddress}. Currently connected: ${connectedAddress}`,
      );
    }

    return { signer, address: connectedAddress };
  };

  return (
    <WalletContext.Provider
      value={{
        userProfile,
        loading,
        getVerifiedSigner,
        refreshProfile: fetchProfile,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useAppWallet() {
  const context = useContext(WalletContext);
  if (!context)
    throw new Error("useAppWallet must be used within a WalletProvider");
  return context;
}
