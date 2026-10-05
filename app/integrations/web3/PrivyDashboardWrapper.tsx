"use client";

import React, { useEffect, useState } from "react";
import { PrivyProvider, usePrivy, useWallets } from "@privy-io/react-auth";
import { Chain } from "viem";
import { polygonAmoy } from "viem/chains";
import api from "@/app/integrations/lib/axios";

/**
 * Define your local Hardhat chain to satisfy Privy's strict type requirements.
 */
const hardhatLocal: Chain = {
  id: 31337,
  name: "Hardhat Local",
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: {
    default: { http: ["http://127.0.0.1:8545"] },
    public: { http: ["http://127.0.0.1:8545"] },
  },
};

/**
 * Internal Sync Engine that links Privy to your custom NestJS session state
 * and anchors the resulting cryptographic wallet directly to Postgres.
 */
function WalletSyncEngine({ children }: { children: React.ReactNode }) {
  const { ready, authenticated, user } = usePrivy();
  const { wallets } = useWallets();
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    if (!ready || !authenticated || !user?.id || wallets.length === 0) {
      return;
    }

    const activeWallet = wallets[0];

    if (!activeWallet?.address || isSyncing) {
      return;
    }

    let cancelled = false;

    const sync = async () => {
      try {
        setIsSyncing(true);

        await api.post(
          "/auth/sync-wallet",
          {
            walletAddress: activeWallet.address,
            privyUserId: user.id,
          },
          {
            withCredentials: true,
          },
        );

        if (!cancelled) {
          console.log(
            "✅ [Web3 Bridge] Privy wallet synchronized:",
            activeWallet.address,
          );
        }
      } catch (error) {
        if (!cancelled) {
          console.error(
            "❌ [Web3 Bridge] Wallet synchronization failed:",
            error,
          );
        }
      } finally {
        if (!cancelled) {
          setIsSyncing(false);
        }
      }
    };

    sync();

    return () => {
      cancelled = true;
    };
  }, [ready, authenticated, user?.id, wallets, isSyncing]);

  return <>{children}</>;
}

export function PrivyDashboardWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  async function fetchCustomToken(): Promise<string | undefined> {
    try {
      const res = await api.get("/auth/privy-token");
      return res.data?.privyCustomToken || undefined;
    } catch (err) {
      console.error(
        "❌ [Web3 Bridge] Custom Privy identity extraction bypassed:",
        err,
      );
      return undefined;
    }
  }

  // 🛡️ Automatically pick the default chain based on your environment variables
  const targetChainId = Number(
    process.env.NEXT_PUBLIC_TARGET_CHAIN_ID || 80002,
  );
  const isLocalEnv =
    process.env.NEXT_PUBLIC_USE_LOCAL_CHAIN === "true" ||
    targetChainId === 31337;

  const activeDefaultChain = isLocalEnv ? hardhatLocal : polygonAmoy;

  return (
    <PrivyProvider
      appId={
        process.env.NEXT_PUBLIC_PRIVY_APP_ID || "cmphkt3un00gr0ejug58m3k7o"
      }
      config={{
        appearance: {
          theme: "dark", // 👈 Forces Privy modals into dark mode
          accentColor: "#34D399", // 👈 Matches your emerald-400 theme
          logo: undefined,
        },
        embeddedWallets: {
          ethereum: {
            createOnLogin: "users-without-wallets",
          },
        },
        // Dynamically configures the default network based on your env setup
        defaultChain: activeDefaultChain,
        // Explicitly supports both Polygon Amoy (80002) and Hardhat (31337) to prevent runtime mismatch errors
        supportedChains: [polygonAmoy, hardhatLocal],
        customAuth: {
          enabled: true,
          isLoading: false,
          getCustomAccessToken: fetchCustomToken,
        },
      }}
    >
      <WalletSyncEngine>{children}</WalletSyncEngine>
    </PrivyProvider>
  );
}
