import styles from "@/app/investor/styles/RecentActivity.module.css";
export default function RecentActivity() {
  return (
    <section className={styles.section}>
      <h2>Recent Activity</h2>

      <ul className={styles.list}>
        <li>Invested SAR 10,000 in Riyadh Real Estate</li>
        <li>Profit credited SAR 1,200</li>
        <li>Withdrawal requested SAR 5,000</li>
      </ul>
    </section>
  );
}
