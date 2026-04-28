"use client";
import styles from "./assets.module.css";

export const ActionBar = ({ onSearch, onFilter }: any) => (
  <div className={styles.actionBar}>
    <input
      type="text"
      placeholder="Search by ID, Name or Partner..."
      className={styles.searchBar}
      onChange={(e) => onSearch(e.target.value)}
    />

    <select
      className={styles.filterSelect}
      onChange={(e) => onFilter(e.target.value)}
    >
      <option value="All">All Statuses</option>
      <option value="APPROVED">Approved</option>
      <option value="PENDING">Pending</option>
      <option value="LIVE">Live</option>
    </select>
  </div>
);
