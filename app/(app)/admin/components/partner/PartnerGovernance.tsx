"use client";
import { useState } from "react";
import styles from "./partner.module.css";

export const PartnerGovernance = ({ partner, onAction }: any) => {
  const [isUpdating, setIsUpdating] = useState(false);

  // Data mapping from the separate table via the User->Kyc relation
  const kyc = partner?.user?.kyc;

  const handleStatusUpdate = async (
    type: "partner" | "kyc",
    newStatus: string,
  ) => {
    const targetId = type === "partner" ? partner.id : kyc?.id;
    if (!targetId) return alert(`Error: ${type} record ID not found.`);

    // Handle Rejection Reason (Required by your AdminService logic)
    let reason = "";
    if (newStatus === "REJECTED") {
      reason =
        prompt(`Please provide a reason for rejecting this ${type}:`) || "";
      if (!reason.trim()) return alert("Rejection reason is required.");
    }

    if (!confirm(`Confirm ${type} status update to: ${newStatus}?`)) return;

    setIsUpdating(true);

    // Endpoints match your AdminController routes
    const endpoint =
      type === "partner"
        ? `${process.env.NEXT_PUBLIC_API_URL}/admin/partners/${targetId}/status`
        : `${process.env.NEXT_PUBLIC_API_URL}/admin/kyc/${targetId}/status`;

    try {
      const res = await fetch(endpoint, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: newStatus,
          reason: reason, // Passed to handleKycAction/handlePartnerAction
        }),
        credentials: "include",
      });

      if (res.ok) {
        alert(`✅ ${type.toUpperCase()} successfully ${newStatus}`);
        onAction();
      } else {
        const error = await res.json();
        alert(`❌ Error: ${error.message || "Update failed"}`);
      }
    } catch (err) {
      alert("❌ Network Error: Could not reach the server.");
    } finally {
      setIsUpdating(false);
    }
  };

  const DocRow = ({ label, url }: { label: string; url?: string }) => {
    const hasFile = url && url.trim().length > 0;
    return (
      <div className={styles.docRow}>
        <div className={styles.docLabel}>
          <span
            className={styles.dot}
            style={{ background: hasFile ? "#10b981" : "#ef4444" }}
          />
          {label}
        </div>
        <button
          className={styles.docLink}
          onClick={() => hasFile && window.open(url, "_blank")}
          disabled={!hasFile}
        >
          {hasFile ? "View" : "Missing"}
        </button>
      </div>
    );
  };

  return (
    <div className={styles.governanceContainer}>
      {/* 1. INDIVIDUAL KYC CARD */}
      <div className={styles.govCard}>
        <div className={styles.govHeader}>
          <div className={styles.govTitle}>
            <h4>Representative KYC</h4>
            <p>Verification of the individual person</p>
          </div>
          <span
            className={`${styles.statusBadge} ${styles[kyc?.status?.toLowerCase() || "pending"]}`}
          >
            {kyc?.status || "NOT SUBMITTED"}
          </span>
        </div>

        <div className={styles.docList}>
          {/* Using column names from your KycProfile entity */}
          <DocRow label="National ID / Passport" url={kyc?.idDocumentUrl} />
          <DocRow label="Proof of Address" url={kyc?.addressProofUrl} />
        </div>

        <div className={styles.adminActions}>
          <button
            className={styles.rejectBtn}
            onClick={() => handleStatusUpdate("kyc", "REJECTED")}
            disabled={isUpdating || !kyc || kyc.status === "REJECTED"}
          >
            Reject
          </button>
          <button
            className={styles.approveBtn}
            onClick={() => handleStatusUpdate("kyc", "APPROVED")}
            disabled={isUpdating || !kyc || kyc.status === "APPROVED"}
          >
            Approve
          </button>
        </div>
      </div>

      {/* 2. CORPORATE KYB CARD */}
      <div className={styles.govCard}>
        <div className={styles.govHeader}>
          <div className={styles.govTitle}>
            <h4>Business Entity (KYB)</h4>
            <p>Verification of the legal company</p>
          </div>
          <span
            className={`${styles.statusBadge} ${styles[partner.status?.toLowerCase()]}`}
          >
            {partner.status}
          </span>
        </div>

        <div className={styles.docList}>
          <DocRow
            label="Commercial Registration"
            url={partner.commercialRegistration}
          />
          <DocRow label="VAT/Tax Certificate" url={partner.amlPolicy} />
          <DocRow
            label="Articles of Association"
            url={partner.articlesOfAssociation}
          />
        </div>

        <div className={styles.adminActions}>
          <button
            className={styles.rejectBtn}
            onClick={() => handleStatusUpdate("partner", "REJECTED")}
            disabled={isUpdating || partner.status === "REJECTED"}
          >
            Reject
          </button>
          <button
            className={styles.approveBtn}
            onClick={() => handleStatusUpdate("partner", "APPROVED")}
            disabled={isUpdating || partner.status === "APPROVED"}
          >
            Approve
          </button>
        </div>
      </div>
    </div>
  );
};
