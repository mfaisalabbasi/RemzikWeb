"use client";

import styles from "./styles/DocumentsFilter.module.css";
import { Search } from "lucide-react";

interface Props {
  search: string;
  onSearchChange: (value: string) => void;
  typeFilter: string;
  onTypeChange: (value: string) => void;
}

export default function DocumentsFilter({
  search,
  onSearchChange,
  typeFilter,
  onTypeChange,
}: Props) {
  return (
    <div className={styles.filterWrapper}>
      <div className={styles.searchWrapper}>
        <Search size={16} className={styles.searchIcon} />
        <input
          type="text"
          placeholder="Search documents by title..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className={styles.searchInput}
        />
      </div>

      <div className={styles.selectWrapper}>
        <select
          value={typeFilter}
          onChange={(e) => onTypeChange(e.target.value)}
          className={styles.typeSelect}
        >
          <option value="">All Document Categories</option>
          <option value="Agreement">Agreement</option>
          <option value="Report">Report</option>
          <option value="Certificate">Certificate</option>
        </select>
      </div>
    </div>
  );
}
