import { LucideIcon } from "lucide-react";
import styles from "./Dashbaord.module.css";

interface StatCardProps {
  label: string;
  value: string;
  icon: LucideIcon;
}

export const StatCard = ({ label, value, icon: Icon }: StatCardProps) => (
  <div className={styles.statCard}>
    <div className={styles.iconBox}>
      <Icon size={20} />
    </div>
    <div>
      <p className={styles.statLabel}>{label}</p>
      <h3 className={styles.statValue}>{value}</h3>
    </div>
  </div>
);
