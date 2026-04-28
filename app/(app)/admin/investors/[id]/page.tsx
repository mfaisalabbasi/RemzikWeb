"use client";

import { useEffect, useState, use } from "react";
import styles from "../../components/investors/Investor.module.css"; // Ensure this path is correct
import { InvestorProfileSummary } from "../../components/investors/InvestorProfileSummary";
import { InvestorDocuments } from "../../components/investors/InvestorDocuments";
import { InvestorLedger } from "../../components/investors/InvestorLedger";
import { InvestorGovernance } from "../../components/investors/InvestorGovernance";
import { InvestorDirectMessage } from "../../components/investors/InvestorDirectMessage";

export default function InvestorDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const investorId = resolvedParams.id;

  const [investor, setInvestor] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/admin/investors/${investorId}`,
          {
            credentials: "include",
          },
        );
        const data = await response.json();
        setInvestor(data);
      } catch (error) {
        console.error("Error fetching investor details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (investorId) fetchDetails();
  }, [investorId]);

  if (loading)
    return (
      <div
        style={{
          padding: "4rem",
          textAlign: "center",
          color: "#64748b",
          fontSize: "0.9rem",
          fontWeight: 500,
        }}
      >
        <div className="animate-pulse">Loading Investor Profile...</div>
      </div>
    );

  if (!investor)
    return (
      <div style={{ padding: "4rem", textAlign: "center", color: "#ef4444" }}>
        Investor Profile Not Found.
      </div>
    );

  return (
    <div
      className={styles.investorPage}
      style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem" }}
    >
      {/* Header Section */}
      <div className={styles.headerSection}>
        <div>
          <h1
            style={{
              fontSize: "2.25rem",
              fontWeight: 800,
              color: "#0f172a",
              margin: 0,
              letterSpacing: "-0.025em",
            }}
          >
            {investor.name}
          </h1>
          <p
            style={{ color: "#64748b", marginTop: "0.4rem", fontSize: "1rem" }}
          >
            ID:{" "}
            <span style={{ fontFamily: "monospace", color: "#94a3b8" }}>
              {investorId}
            </span>
          </p>
        </div>

        <div
          style={{
            padding: "0.5rem 1rem",
            borderRadius: "99px",
            background: investor.isActive ? "#f0fdf4" : "#fef2f2",
            color: investor.isActive ? "#166534" : "#991b1b",
            fontSize: "0.875rem",
            fontWeight: 600,
            border: `1px solid ${investor.isActive ? "#bbf7d0" : "#fecaca"}`,
          }}
        >
          {investor.isActive ? "● Account Active" : "● Account Frozen"}
        </div>
      </div>

      <InvestorProfileSummary data={investor} />

      {/* FIXED: Using gridContainer class instead of hardcoded inline style */}
      <div className={styles.gridContainer}>
        <div
          style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
        >
          <InvestorLedger ledger={investor.ledger} />
          <InvestorDocuments documents={investor.documents} />
        </div>

        <div
          style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
        >
          <InvestorGovernance
            id={investor.id}
            status={investor.status}
            isActive={investor.isActive}
          />
          <InvestorDirectMessage
            userId={investor.userId}
            name={investor.name}
          />
        </div>
      </div>
    </div>
  );
}
