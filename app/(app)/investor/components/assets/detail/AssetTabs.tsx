import React, { useState } from "react";
import styles from "./Details.module.css";

interface AssetTabsProps {
  overview: string;
  financials: string;
  shariah: string;
  documents: string[];
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
            <ul>
              {documents.map((doc, idx) => (
                <li key={idx}>
                  <a href={doc} target="_blank" rel="noreferrer">
                    {doc.split("/").pop()}
                  </a>
                </li>
              ))}
            </ul>
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
