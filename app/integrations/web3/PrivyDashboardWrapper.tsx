"use client";

import React, { useEffect } from "react";
import { PrivyProvider, usePrivy } from "@privy-io/react-auth";
import { Chain } from "viem";
import { polygonAmoy } from "viem/chains";
import api from "@/app/integrations/lib/axios"; // Adjust path to your axios instance

const hardhatLocal: Chain = {
  id: 31337,
  name: "Hardhat Local",
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: {
    default: { http: ["http://127.0.0.1:8545"] },
    public: { http: ["http://127.0.0.1:8545"] },
  },
};

function PrivyTokenSyncBridge({ children }: { children: React.ReactNode }) {
  const privy = usePrivy() as any;
  const { ready, authenticated } = privy;

  useEffect(() => {
    if (!ready || authenticated) return;

    async function hydrateCustomAuth() {
      try {
        const res = await api.get("/auth/privy-token", {
          withCredentials: true,
        });
        const token = res.data?.privyCustomToken;
        if (token && typeof privy.loginWithCustomToken === "function") {
          await privy.loginWithCustomToken({ token });
          console.log(
            "✅ [Web] Successfully authenticated with Privy custom token.",
          );
        }
      } catch (err) {
        console.warn("⚠️ [Web] Custom token hydration note:", err);
      }
    }

    hydrateCustomAuth();
  }, [ready, authenticated, privy]);

  return <>{children}</>;
}

export function PrivyDashboardWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
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
          theme: "dark",
          accentColor: "#34D399",
        },
        embeddedWallets: {
          ethereum: {
            createOnLogin: "users-without-wallets",
          },
        },
        defaultChain: activeDefaultChain,
        supportedChains: [polygonAmoy, hardhatLocal],
      }}
    >
      <PrivyTokenSyncBridge>{children}</PrivyTokenSyncBridge>
    </PrivyProvider>
  );
}
