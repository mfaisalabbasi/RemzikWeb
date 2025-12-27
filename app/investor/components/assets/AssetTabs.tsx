"use client";
import { useState } from "react";
import AssetOverview from "./AssetOverview";
import AssetFinancial from "./AssetFinancial";
import AssetShariah from "./AssetShariah";
import AssetDocuments from "./AssetDocuments";
import styles from "@/app/investor/styles/AssetTabs.module.css";

export default function AssetTabs() {
  const [tab, setTab] = useState("overview");

  return (
    <section className={styles.section}>
      <div className={styles.tabs}>
        <button
          onClick={() => setTab("overview")}
          className={tab === "overview" ? styles.active : ""}
        >
          Overview
        </button>
        <button
          onClick={() => setTab("financials")}
          className={tab === "financials" ? styles.active : ""}
        >
          Financials
        </button>
        <button
          onClick={() => setTab("shariah")}
          className={tab === "shariah" ? styles.active : ""}
        >
          Shariah
        </button>
        <button
          onClick={() => setTab("documents")}
          className={tab === "documents" ? styles.active : ""}
        >
          Documents
        </button>
      </div>

      <div className={styles.content}>
        {tab === "overview" && <AssetOverview />}
        {tab === "financials" && <AssetFinancial />}
        {tab === "shariah" && <AssetShariah />}
        {tab === "documents" && <AssetDocuments />}
      </div>
    </section>
  );
}
