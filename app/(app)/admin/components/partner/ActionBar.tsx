import styles from "./partner.module.css";

export const ActionBar = ({
  search,
  setSearch,
  statusFilter,
  setStatusFilter,
}: any) => (
  <div className={styles.actionBar}>
    <input
      type="text"
      placeholder="Search by ID or Partner..."
      className={styles.searchBar}
      value={search}
      onChange={(e) => setSearch(e.target.value)}
    />
    <select
      className={styles.filterSelect}
      value={statusFilter}
      onChange={(e) => setStatusFilter(e.target.value)}
    >
      <option value="All Statuses">All Statuses</option>
      <option value="APPROVED">Approved</option>
      <option value="PENDING">Pending</option>
    </select>
  </div>
);
