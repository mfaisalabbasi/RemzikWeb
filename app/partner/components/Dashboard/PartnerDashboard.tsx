import styles from "@/app/partner/styles/PartnerDashboard.module.css";
import DashboardCard from "./DashboardCard";

export default function PartnerDashboard() {
  return (
    <section className={styles.section}>
      <h1 className={styles.heading}>Partner Dashboard</h1>
      <div className={styles.cards}>
        <DashboardCard title="Total Assets" value="12" />
        <DashboardCard title="Pending Approvals" value="3" />
        <DashboardCard title="Total Investors" value="47" />
      </div>
    </section>
  );
}
