"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { ethers } from "ethers";
import { useWallets } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";
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
  X,
} from "lucide-react";
import { useAlert } from "@/app/integrations/Alert/AlertContext";

export type ExtendedOrder = Order & { sellerId: string; tokenAddress: string };

export default function SecondaryMarketPage() {
  const router = useRouter();
  const [positions, setPositions] = useState<MarketPosition[]>([]);
  const [orders, setOrders] = useState<ExtendedOrder[]>([]);
  const [activeTrades, setActiveTrades] = useState<ActiveTrade[]>([]);
  const [loading, setLoading] = useState(true);

  const [loadingIds, setLoadingIds] = useState<Record<string, boolean>>({});
  const [selectedSell, setSelectedSell] = useState<MarketPosition | null>(null);
  const [orderToExecute, setOrderToExecute] = useState<ExtendedOrder | null>(
    null,
  );

  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [currentUserWallet, setCurrentUserWallet] = useState<string | null>(
    null,
  );

  // 🚀 Shared Secure Enclave Iframe Signer States
  const [signUrl, setSignUrl] = useState<string | null>(null);
  const [activeTradeId, setActiveTradeId] = useState<string | null>(null);
  const [activeListingId, setActiveListingId] = useState<string | null>(null);
  const [isCancellationFlow, setIsCancellationFlow] = useState(false);

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

        if (userData) {
          setCurrentUserId(userData.id);
          setCurrentUserWallet(userData.walletAddress);
        }

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

  // 🚀 Listen for postMessage from /auth/sign iframe
  useEffect(() => {
    const handleMessage = async (event: MessageEvent) => {
      try {
        let data = event.data;
        if (typeof data === "string") {
          try {
            data = JSON.parse(data);
          } catch {
            return;
          }
        }

        if (!data || typeof data !== "object") return;

        if (data.type === "TX_SUCCESS" || data.type === "TRADE_SUCCESS") {
          const txHash = data.txHash;

          if (isCancellationFlow && activeListingId) {
            setOrders((prev) => prev.filter((o) => o.id !== activeListingId));
            try {
              await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/secondary-market/listings/${activeListingId}`,
                { method: "DELETE", credentials: "include" },
              );
            } catch (err) {
              console.warn("⚠️ Listing delete sync notice:", err);
            }
            showAlert("success", "Listing successfully retracted.");
          } else if (activeTradeId) {
            try {
              await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/secondary-market/trade/${activeTradeId}/submit-tx`,
                {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ txHash }),
                  credentials: "include",
                },
              );
            } catch (err) {
              console.warn("⚠️ Trade verification notice:", err);
            }
            setSuccessMessage("On-chain atomic trade settled successfully!");
          }

          setSignUrl(null);
          setActiveListingId(null);
          setActiveTradeId(null);
          setIsCancellationFlow(false);
          setLoadingIds({});
          await fetchMarketData();
        } else if (data.type === "TX_FAILED" || data.type === "TRADE_FAILED") {
          setSignUrl(null);
          setActiveListingId(null);
          setActiveTradeId(null);
          setIsCancellationFlow(false);
          setLoadingIds({});
          showAlert(
            "error",
            data.error || "Transaction failed or was rejected.",
          );
        }
      } catch (err) {
        // Ignore non-JSON messages
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [
    activeTradeId,
    activeListingId,
    isCancellationFlow,
    fetchMarketData,
    showAlert,
  ]);

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

  const handleExecuteTrade = (listingId: string) => {
    const order = orders.find((o) => o.id === listingId);
    if (!order) return;
    setOrderToExecute(order);
  };

  const confirmOnChainExecution = async () => {
    if (!orderToExecute) return;
    const listingId = orderToExecute.id;
    const order = orderToExecute;
    setOrderToExecute(null);

    setLoadingIds((prev) => ({ ...prev, [listingId]: true }));
    try {
      const intentRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/secondary-market/trade/intent`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            listingId,
            settlementMode: "ON_CHAIN",
          }),
          credentials: "include",
        },
      );

      if (!intentRes.ok) {
        const errData = await intentRes.json().catch(() => ({}));
        throw new Error(errData.message || "Failed to create trade intent.");
      }

      const intentData = await intentRes.json();
      const tradeId = intentData.tradeId;
      setActiveTradeId(tradeId);

      const tokenRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/privy-token`,
        { credentials: "include" },
      );
      const tokenData = await tokenRes.json();
      const token = tokenData?.privyCustomToken || tokenData?.token;

      if (!token) {
        throw new Error("Failed to authenticate secure signing session.");
      }

      const totalPriceWei = ethers
        .parseUnits((order.quantity * order.price).toString(), 6)
        .toString();

      const stablecoinAddress = process.env.NEXT_PUBLIC_STABLECOIN_ADDRESS;
      const marketplaceAddress = process.env.NEXT_PUBLIC_MARKETPLACE_ADDRESS;
      const targetChainId = Number(
        process.env.NEXT_PUBLIC_TARGET_CHAIN_ID || 31337,
      );

      const erc20Interface = new ethers.Interface([
        "function approve(address spender, uint256 amount) external returns (bool)",
      ]);
      const approvalData = erc20Interface.encodeFunctionData("approve", [
        marketplaceAddress,
        totalPriceWei,
      ]);

      const marketInterface = new ethers.Interface([
        "function executeOnChainTrade(string calldata listingId, uint256 purchaseAmount) external",
      ]);
      const txData = marketInterface.encodeFunctionData("executeOnChainTrade", [
        listingId,
        order.quantity,
      ]);

      const payload = {
        approvalPayload: {
          to: stablecoinAddress,
          data: approvalData,
        },
        txPayload: {
          to: marketplaceAddress,
          data: txData,
          chainId: targetChainId,
        },
        expectedStablecoinAddress: stablecoinAddress,
        expectedStablecoinAmount: totalPriceWei,
        expectedVaultAddress: marketplaceAddress,
      };

      const encodedPayload = encodeURIComponent(JSON.stringify(payload));
      const expectedWallet = currentUserWallet || "";

      let url = `/auth/sign?payload=${encodedPayload}&tradeId=${encodeURIComponent(
        tradeId,
      )}&autoAuth=true`;

      if (expectedWallet) {
        url += `&walletAddress=${encodeURIComponent(expectedWallet)}`;
      }
      if (token) {
        url += `&token=${encodeURIComponent(token)}`;
      }

      setSignUrl(url);
    } catch (err: any) {
      showAlert("error", err.message);
      setLoadingIds((prev) => ({ ...prev, [listingId]: false }));
    }
  };

  const confirmOffChainExecution = async () => {
    if (!orderToExecute) return;
    const listingId = orderToExecute.id;
    setOrderToExecute(null);

    setLoadingIds((prev) => ({ ...prev, [listingId]: true }));
    try {
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
      const marketplaceAddress = process.env.NEXT_PUBLIC_MARKETPLACE_ADDRESS!;
      const targetChainId = Number(
        process.env.NEXT_PUBLIC_TARGET_CHAIN_ID || 31337,
      );

      const marketInterface = new ethers.Interface([
        "function cancelListing(string calldata listingId) external",
      ]);
      const txData = marketInterface.encodeFunctionData("cancelListing", [
        order.id,
      ]);

      const payload = {
        txPayload: {
          to: marketplaceAddress,
          data: txData,
          chainId: targetChainId,
        },
      };

      const tokenRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/privy-token`,
        { credentials: "include" },
      );
      const tokenData = await tokenRes.json();
      const token = tokenData?.privyCustomToken || tokenData?.token;

      const encodedPayload = encodeURIComponent(JSON.stringify(payload));
      let url = `/auth/sign?payload=${encodedPayload}&listingId=${encodeURIComponent(
        listingId,
      )}&cancel=true&autoAuth=true`;

      if (currentUserWallet) {
        url += `&walletAddress=${encodeURIComponent(currentUserWallet)}`;
      }
      if (token) {
        url += `&token=${encodeURIComponent(token)}`;
      }

      setActiveListingId(listingId);
      setIsCancellationFlow(true);
      setSignUrl(url);
    } catch (err: any) {
      showAlert("error", `Cancellation failed: ${err.message}`);
      setLoadingIds((prev) => ({ ...prev, [listingId]: false }));
    }
  };

  const handleListingSuccess = async () => {
    setSuccessMessage("Asset listed successfully on order book!");
    setSelectedSell(null);
    await fetchMarketData();
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
        <div>
          <div className={styles.breadcrumb}>
            Remzik Protocol / Secondary Market
          </div>
          <h1>
            Market <span className={styles.accent}>Liquidity</span>
          </h1>
          <p>Institutional-grade P2P exchange for fractionalized RWA tokens.</p>
        </div>
        <div className={styles.headerRight}>
          <div className={styles.liveBadge}>
            <div className={styles.greenPulse}></div>Remzik Ledger Active
          </div>
        </div>
      </header>

      <main className={styles.marketGrid}>
        <aside className={styles.sidebar}>
          <section className={styles.holdingsWrapper}>
            <div className={styles.columnHeader}>
              <Wallet size={16} className={styles.iconGold} />
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
              <Clock size={16} className={styles.iconGold} />
              <h2>Active Trades</h2>
            </div>
            <div className={styles.activeTradesContainer}>
              {visibleActiveTrades.length > 0 ? (
                visibleActiveTrades.map((t) => {
                  const isBuyer = currentUserId === t.buyerId;
                  const isDisputed = t.status === "DISPUTED";
                  return (
                    <div key={t.id} className={styles.fintechTradeCard}>
                      <div className={styles.tradeMain}>
                        <div className={styles.tradeLeft}>
                          <strong>{t.assetTitle}</strong>
                          <span>SAR {t.amount.toLocaleString()}</span>
                        </div>
                        <div
                          className={`${styles.statusPill} ${
                            styles[t.status.toLowerCase()] || styles.locked
                          }`}
                        >
                          {t.status}
                        </div>
                      </div>
                      <div className={styles.tradeActions}>
                        {isDisputed ? (
                          <div
                            style={{
                              color: "#dc2626",
                              fontSize: "0.725rem",
                              fontWeight: "700",
                              display: "flex",
                              alignItems: "center",
                              gap: "4px",
                            }}
                          >
                            <ShieldAlert size={13} /> Under Admin Review
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
                                Waiting for Buyer Release
                              </div>
                            )}
                            <button
                              disabled={loadingIds[t.id]}
                              onClick={() => handleOpenDispute(t.id)}
                              className={styles.disputeAction}
                            >
                              <ShieldAlert size={12} /> Dispute
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
            <BarChart3 size={16} className={styles.iconGold} />
            <h2>Order Book</h2>
          </div>
          <div className={styles.tableContainer}>
            <OrderBookTable
              orders={orders}
              onBuyNow={handleExecuteTrade}
              onCancel={handleCancelListing}
              currentUserId={currentUserId}
            />
          </div>
        </section>
      </main>

      {orderToExecute && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalPanel}>
            <h3 className={styles.modalTitle}>Select Settlement Routing</h3>
            <p className={styles.tradeSuccessMessage}>
              Choose execution layer for acquiring shares of{" "}
              <strong style={{ color: "#0f172a" }}>
                {orderToExecute.assetTitle}
              </strong>
              .
            </p>

            <div
              style={{ display: "flex", flexDirection: "column", gap: "10px" }}
            >
              <button
                onClick={confirmOnChainExecution}
                className={styles.ctaPrimary}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span>⚡ On-Chain Atomic Settlement</span>
                <span
                  style={{
                    fontSize: "0.65rem",
                    textTransform: "uppercase",
                    backgroundColor: "rgba(255,255,255,0.2)",
                    padding: "2px 6px",
                    borderRadius: "4px",
                  }}
                >
                  Trustless
                </span>
              </button>

              <button
                onClick={confirmOffChainExecution}
                className={styles.ctaGhost}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span>🛡️ Off-Chain Escrow Vault</span>
                <span
                  style={{
                    fontSize: "0.65rem",
                    textTransform: "uppercase",
                    color: "#64748b",
                  }}
                >
                  Managed
                </span>
              </button>

              <button
                onClick={() => setOrderToExecute(null)}
                style={{
                  background: "transparent",
                  color: "#64748b",
                  fontWeight: 600,
                  padding: "8px",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "0.825rem",
                  marginTop: "4px",
                }}
              >
                Cancel / Return
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Shared Secure Enclave Iframe Overlay */}
      {signUrl && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 99999,
            backgroundColor: "rgba(15, 23, 42, 0.75)",
            backdropFilter: "blur(6px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: "460px",
              height: "640px",
              backgroundColor: "#ffffff",
              borderRadius: "24px",
              border: "1px solid #e2e8f0",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              position: "relative",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "16px 20px",
                borderBottom: "1px solid #f1f5f9",
                backgroundColor: "#f8fafc",
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <span
                  style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    backgroundColor: "#10b981",
                    boxShadow: "0 0 8px rgba(16, 185, 129, 0.5)",
                  }}
                />
                <span
                  style={{
                    color: "#0f172a",
                    fontSize: "11px",
                    fontWeight: "800",
                    letterSpacing: "0.5px",
                    textTransform: "uppercase",
                  }}
                >
                  Secure Enclave Signer
                </span>
              </div>
              <button
                onClick={() => setSignUrl(null)}
                style={{
                  background: "#ffffff",
                  border: "1px solid #cbd5e1",
                  color: "#475569",
                  padding: "5px 10px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  fontSize: "12px",
                  fontWeight: "700",
                }}
              >
                <X size={14} /> Close
              </button>
            </div>

            <iframe
              src={signUrl}
              style={{
                flex: 1,
                border: "none",
                width: "100%",
                height: "100%",
                backgroundColor: "#ffffff",
              }}
              title="Secondary Market Signer"
            />
          </div>
        </div>
      )}

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
