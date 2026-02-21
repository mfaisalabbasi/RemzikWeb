// secondary-market/OrderBookTable.tsx
"use client";

import React from "react";
import { Order } from "./types";
import styles from "./secondary.module.css";

interface Props {
  orders: Order[];
}

export default function OrderBookTable({ orders }: Props) {
  return (
    <table className={styles.orderBookTable}>
      <thead>
        <tr>
          <th>Type</th>
          <th>Quantity</th>
          <th>Price (SAR)</th>
        </tr>
      </thead>
      <tbody>
        {orders.map((o) => (
          <tr key={o.id}>
            <td className={o.type === "buy" ? styles.buy : styles.sell}>
              {o.type.toUpperCase()}
            </td>
            <td>{o.quantity}</td>
            <td>{o.price.toLocaleString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
