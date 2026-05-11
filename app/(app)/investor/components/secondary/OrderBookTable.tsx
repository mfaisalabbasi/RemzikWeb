"use client";

import React from "react";
import { Order } from "./types";
import styles from "./secondary.module.css";
import { XCircle } from "lucide-react";

/**
 * Prop Interface with Type Intersection
 * This resolves the "Property 'sellerId' does not exist" error globally in this file.
 */
interface Props {
  orders: (Order & { sellerId: string })[];
  onBuyNow: (id: string) => void;
  onCancel: (id: string) => void;
  currentUserId: string | null;
}

export default function OrderBookTable({
  orders,
  onBuyNow,
  onCancel,
  currentUserId,
}: Props) {
  return (
    <div className={styles.tableContainer}>
      <table className={styles.orderTable}>
        <thead>
          <tr>
            <th>Asset</th>
            <th>Intent</th>
            <th>Volume</th>
            <th>Execution Price</th>
            <th style={{ textAlign: "right" }}>Trade</th>
          </tr>
        </thead>
        <tbody>
          {orders.length === 0 ? (
            <tr>
              <td
                colSpan={5}
                style={{
                  textAlign: "center",
                  padding: "4rem",
                  color: "#71717a",
                }}
              >
                Monitoring Market Liquidity... No active sell orders.
              </td>
            </tr>
          ) : (
            orders.map((o) => {
              const isMine = currentUserId === o.sellerId;

              return (
                <tr key={o.id} className={isMine ? styles.myOrderRow : ""}>
                  <td className={styles.assetCell}>
                    {o.assetTitle}
                    {isMine && (
                      <span className={styles.myBadge}>YOUR LISTING</span>
                    )}
                  </td>
                  <td>
                    <span className={styles.sellPill}>ASK</span>
                  </td>
                  <td style={{ fontFamily: "Roboto Mono" }}>
                    {o.quantity.toLocaleString()} <small>UNITS</small>
                  </td>
                  <td className={styles.priceText}>
                    {o.price.toLocaleString()} <small>SAR</small>
                  </td>
                  <td style={{ textAlign: "right" }}>
                    {isMine ? (
                      <button
                        className={styles.cancelBtn}
                        onClick={() => onCancel(o.id)}
                      >
                        <XCircle size={14} /> Cancel
                      </button>
                    ) : (
                      <button
                        className={styles.buyBtn}
                        onClick={() => onBuyNow(o.id)}
                      >
                        Execute
                      </button>
                    )}
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
