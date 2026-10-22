"use client";

import React from "react";
import { PrivyProvider } from "@privy-io/react-auth";
import { polygonAmoy } from "viem/chains";

export function SigningPrivyWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID!}
      config={{
        appearance: { theme: "dark", accentColor: "#34D399" },
        embeddedWallets: {
          ethereum: { createOnLogin: "users-without-wallets" },
        },
        defaultChain: polygonAmoy,
        supportedChains: [polygonAmoy],
      }}
    >
      {children}
    </PrivyProvider>
  );
}
