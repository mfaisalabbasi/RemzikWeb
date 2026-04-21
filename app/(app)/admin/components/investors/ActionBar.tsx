// src/app/(admin)/investors/components/ActionBar.tsx
"use client";

import styles from "./Investor.module.css";

interface ActionBarProps {
  onSearch: (value: string) => void;
  onStatusChange: (status: string) => void;
}

export const ActionBar = ({ onSearch, onStatusChange }: ActionBarProps) => (
  <div className={styles.actionBar}>
    {/* Search Input */}
    <input
      type="text"
      placeholder="Search by ID or Investor..."
      className={styles.searchBar}
      onChange={(e) => onSearch(e.target.value)}
    />

    {/* Filter Dropdowns */}
    <select
      className={styles.filterSelect}
      onChange={(e) => onStatusChange(e.target.value)}
    >
      <option value="All">All Statuses</option>
      <option value="Approved">Approved</option>
      <option value="Pending">Pending</option>
      <option value="Rejected">Rejected</option>
    </select>

    <select className={styles.filterSelect}>
      <option value="All">Asset Type</option>
      <option value="Real Estate">Real Estate</option>
      <option value="Commodities">Commodities</option>
    </select>
  </div>
);
