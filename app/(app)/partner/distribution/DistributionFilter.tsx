"use client";

import styles from "./styles/DistributionFilter.module.css";

interface Props {
  search: string;
  onSearchChange: (value: string) => void;
  stageFilter: string;
  onStageChange: (value: string) => void;
}

export default function DistributionFilter({
  search,
  onSearchChange,
  stageFilter,
  onStageChange,
}: Props) {
  return (
    <div className={styles.filterWrapper}>
      <input
        type="text"
        placeholder="Search assets..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        className={styles.searchInput}
      />
      <select
        value={stageFilter}
        onChange={(e) => onStageChange(e.target.value)}
        className={styles.stageSelect}
      >
        <option value="">All Stages</option>
        <option value="Funding">Funding</option>
        <option value="Approved">Approved</option>
        <option value="Completed">Completed</option>
      </select>
    </div>
  );
}
