"use client";
import { useState } from "react";
import styles from "./partner.module.css";

export const PartnerGovernance = ({ partner, onAction }: any) => {
  const [isUpdating, setIsUpdating] = useState(false);

  // Map backend fields to the UI list safely
  const corporateDocs = [
    {
      name: "Articles of Association",
      status: partner?.articlesOfAssociation ? "VERIFIED" : "MISSING",
      url: partner?.articlesOfAssociation,
    },
    {
      name: "Commercial Registration (CR)",
      status: partner?.commercialRegistration ? "VERIFIED" : "MISSING",
      url: partner?.commercialRegistration,
    },
    {
      name: "Authorized Signatory ID",
      status: partner?.signatoryId ? "VERIFIED" : "MISSING",
      url: partner?.signatoryId,
    },
    {
      name: "AML/CTF Policy Disclosure",
      status: partner?.amlPolicy ? "VERIFIED" : "MISSING",
      url: partner?.amlPolicy,
    },
  ];

  const handleStatusUpdate = async () => {
    // 1. Logic fix: Backend expects APPROVED, not VERIFIED
    const isCurrentlyApproved = partner?.status === "APPROVED";
    const newStatus = isCurrentlyApproved ? "PENDING" : "APPROVED";

    if (!confirm(`Switch entity status to ${newStatus}?`)) return;

    setIsUpdating(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/partners/${partner.id}/status`,
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: newStatus }),
        },
      );

      if (response.ok) {
        alert(`✅ Status updated to ${newStatus} successfully.`);
        onAction(); // Refreshes the parent page data
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error("Server Response:", errorData);
        alert(`❌ Error: ${errorData.message || "Failed to update status."}`);
      }
    } catch (err) {
      console.error("Network Error:", err);
      alert("❌ Network Error: Could not reach the server.");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <h3 className={styles.cardTitle}>Entity KYC & Regulatory Standing</h3>
        {/* 2. Visual fix: Class name change based on APPROVED status */}
        <span
          className={
            partner?.status === "APPROVED"
              ? styles.statusDot
              : styles.statusDotPending
          }
        >
          {partner?.status || "UNKNOWN"}
        </span>
      </div>

      <div className={styles.docGrid}>
        {corporateDocs.map((doc, idx) => (
          <div key={idx} className={styles.docItem}>
            <div className={styles.docInfo}>
              <span className={styles.docName}>{doc.name}</span>
              <span className={styles.docDate}>Regulatory Requirement</span>
            </div>
            <div className={styles.docActions}>
              <span
                className={
                  doc.status === "VERIFIED"
                    ? styles.statusPill
                    : styles.statusPillPending
                }
              >
                {doc.status}
              </span>
              <button
                className={styles.iconBtn}
                onClick={() => doc.url && window.open(doc.url, "_blank")}
                disabled={!doc.url}
              >
                View
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.institutionalActions}>
        <button className={styles.btnSecondary}>Audit History</button>
        <button
          className={styles.btnPrimary}
          onClick={handleStatusUpdate}
          disabled={isUpdating}
        >
          {isUpdating ? "Updating..." : "Update Entity Status"}
        </button>
      </div>
    </div>
  );
};
