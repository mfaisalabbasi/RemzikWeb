"use client";
import { useState } from "react";
import styles from "./Asset.module.css";

export default function AssetTabs({
  overview,
  financials,
  shariah,
  documents,
}: {
  overview: string;
  financials: string;
  shariah: string;
  documents: string;
}) {
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
        {tab === "overview" && <p>{overview}</p>}
        {tab === "financials" && <p>{financials}</p>}
        {tab === "shariah" && <p>{shariah}</p>}
        {tab === "documents" && <p>{documents}</p>}
      </div>
    </section>
  );
}
