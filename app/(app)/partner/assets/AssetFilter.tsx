"use client";

import styles from "./styles/AssetFilter.module.css";
import { Search, Filter } from "lucide-react";

interface Props {
  search: string;
  onSearchChange: (value: string) => void;
  stageFilter: string;
  onStageChange: (value: string) => void;
}

export default function AssetsFilter({
  search,
  onSearchChange,
  stageFilter,
  onStageChange,
}: Props) {
  return (
    <div className={styles.filterWrapper}>
      {/* Search */}
      <div className={styles.searchWrapper}>
        <Search size={16} className={styles.searchIcon} />
        <input
          type="text"
          placeholder="Search assets by title or location..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className={styles.searchInput}
        />
      </div>

      {/* Stage Dropdown */}
      <div className={styles.selectWrapper}>
        <select
          value={stageFilter}
          onChange={(e) => onStageChange(e.target.value)}
          className={styles.stageSelect}
        >
          <option value="">All Lifecycle Stages</option>
          <option value="Funding">Funding Active</option>
          <option value="Approved">Approved</option>
          <option value="Completed">Completed</option>
        </select>
      </div>
    </div>
  );
}
