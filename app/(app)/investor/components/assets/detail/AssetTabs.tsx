"use client";

import React, { useState } from "react";
import styles from "./Details.module.css";
import { FiFileText, FiDownload } from "react-icons/fi";

interface AssetTabsProps {
  overview: string;
  financials: string;
  shariah: string;
  documents: any[]; // Changed to any[] to handle object data
}

export default function AssetTabs({
  overview,
  financials,
  shariah,
  documents,
}: AssetTabsProps) {
  const tabs = ["Overview", "Financials", "Shariah", "Documents"];
  const [activeTab, setActiveTab] = useState("Overview");

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
            {documents && documents.length > 0 ? (
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
              <p className={styles.emptyMsg}>
                No official documents available for this asset yet.
              </p>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={styles.tabs}>
      <div className={styles.tabHeader}>
        {tabs.map((tab) => (
          <button
            key={tab}
            className={activeTab === tab ? styles.activeTab : styles.tabButton}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>
      <div className={styles.tabContent}>{renderContent()}</div>
    </div>
  );
}
