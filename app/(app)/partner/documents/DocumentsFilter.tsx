"use client";

import styles from "./styles/DocumentsFilter.module.css";

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
      <input
        type="text"
        placeholder="Search documents..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        className={styles.searchInput}
      />
      <select
        value={typeFilter}
        onChange={(e) => onTypeChange(e.target.value)}
        className={styles.typeSelect}
      >
        <option value="">All Types</option>
        <option value="Agreement">Agreement</option>
        <option value="Report">Report</option>
        <option value="Certificate">Certificate</option>
      </select>
    </div>
  );
}
