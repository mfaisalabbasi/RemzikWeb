"use client";
import { useState } from "react";
import styles from "./partner.module.css";

export const PartnerGovernance = ({ partner, onAction }: any) => {
  const [isUpdating, setIsUpdating] = useState(false);

  // Data mapping from the separate table via the User->Kyc relation
  const kyc = partner?.user?.kyc;
  const user = partner?.user;

  const handleStatusUpdate = async (
    type: "partner" | "kyc" | "account",
    newStatus: string,
  ) => {
    // If account toggle, we use partner.id for the toggle-freeze endpoint
    const targetId = type === "kyc" ? kyc?.id : partner.id;
    if (!targetId) return alert(`Error: ${type} record ID not found.`);

    let reason = "";
    // Handle Rejection Reason or Freeze Reason
    if (newStatus === "REJECTED" || newStatus === "FREEZE") {
      const promptText =
        newStatus === "FREEZE"
          ? "Please provide a reason for freezing this account:"
          : `Please provide a reason for rejecting this ${type}:`;

      reason = prompt(promptText) || "";
      if (!reason.trim()) return alert("A reason is required for this action.");
    }

    if (!confirm(`Confirm ${type} action: ${newStatus}?`)) return;

    setIsUpdating(true);

    // Endpoint mapping
    let endpoint = "";
    let method = "PATCH";

    if (type === "partner") {
      endpoint = `${process.env.NEXT_PUBLIC_API_URL}/admin/partners/${targetId}/status`;
    } else if (type === "kyc") {
      endpoint = `${process.env.NEXT_PUBLIC_API_URL}/admin/kyc/${targetId}/status`;
    } else if (type === "account") {
      endpoint = `${process.env.NEXT_PUBLIC_API_URL}/admin/partners/${targetId}/toggle-freeze`;
    }

    try {
      const res = await fetch(endpoint, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: newStatus,
          reason: reason,
        }),
        credentials: "include",
      });

      if (res.ok) {
        alert(`✅ ${type.toUpperCase()} action successful: ${newStatus}`);
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

      {/* 3. ACCOUNT SECURITY & FREEZE CARD */}
      <div
        className={styles.govCard}
        style={{ borderTop: "4px solid #0f172a" }}
      >
        <div className={styles.govHeader}>
          <div className={styles.govTitle}>
            <h4>Account Security</h4>
            <p>Global access control for this user</p>
          </div>
          <span
            className={`${styles.statusBadge} ${user?.isActive ? styles.approved : styles.rejected}`}
          >
            {user?.isActive ? "ACTIVE" : "FROZEN"}
          </span>
        </div>

        <div className={styles.docList}>
          <div className={styles.docRow}>
            <span className="text-xs text-slate-500">
              Verification Status:{" "}
              <strong>{user?.isVerified ? "VERIFIED" : "UNVERIFIED"}</strong>
            </span>
          </div>
        </div>

        <div className={styles.adminActions}>
          <button
            className={user?.isActive ? styles.rejectBtn : styles.approveBtn}
            onClick={() =>
              handleStatusUpdate(
                "account",
                user?.isActive ? "FREEZE" : "ACTIVATE",
              )
            }
            disabled={isUpdating}
          >
            {user?.isActive ? "Freeze Account" : "Unfreeze Account"}
          </button>
        </div>
      </div>
    </div>
  );
};
