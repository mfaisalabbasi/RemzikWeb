"use client";
import React from "react";
import styles from "./assets.module.css";
import {
  FileSearch,
  Calendar,
  Award,
  ExternalLink,
  ShieldAlert,
} from "lucide-react";

interface AssetValuationProps {
  asset: any;
}

export const AssetValuation = ({ asset }: AssetValuationProps) => {
  // 1. Get real value from backend
  const totalValue = Number(asset.totalValue || 0);

  // 2. Extract the latest report (Assuming the last item in the array is the newest)
  const reportUrl =
    asset.financialDocuments && asset.financialDocuments.length > 0
      ? asset.financialDocuments[asset.financialDocuments.length - 1]
      : null;

  const handleViewReport = () => {
    if (reportUrl) {
      window.open(reportUrl, "_blank");
    } else {
      alert("No official valuation report found for this asset.");
    }
  };

  return (
    <div className={styles.card}>
      <h3 className={styles.cardTitle}>Appraisal Audit</h3>

      <div className={styles.valuationContent}>
        <div className={styles.valuationMain}>
          <div className={styles.labelSmall}>Current Fair Market Value</div>
          <div className={styles.valuationAmount}>
            {totalValue > 0
              ? `${totalValue.toLocaleString()} SAR`
              : "Valuation Pending"}
          </div>
        </div>

        <div className={styles.valuationSpecs}>
          <div className={styles.specRow}>
            <Calendar size={14} />
            <span>
              Last Audit:{" "}
              <strong>{new Date(asset.updatedAt).toLocaleDateString()}</strong>
            </span>
          </div>
          <div className={styles.specRow}>
            <Award size={14} />
            <span>
              Status:{" "}
              <strong>
                {asset.status === "APPROVED" ? "Verified" : "Under Review"}
              </strong>
            </span>
          </div>
          <div className={styles.specRow}>
            <FileSearch size={14} />
            <span>
              Reports:{" "}
              <strong>{asset.financialDocuments?.length || 0} File(s)</strong>
            </span>
          </div>
        </div>

        {reportUrl ? (
          <button
            className={styles.btnAppraisalView}
            onClick={handleViewReport}
          >
            View Taqeem Certificate <ExternalLink size={14} />
          </button>
        ) : (
          <div className={styles.noReportWarning}>
            <ShieldAlert size={14} />
            <span>Missing Official Certification</span>
          </div>
        )}
      </div>
    </div>
  );
};
