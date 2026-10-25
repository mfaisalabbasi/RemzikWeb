"use client";

import { useState, useEffect } from "react";
import { SlidersHorizontal, ChevronDown } from "lucide-react";
import styles from "./Asset.module.css";

interface FilterProps {
  onFilterChange: (filters: {
    type: string;
    roi: string;
    tenure: string;
  }) => void;
}

export default function AssetFilters({ onFilterChange }: FilterProps) {
  const [type, setType] = useState("All Asset Types");
  const [roi, setRoi] = useState("Any ROI");
  const [tenure, setTenure] = useState("Any Tenure");

  useEffect(() => {
    if (onFilterChange) {
      onFilterChange({ type, roi, tenure });
    }
  }, [type, roi, tenure, onFilterChange]);

  return (
    <div className={styles.filtersBar}>
      <div className={styles.filterTitle}>
        <SlidersHorizontal size={16} className={styles.filterIcon} />
        <span>Filter Vaults:</span>
      </div>

      <div className={styles.selectWrapper}>
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option>All Asset Types</option>
          <option value="Residential">Residential</option>
          <option value="Commercial">Commercial</option>
          <option value="Industrial">Industrial</option>
        </select>
        <ChevronDown size={14} className={styles.selectArrow} />
      </div>

      <div className={styles.selectWrapper}>
        <select value={roi} onChange={(e) => setRoi(e.target.value)}>
          <option value="Any ROI">Any ROI</option>
          <option value="10">10%+ Expected Yield</option>
          <option value="15">15%+ Expected Yield</option>
        </select>
        <ChevronDown size={14} className={styles.selectArrow} />
      </div>

      <div className={styles.selectWrapper}>
        <select value={tenure} onChange={(e) => setTenure(e.target.value)}>
          <option>Any Tenure</option>
          <option value="6">6 Months</option>
          <option value="12">12 Months</option>
        </select>
        <ChevronDown size={14} className={styles.selectArrow} />
      </div>
    </div>
  );
}
