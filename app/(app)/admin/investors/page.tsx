"use client";

import { useEffect, useState } from "react";
import styles from "../components/investors/Investor.module.css";
import { InvestorGrid } from "../components/investors/InvestorGrid";

// 1. Define the interface to match your Backend and Grid expectations
interface Investor {
  id: string;
  name: string;
  status: string;
  totalAum: number;
}

export default function InvestorsPage() {
  // 2. Explicitly type the state as Investor[] to avoid the 'never[]' error
  const [investors, setInvestors] = useState<Investor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvestors = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/admin/investors`,
          {
            credentials: "include",
          },
        );
        const data = await response.json();

        // 3. Ensure data is an array before setting state
        setInvestors(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to load investors:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInvestors();
  }, []);

  if (loading) {
    return (
      <div className="p-8 text-center" style={{ color: "#64748b" }}>
        Loading Remzik Investors...
      </div>
    );
  }

  return (
    <div className={styles.investorPage}>
      <h1
        style={{
          marginBottom: "1.5rem",
          fontWeight: 700,
          fontSize: "1.5rem",
          color: "#0f172a",
        }}
      >
        Investor Management
      </h1>
      {/* 4. Pass the fetched data to the Grid */}
      <InvestorGrid initialData={investors} />
    </div>
  );
}
