// "use client";

// import React, { useEffect, useState } from "react";
// import { PrivyProvider, usePrivy, useWallets } from "@privy-io/react-auth";
// import api from "@/app/integrations/lib/axios";

// /**
//  * Internal Sync Engine that links Privy to your custom NestJS session state
//  * and anchors the resulting cryptographic wallet directly to Postgres.
//  */
// function WalletSyncEngine({ children }: { children: React.ReactNode }) {
//   const { ready, authenticated } = usePrivy();
//   const { wallets } = useWallets();
//   const [isSyncing, setIsSyncing] = useState(false);

//   useEffect(() => {
//     async function syncWalletToDatabase() {
//       // Once Privy syncs with your custom token and provisions a wallet, anchor it
//       if (ready && authenticated && wallets.length > 0 && !isSyncing) {
//         const activeWallet = wallets[0];
//         const walletAddress = activeWallet.address;

//         // OPTIMIZATION: Make the caching key user-specific by binding it to the active wallet address context.
//         // This prevents profile cross-contamination if switching roles during testing.
//         const cacheKey = `remzik_synced_wallet_${walletAddress.toLowerCase()}`;
//         const isAlreadySynced = localStorage.getItem(cacheKey);

//         if (isAlreadySynced === "true") return;

//         try {
//           setIsSyncing(true);
//           console.log(
//             "🚀 [Web3 Bridge] Anchoring invisible wallet address to backend profile:",
//             walletAddress,
//           );

//           // Hits your NestJS wallet storage engine
//           await api.post("/auth/sync-wallet", { walletAddress });

//           localStorage.setItem(cacheKey, "true");
//           console.log(
//             "✅ [Web3 Bridge] Wallet successfully anchored to user record.",
//           );
//         } catch (error) {
//           console.error(
//             "❌ [Web3 Bridge] Error executing wallet background synchronization:",
//             error,
//           );
//         } finally {
//           setIsSyncing(false);
//         }
//       }
//     }

//     syncWalletToDatabase();
//   }, [ready, authenticated, wallets, isSyncing]);

//   return <>{children}</>;
// }

// export function PrivyDashboardWrapper({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   // Callback function Privy uses natively to pull your NestJS custom token
//   async function fetchCustomToken(): Promise<string | undefined> {
//     try {
//       const res = await api.get("/auth/privy-token");
//       return res.data?.privyCustomToken || undefined;
//     } catch (err) {
//       console.error(
//         "❌ [Web3 Bridge] Custom Privy identity extraction bypassed:",
//         err,
//       );
//       return undefined;
//     }
//   }

//   return (
//     <PrivyProvider
//       appId={
//         process.env.NEXT_PUBLIC_PRIVY_APP_ID || "clpispdty00ycl80fpueukbhl"
//       }
//       config={{
//         embeddedWallets: {
//           ethereum: {
//             createOnLogin: "users-without-wallets",
//           },
//         },
//         // Pass the explicit configuration flags to cleanly satisfy Privy's strict type schema
//         customAuth: {
//           enabled: true,
//           isLoading: false,
//           getCustomAccessToken: fetchCustomToken,
//         },
//       }}
//     >
//       <WalletSyncEngine>{children}</WalletSyncEngine>
//     </PrivyProvider>
//   );
// }

//New local blockchain connection for testing purposes, not to be used in production

"use client";

import React, { useEffect, useState } from "react";

import { PrivyProvider, usePrivy, useWallets } from "@privy-io/react-auth";

import { Chain } from "viem";

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
  const { ready, authenticated } = usePrivy();

  const { wallets } = useWallets();

  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    async function syncWalletToDatabase() {
      if (ready && authenticated && wallets.length > 0 && !isSyncing) {
        const activeWallet = wallets[0];

        const walletAddress = activeWallet.address;

        const cacheKey = `remzik_synced_wallet_${walletAddress.toLowerCase()}`;

        const isAlreadySynced = localStorage.getItem(cacheKey);

        if (isAlreadySynced === "true") return;

        try {
          setIsSyncing(true);

          console.log(
            "🚀 [Web3 Bridge] Anchoring invisible wallet address to backend profile:",

            walletAddress,
          );

          await api.post("/auth/sync-wallet", { walletAddress });

          localStorage.setItem(cacheKey, "true");

          console.log(
            "✅ [Web3 Bridge] Wallet successfully anchored to user record.",
          );
        } catch (error) {
          console.error(
            "❌ [Web3 Bridge] Error executing wallet background synchronization:",

            error,
          );
        } finally {
          setIsSyncing(false);
        }
      }
    }

    syncWalletToDatabase();
  }, [ready, authenticated, wallets, isSyncing]);

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

  return (
    <PrivyProvider
      appId={
        process.env.NEXT_PUBLIC_PRIVY_APP_ID || "clpispdty00ycl80fpueukbhl"
      }
      config={{
        // Configuration fixed to match PrivyClientConfig structure

        embeddedWallets: {
          ethereum: {
            createOnLogin: "users-without-wallets",
          },
        },

        defaultChain: hardhatLocal,

        supportedChains: [hardhatLocal],

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
