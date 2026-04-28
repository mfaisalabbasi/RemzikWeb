"use client";
import React, { useEffect, useState } from "react";
import styles from "./assets.module.css";
import { Tag, ArrowLeftRight, History, ShoppingCart } from "lucide-react";

export const SecondaryMarketDashboard = ({ assetId }: { assetId: string }) => {
  const [listings, setListings] = useState<any[]>([]);
  const [trades, setTrades] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        // Fetch from both sub-modules
        const [listRes, tradeRes] = await Promise.all([
          fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/secondary-market/listings/asset/${assetId}`,
            { credentials: "include" },
          ),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/secondary-market/trade`, {
            credentials: "include",
          }),
        ]);

        const listData = await listRes.json();
        const tradeData = await tradeRes.json();

        setListings(listData);
        // Filter trades specifically for this asset on the frontend since the endpoint is global
        setTrades(tradeData.filter((t: any) => t.asset?.id === assetId));
      } catch (err) {
        console.error("Secondary Market Sync Error:", err);
      } finally {
        setLoading(false);
      }
    };

    if (assetId) fetchMarketData();
  }, [assetId]);

  return (
    <div className={styles.secondaryContainer}>
      {/* 1. ACTIVE ORDER BOOK */}
      <div className={styles.card}>
        <div className={styles.cardHeaderInline}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Tag size={18} color="#8b5cf6" />
            <h3 className={styles.cardTitle}>Active Listings</h3>
          </div>
          <span className={styles.countBadge}>{listings.length} Open</span>
        </div>

        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Seller</th>
                <th>Units</th>
                <th>Price/Unit</th>
              </tr>
            </thead>
            <tbody>
              {listings.length > 0 ? (
                listings.map((list) => (
                  <tr key={list.id}>
                    <td className={styles.idCell}>
                      ID: {list.sellerId.slice(0, 5)}
                    </td>
                    <td className={styles.boldCell}>
                      {Number(list.unitsForSale).toLocaleString()}
                    </td>
                    <td className={styles.priceCell}>
                      {Number(list.pricePerUnit).toLocaleString()} SAR
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className={styles.emptyRow}>
                    No active sell orders
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 2. RECENT TRADES */}
      <div className={styles.card}>
        <div className={styles.cardHeaderInline}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <History size={18} color="#0ea5e9" />
            <h3 className={styles.cardTitle}>Recent Trades</h3>
          </div>
        </div>

        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Units</th>
                <th>Total Value</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {trades.length > 0 ? (
                trades.map((trade) => (
                  <tr key={trade.id}>
                    <td>{trade.units}</td>
                    <td className={styles.boldCell}>
                      {Number(trade.totalPrice).toLocaleString()} SAR
                    </td>
                    <td className={styles.timeCell}>
                      {new Date(
                        trade.executedAt || trade.createdAt,
                      ).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className={styles.emptyRow}>
                    No trades executed yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
