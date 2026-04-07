"use client";

import React from "react";
import { Order } from "./types";
import styles from "./secondary.module.css";
import { ArrowRightLeft } from "lucide-react";

interface Props {
  orders: Order[];
  onBuyNow: (id: string) => void;
}

export default function OrderBookTable({ orders, onBuyNow }: Props) {
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
            orders.map((o) => (
              <tr key={o.id}>
                <td className={styles.assetCell}>{o.assetTitle}</td>
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
                  <button
                    className={styles.buyBtn}
                    onClick={() => onBuyNow(o.id)}
                  >
                    Execute
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
