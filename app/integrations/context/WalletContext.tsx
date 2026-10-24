"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useWallets, usePrivy } from "@privy-io/react-auth";
import { BrowserProvider } from "ethers";
import api from "@/app/integrations/lib/axios"; // Adjust path to your axios instance

interface WalletContextType {
  userProfile: any | null;
  userWalletAddress: string | null;
  loading: boolean;
  getVerifiedSigner: (
    overrideTargetAddress?: string,
  ) => Promise<{ signer: any; address: string }>;
  refreshProfile: () => Promise<void>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const privy = usePrivy() as any;
  const { ready, authenticated } = privy;
  const { wallets } = useWallets();

  const [userProfile, setUserProfile] = useState<any | null>(null);
  const [userWalletAddress, setUserWalletAddress] = useState<string | null>(
    null,
  );
  const [loading, setLoading] = useState<boolean>(true);

  // 🚀 Auto-sync Privy custom token on mount (Mobile Parity Bridge)
  useEffect(() => {
    if (!ready || authenticated) return;

    async function syncPrivySession() {
      try {
        const res = await api.get("/auth/privy-token", {
          withCredentials: true,
        });
        const customToken = res.data?.token || res.data?.privyCustomToken;
        if (customToken && typeof privy.loginWithCustomToken === "function") {
          await privy.loginWithCustomToken({ token: customToken });
          console.log(
            "✅ [WalletContext] Successfully synced Privy session via custom token.",
          );
        }
      } catch (err) {
        console.warn("⚠️ [WalletContext] Custom token sync note:", err);
      }
    }

    syncPrivySession();
  }, [ready, authenticated, privy]);

  const fetchProfile = async () => {
    try {
      const [authRes, investorRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
          credentials: "include",
        }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/investors/me`, {
          credentials: "include",
        }).catch(() => null),
      ]);

      let addressFromAuth: string | null = null;
      if (authRes.ok) {
        const authData = await authRes.json();
        addressFromAuth = authData.walletAddress || null;
      }

      let investorData: any = null;
      if (investorRes && investorRes.ok) {
        investorData = await investorRes.json();
      }

      setUserProfile(investorData || {});
      setUserWalletAddress(
        addressFromAuth ||
          investorData?.user?.walletAddress ||
          wallets?.[0]?.address ||
          null,
      );
    } catch (err) {
      console.error("Failed to fetch user/investor profile:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (ready) {
      fetchProfile();
    }
  }, [ready, authenticated, wallets.length]);

  const getVerifiedSigner = async (overrideTargetAddress?: string) => {
    // 1. Ensure we have active wallets, or try one more quick sync if empty
    let activeWallets = wallets;
    if (
      activeWallets.length === 0 &&
      typeof privy.loginWithCustomToken === "function"
    ) {
      try {
        const res = await api.get("/auth/privy-token", {
          withCredentials: true,
        });
        const customToken = res.data?.token || res.data?.privyCustomToken;
        if (customToken) {
          await privy.loginWithCustomToken({ token: customToken });
          await new Promise((r) => setTimeout(r, 1000));
          activeWallets = privy.wallets || wallets;
        }
      } catch {}
    }

    const targetAddress =
      overrideTargetAddress ||
      userWalletAddress ||
      userProfile?.user?.walletAddress ||
      activeWallets?.[0]?.address;

    if (!targetAddress && activeWallets.length === 0) {
      throw new Error(
        "No whitelisted wallet address or active Privy session found. Please refresh.",
      );
    }

    const resolvedAddress = targetAddress || activeWallets[0]?.address;

    let matchedWallet = activeWallets.find(
      (w: any) => w.address?.toLowerCase() === resolvedAddress?.toLowerCase(),
    );

    if (!matchedWallet) {
      matchedWallet =
        activeWallets.find((w: any) => w.walletClientType === "privy") ||
        activeWallets[0];
    }

    if (!matchedWallet) {
      throw new Error(
        "No connected Privy embedded wallet found in active session.",
      );
    }

    const provider = new BrowserProvider(
      await matchedWallet.getEthereumProvider(),
    );
    const signer = await provider.getSigner();
    const connectedAddress = await signer.getAddress();

    return { signer, address: connectedAddress };
  };

  return (
    <WalletContext.Provider
      value={{
        userProfile,
        userWalletAddress: userWalletAddress || wallets?.[0]?.address || null,
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
  if (!context) {
    throw new Error("useAppWallet must be used within a WalletProvider");
  }
  return context;
}
