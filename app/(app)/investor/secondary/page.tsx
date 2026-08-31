"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { ethers } from "ethers";
import { useWallets } from "@privy-io/react-auth";
import styles from "../components/secondary/secondary.module.css";
import {
  MarketPosition,
  Order,
  ActiveTrade,
} from "../components/secondary/types";
import MarketPositionCard from "../components/secondary/MarketPositionCard";
import SellPositionModal from "../components/secondary/SellPositionModal";
import TradeSuccessModal from "../components/secondary/TradeSucessModal";
import OrderBookTable from "../components/secondary/OrderBookTable";
import {
  BarChart3,
  Wallet,
  ShieldAlert,
  Clock,
  CheckCircle,
} from "lucide-react";
import { useAlert } from "@/app/integrations/Alert/AlertContext";

export type ExtendedOrder = Order & { sellerId: string; tokenAddress: string };

export default function SecondaryMarketPage() {
  const [positions, setPositions] = useState<MarketPosition[]>([]);
  const [orders, setOrders] = useState<ExtendedOrder[]>([]);
  const [activeTrades, setActiveTrades] = useState<ActiveTrade[]>([]);
  const [loading, setLoading] = useState(true);

  // FIXED: Track loading per-item to prevent global UI lock
  const [loadingIds, setLoadingIds] = useState<Record<string, boolean>>({});

  const [selectedSell, setSelectedSell] = useState<MarketPosition | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const { showAlert } = useAlert();
  const { wallets } = useWallets();

  const fetchMarketData = useCallback(async () => {
    try {
      const timestamp = Date.now();
      const [posRes, listingsRes, tradesRes, userRes] = await Promise.all([
        fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/investors/my-positions?cb=${timestamp}`,
          { credentials: "include" },
        ),
        fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/secondary-market/listings/all?cb=${timestamp}`,
          { credentials: "include" },
        ),
        fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/secondary-market/trade/active?cb=${timestamp}`,
          { credentials: "include" },
        ),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me?cb=${timestamp}`, {
          credentials: "include",
        }),
      ]);

      if (posRes.ok && listingsRes.ok) {
        const posData = await posRes.json();
        const listingsData = await listingsRes.json();
        const tradesData = tradesRes.ok ? await tradesRes.json() : [];
        const userData = userRes.ok ? await userRes.json() : null;

        if (userData) setCurrentUserId(userData.id);

        setPositions(posData || []);
        setOrders(
          (listingsData || []).map((l: any) => ({
            id: l.id,
            assetId: l.assetId,
            assetTitle: l.asset?.title || "Real Estate Unit",
            type: "sell",
            quantity: parseFloat(l.unitsForSale),
            price: parseFloat(l.pricePerUnit),
            sellerId: l.sellerId,
            tokenAddress: l.asset?.tokenAddress,
          })),
        );
        setActiveTrades(
          (tradesData || []).map((t: any) => ({
            id: t.id,
            assetTitle: t.asset?.title || "Real Estate Unit",
            amount: parseFloat(t.totalPrice) || 0,
            status: t.status ? t.status.toString().toUpperCase() : "LOCKED",
            buyerId: t.buyer?.user?.id,
            sellerId: t.seller?.user?.id,
          })),
        );
      }
    } catch (error) {
      console.error("Market sync failed:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMarketData();
  }, [fetchMarketData]);

  const visibleActiveTrades = useMemo(
    () =>
      activeTrades.filter(
        (t) => t.status === "LOCKED" || t.status === "DISPUTED",
      ),
    [activeTrades],
  );

  const handleSettleTrade = async (tradeId: string) => {
    if (loadingIds[tradeId]) return;
    if (
      !confirm(
        "Confirm acquisition & release funds to seller? This settles the trade on-chain.",
      )
    )
      return;

    setLoadingIds((prev) => ({ ...prev, [tradeId]: true }));
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/secondary-market/trade/settle/${tradeId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        },
      );

      if (!res.ok) {
        const errorData = await res
          .json()
          .catch(() => ({ message: "Unknown settlement error" }));
        throw new Error(errorData.message || "Settlement failed.");
      }

      showAlert("success", "Trade finalized on-chain and funds released.");
      await fetchMarketData();
    } catch (err: any) {
      showAlert("error", err.message);
    } finally {
      setLoadingIds((prev) => ({ ...prev, [tradeId]: false }));
    }
  };

  const handleOpenDispute = async (tradeId: string) => {
    const reason = prompt("Reason for dispute:");
    if (!reason) return;

    setLoadingIds((prev) => ({ ...prev, [tradeId]: true }));
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/disputes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          referenceId: tradeId,
          type: "SECONDARY_TRADE",
          reason,
        }),
      });
      if (!res.ok) throw new Error("Dispute failed");
      showAlert("success", "Dispute opened.");
      await fetchMarketData();
    } catch (err: any) {
      showAlert("error", err.message);
    } finally {
      setLoadingIds((prev) => ({ ...prev, [tradeId]: false }));
    }
  };

  const handleExecuteTrade = async (listingId: string) => {
    const order = orders.find((o) => o.id === listingId);
    if (!order) return;

    const useOnChain = window.confirm(
      `Do you want to execute this trade ON-CHAIN atomically for ${order.assetTitle}?\n\n(Click Cancel for Off-Chain Escrow mode)`,
    );

    setLoadingIds((prev) => ({ ...prev, [listingId]: true }));
    try {
      if (useOnChain) {
        // --- 1. ON-CHAIN ATOMIC EXECUTION FLOW ---
        const wallet = wallets[0];
        if (!wallet) throw new Error("No connected wallet found.");

        const provider = new ethers.BrowserProvider(
          await wallet.getEthereumProvider(),
        );
        const signer = await provider.getSigner();
        const buyerAddress = await signer.getAddress();

        const stablecoinAddress = process.env.NEXT_PUBLIC_STABLECOIN_ADDRESS;
        const marketplaceAddress = process.env.NEXT_PUBLIC_MARKETPLACE_ADDRESS;

        // MockUSDC uses 6 decimals
        const totalPriceWei = ethers.parseUnits(
          (order.quantity * order.price).toString(),
          6,
        );

        // Check and Approve MockUSDC allowance if needed
        const tokenContract = new ethers.Contract(
          stablecoinAddress!,
          [
            "function allowance(address owner, address spender) view returns (uint256)",
            "function approve(address spender, uint256 amount) external returns (bool)",
          ],
          signer,
        );

        const currentAllowance = await tokenContract.allowance(
          buyerAddress,
          marketplaceAddress,
        );
        if (currentAllowance < totalPriceWei) {
          showAlert("info", "Approving MockUSDC for marketplace settlement...");
          const approveTx = await tokenContract.approve(
            marketplaceAddress,
            totalPriceWei,
          );
          await approveTx.wait();
        }

        // Call Marketplace contract executeOnChainTrade
        const marketplaceContract = new ethers.Contract(
          marketplaceAddress!,
          [
            "function executeOnChainTrade(string calldata listingId, address paymentToken, uint256 paymentAmount) external",
          ],
          signer,
        );

        showAlert("info", "Submitting on-chain trade transaction...");
        const tx = await marketplaceContract.executeOnChainTrade(
          listingId,
          stablecoinAddress!,
          totalPriceWei,
        );
        await tx.wait();

        // FIXED: Robust backend sync with retry loop passing settlementMode and txHash matching TradeController requirements
        const syncBackendWithRetry = async (retries = 3) => {
          for (let i = 0; i < retries; i++) {
            try {
              const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/secondary-market/trade/execute/${listingId}`,
                {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    settlementMode: "ON_CHAIN",
                    txHash: tx.hash,
                  }),
                  credentials: "include",
                },
              );
              if (res.ok) return true;
            } catch (netErr) {
              // Ignore network blip on current iteration and retry
            }
            await new Promise((r) => setTimeout(r, 1500 * (i + 1)));
          }
          console.warn(
            "On-chain trade settled, but backend sync database update missed retries.",
          );
          return false;
        };

        await syncBackendWithRetry();
        setSuccessMessage("On-chain atomic trade settled successfully!");
      } else {
        // --- 2. EXISTING OFF-CHAIN ESCROW FLOW ---
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/secondary-market/trade/execute/${listingId}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ settlementMode: "OFF_CHAIN" }),
            credentials: "include",
          },
        );
        if (!res.ok) throw new Error("Trade intent failed");

        setSuccessMessage("Intent created! Funds locked in Remzik Escrow.");
      }

      await fetchMarketData();
    } catch (err: any) {
      showAlert("error", err.message);
    } finally {
      setLoadingIds((prev) => ({ ...prev, [listingId]: false }));
    }
  };

  const handleCancelListing = async (listingId: string) => {
    const order = orders.find((o) => o.id === listingId);
    if (!order || !confirm("Retract this listing?")) return;

    setLoadingIds((prev) => ({ ...prev, [listingId]: true }));
    try {
      const wallet = wallets[0];
      const provider = new ethers.BrowserProvider(
        await wallet.getEthereumProvider(),
      );
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        process.env.NEXT_PUBLIC_MARKETPLACE_ADDRESS!,
        ["function cancelListing(string calldata listingId) external"],
        signer,
      );

      const tx = await contract.cancelListing(order.id);
      await tx.wait();

      const syncWithRetry = async (retries = 3) => {
        for (let i = 0; i < retries; i++) {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/secondary-market/listings/${listingId}`,
            {
              method: "DELETE",
              credentials: "include",
            },
          );
          if (res.ok) return true;
          await new Promise((r) => setTimeout(r, 1500 * (i + 1)));
        }
        throw new Error("Blockchain updated, but database failed to sync.");
      };

      await syncWithRetry();
      showAlert("success", "Listing successfully retracted.");
      await fetchMarketData();
    } catch (err: any) {
      showAlert("error", `Cancellation failed: ${err.message}`);
    } finally {
      setLoadingIds((prev) => ({ ...prev, [listingId]: false }));
    }
  };

  const handleListingSuccess = async () => {
    setSuccessMessage("Asset listed! Syncing with Remzik Ledger...");
    setSelectedSell(null);

    let attempts = 0;
    const poll = setInterval(async () => {
      attempts++;
      await fetchMarketData();
      if (attempts >= 5) clearInterval(poll);
    }, 2000);
  };

  if (loading) {
    return (
      <div className={styles.loadingScreen}>
        <div className={styles.loaderSpinner}></div>
        <span>Syncing Remzik Liquidity...</span>
      </div>
    );
  }

  return (
    <div className={styles.secondaryMarketPage}>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.breadcrumb}>Remzik / Secondary Market</div>
          <h1>
            Market <span className={styles.accent}>Liquidity</span>
          </h1>
          <p>Institutional-grade P2P exchange for fractionalized RWA.</p>
        </div>
        <div className={styles.headerRight}>
          <div className={styles.liveBadge}>
            <div className={styles.greenPulse}></div>Remzik Ledger Active
          </div>
        </div>
      </header>

      <main className={styles.marketLayout}>
        <aside className={styles.sidebar}>
          <section className={styles.holdingsWrapper}>
            <div className={styles.columnHeader}>
              <Wallet size={18} className={styles.iconGold} />
              <h2>My Holdings</h2>
            </div>
            <div className={styles.cardsContainer}>
              {positions.length > 0 ? (
                positions.map((p) => (
                  <MarketPositionCard
                    key={p.id}
                    position={p}
                    onBuy={() => {}}
                    onSell={() => setSelectedSell(p)}
                  />
                ))
              ) : (
                <div className={styles.emptyState}>No holdings detected.</div>
              )}
            </div>
          </section>

          <section className={styles.activeTradesWrapper}>
            <div className={styles.columnHeader}>
              <Clock size={18} className={styles.iconGold} />
              <h2>Active Trades</h2>
            </div>
            <div className={styles.activeTradesContainer}>
              {visibleActiveTrades.length > 0 ? (
                visibleActiveTrades.map((t) => {
                  const isBuyer = currentUserId === t.buyerId;
                  const isDisputed = t.status === "DISPUTED";
                  return (
                    <div
                      key={t.id}
                      className={`${styles.fintechTradeCard} ${isDisputed ? styles.disputedCard : ""}`}
                    >
                      <div className={styles.tradeMain}>
                        <div className={styles.tradeLeft}>
                          <strong>{t.assetTitle}</strong>
                          <span>SAR {t.amount.toLocaleString()}</span>
                        </div>
                        <div
                          className={`${styles.statusPill} ${styles[t.status.toLowerCase()] || styles.statusGeneric}`}
                        >
                          {t.status}
                        </div>
                      </div>
                      <div className={styles.tradeActions}>
                        {isDisputed ? (
                          <div className={styles.disputeWarning}>
                            <ShieldAlert size={14} /> Under Review
                          </div>
                        ) : (
                          <>
                            {isBuyer ? (
                              <button
                                disabled={loadingIds[t.id]}
                                onClick={() => handleSettleTrade(t.id)}
                                className={styles.settleAction}
                              >
                                {loadingIds[t.id] ? (
                                  "..."
                                ) : (
                                  <>
                                    <CheckCircle size={12} /> Confirm & Release
                                  </>
                                )}
                              </button>
                            ) : (
                              <div className={styles.waitingBadge}>
                                Waiting for Release
                              </div>
                            )}
                            <button
                              disabled={loadingIds[t.id]}
                              onClick={() => handleOpenDispute(t.id)}
                              className={styles.disputeAction}
                            >
                              <ShieldAlert size={12} /> Raise Dispute
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className={styles.emptyState}>No trades in escrow.</div>
              )}
            </div>
          </section>
        </aside>

        <section className={styles.orderBookSection}>
          <div className={styles.columnHeader}>
            <BarChart3 size={18} className={styles.iconGold} />
            <h2>Order Book</h2>
          </div>
          <div className={styles.tableCard}>
            <OrderBookTable
              orders={orders}
              onBuyNow={handleExecuteTrade}
              onCancel={handleCancelListing}
              currentUserId={currentUserId}
            />
          </div>
        </section>
      </main>

      {selectedSell && (
        <SellPositionModal
          position={selectedSell}
          tokenAddress={selectedSell.tokenAddress}
          onClose={() => setSelectedSell(null)}
          onSell={handleListingSuccess}
        />
      )}
      {successMessage && (
        <TradeSuccessModal
          message={successMessage}
          onClose={() => setSuccessMessage(null)}
        />
      )}
    </div>
  );
}
