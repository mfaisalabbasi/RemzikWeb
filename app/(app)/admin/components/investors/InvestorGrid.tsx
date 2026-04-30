// src/app/(admin)/investors/components/InvestorGrid.tsx
"use client";

import Link from "next/link";
import styles from "./Investor.module.css";
import { ActionBar } from "./ActionBar";
import { useState } from "react";

interface Investor {
  id: string;
  name: string;
  status: string;
  totalAum: number;
}

interface InvestorGridProps {
  initialData?: Investor[]; // Optional to prevent crash if not provided
}

export const InvestorGrid = ({ initialData = [] }: InvestorGridProps) => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // Safeguard: use a fallback array to prevent .filter() on undefined
  const filtered = (initialData || []).filter((inv) => {
    const matchesSearch =
      inv.name.toLowerCase().includes(search.toLowerCase()) ||
      inv.id.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === "All" || inv.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className={styles.card}>
      <ActionBar onSearch={setSearch} onStatusChange={setStatusFilter} />

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Investor</th>
            <th>Status</th>
            <th>Investments</th>
          </tr>
        </thead>
        <tbody>
          {filtered.length === 0 ? (
            <tr>
              <td
                colSpan={3}
                style={{
                  textAlign: "center",
                  padding: "2rem",
                  color: "#64748b",
                }}
              >
                No investors found matching criteria.
              </td>
            </tr>
          ) : (
            filtered.map((inv) => (
              <tr key={inv.id}>
                <td>
                  <Link
                    href={`/admin/investors/${inv.id}`}
                    style={{
                      color: "#2563eb",
                      textDecoration: "none",
                      fontWeight: 600,
                    }}
                  >
                    {inv.name}
                  </Link>
                </td>
                <td>
                  <span
                    className={
                      inv.status === "Approved"
                        ? styles.pillApproved
                        : styles.pillPending
                    }
                  >
                    {inv.status}
                  </span>
                </td>
                <td>{inv.totalAum.toLocaleString()} SAR</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};
