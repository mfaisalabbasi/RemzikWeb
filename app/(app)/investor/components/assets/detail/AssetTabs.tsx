"use client";

import React, { useState } from "react";
import styles from "./Details.module.css";
import { FiFileText, FiDownload } from "react-icons/fi";
import { InvestorGovernanceView } from "./InvestorGovernanceView";

interface DocumentData {
  title?: string;
  name?: string;
  type?: string;
  url: string;
}

interface AssetTabsProps {
  asset: any;
  overview: string;
  financials: string;
  shariah: string;
  documents: DocumentData[];
}

export default function AssetTabs({
  asset,
  overview,
  financials,
  shariah,
  documents,
}: AssetTabsProps) {
  const [activeTab, setActiveTab] = useState<string>("Overview");

  const tabs = ["Overview", "Financials", "Shariah", "Documents", "Governance"];

  const renderContent = () => {
    switch (activeTab) {
      case "Overview":
        return <div className={styles.tabContent}>{overview}</div>;
      case "Financials":
        return <div className={styles.tabContent}>{financials}</div>;
      case "Shariah":
        return <div className={styles.tabContent}>{shariah}</div>;
      case "Documents":
        return (
          <div className={styles.tabContent}>
            {documents?.length > 0 ? (
              <div className={styles.documentList}>
                {documents.map((doc, idx) => (
                  <div key={idx} className={styles.docItem}>
                    <div
                      className={styles.docInfo}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                      }}
                    >
                      <FiFileText size={20} style={{ color: "#059669" }} />
                      <div
                        className={styles.docMeta}
                        style={{ display: "flex", flexDirection: "column" }}
                      >
                        <span className={styles.docTitle}>
                          {doc.title || doc.name || "Untitled Document"}
                        </span>
                        <span style={{ fontSize: "12px", color: "#64748b" }}>
                          {doc.type || "PDF Document"}
                        </span>
                      </div>
                    </div>
                    <a
                      href={doc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.viewBtn}
                    >
                      <FiDownload size={14} />
                      View
                    </a>
                  </div>
                ))}
              </div>
            ) : (
              <div className={styles.emptyState}>
                <p
                  style={{
                    color: "#64748b",
                    textAlign: "center",
                    padding: "20px 0",
                  }}
                >
                  No official documents available for this asset yet.
                </p>
              </div>
            )}
          </div>
        );
      case "Governance":
        return (
          <div className={styles.tabContent}>
            <InvestorGovernanceView asset={asset} />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={styles.tabsContainer}>
      <nav className={styles.tabHeader} aria-label="Asset Details Navigation">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={
              activeTab === tab
                ? `${styles.tabBtn} ${styles.activeTab}`
                : styles.tabBtn
            }
            onClick={() => setActiveTab(tab)}
            aria-current={activeTab === tab ? "page" : undefined}
          >
            {tab}
          </button>
        ))}
      </nav>
      {renderContent()}
    </div>
  );
}
