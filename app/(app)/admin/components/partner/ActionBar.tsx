import styles from "./partner.module.css";

export const ActionBar = () => (
  <div className={styles.actionBar}>
    {/* Search Input */}
    <input
      type="text"
      placeholder="Search by ID or Partner..."
      className={styles.searchBar}
    />

    {/* Filter Dropdowns */}
    <select className={styles.filterSelect}>
      <option>All Statuses</option>
      <option>Verified</option>
      <option>Pending</option>
    </select>

    <select className={styles.filterSelect}>
      <option>Asset Type</option>
      <option>Real Estate</option>
      <option>Commodities</option>
    </select>
  </div>
);
