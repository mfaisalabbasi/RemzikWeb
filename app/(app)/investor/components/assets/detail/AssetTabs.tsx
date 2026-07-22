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

  // Force-include the Governance tab so it always displays regardless of missing/unpopulated props
  const tabs = ["Overview", "Financials", "Shariah", "Documents", "Governance"];

  const renderContent = () => {
    switch (activeTab) {
      case "Overview":
        return <div className={styles.tabBlock}>{overview}</div>;
      case "Financials":
        return <div className={styles.tabBlock}>{financials}</div>;
      case "Shariah":
        return <div className={styles.tabBlock}>{shariah}</div>;
      case "Documents":
        return (
          <div className={styles.tabBlock}>
            {documents?.length > 0 ? (
              <div className={styles.documentList}>
                {documents.map((doc, idx) => (
                  <div key={idx} className={styles.docItem}>
                    <div className={styles.docInfo}>
                      <FiFileText className={styles.docIcon} />
                      <div className={styles.docMeta}>
                        <span className={styles.docTitle}>
                          {doc.title || doc.name || "Untitled Document"}
                        </span>
                        <span className={styles.docType}>
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
                      <FiDownload size={16} />
                      View
                    </a>
                  </div>
                ))}
              </div>
            ) : (
              <div className={styles.emptyState}>
                <p className={styles.emptyMsg}>
                  No official documents available for this asset yet.
                </p>
              </div>
            )}
          </div>
        );
      case "Governance":
        return (
          <div className={styles.tabBlock}>
            <InvestorGovernanceView asset={asset} />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={styles.tabs}>
      <nav className={styles.tabHeader} aria-label="Asset Details Navigation">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={activeTab === tab ? styles.activeTab : styles.tabButton}
            onClick={() => setActiveTab(tab)}
            aria-current={activeTab === tab ? "page" : undefined}
          >
            {tab}
          </button>
        ))}
      </nav>
      <div className={styles.tabContent}>{renderContent()}</div>
    </div>
  );
}
