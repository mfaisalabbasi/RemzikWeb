"use client";

import { useState } from "react";
import styles from "./Asset.module.css";

export default function AssetFilters() {
  const [type, setType] = useState("All Asset Types");
  const [roi, setRoi] = useState("Any ROI");
  const [tenure, setTenure] = useState("Any Tenure");

  return (
    <div className={styles.filters}>
      <select value={type} onChange={(e) => setType(e.target.value)}>
        <option>All Asset Types</option>
        <option>Real Estate</option>
        <option>Trade Finance</option>
      </select>

      <select value={roi} onChange={(e) => setRoi(e.target.value)}>
        <option>Any ROI</option>
        <option>10%+</option>
        <option>15%+</option>
      </select>

      <select value={tenure} onChange={(e) => setTenure(e.target.value)}>
        <option>Any Tenure</option>
        <option>6 Months</option>
        <option>12 Months</option>
      </select>
    </div>
  );
}
