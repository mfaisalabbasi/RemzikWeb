"use client";

import { useEffect, useState, use } from "react";
import { InvestorProfileSummary } from "../../components/investors/InvestorProfileSummary";
import { InvestorDocuments } from "../../components/investors/InvestorDocuments";
import { InvestorLedger } from "../../components/investors/InvestorLedger";
import { InvestorGovernance } from "../../components/investors/InvestorGovernance";

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
      <div style={{ padding: "2rem", textAlign: "center" }}>
        Loading Investor Profile...
      </div>
    );
  if (!investor)
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        Investor not found.
      </div>
    );

  return (
    <div
      className="container py-8"
      style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem" }}
    >
      <div style={{ marginBottom: "2rem" }}>
        <h1
          style={{
            fontSize: "1.875rem",
            fontWeight: 700,
            color: "#0f172a",
            margin: 0,
          }}
        >
          {investor.name}
        </h1>
        <p style={{ color: "#64748b", marginTop: "0.25rem" }}>
          Investor Management & Audit Trail
        </p>
      </div>

      <InvestorProfileSummary data={investor} />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.6fr 1fr",
          gap: "1.5rem",
        }}
      >
        <div
          style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
        >
          <InvestorLedger ledger={investor.ledger} />
          <InvestorDocuments />
        </div>
        <div>
          <InvestorGovernance
            id={investorId}
            status={investor.status}
            isActive={investor.isActive}
          />
          {/* Future: Quick Broadcast Component */}
        </div>
      </div>
    </div>
  );
}
