import styles from "@/app/(app)/partner/styles/DashboardCard.module.css";

interface Props {
  title: string;
  value: string | number;
}

export default function DashboardCard({ title, value }: Props) {
  return (
    <div className={styles.card}>
      <p className={styles.title}>{title}</p>
      <p className={styles.value}>{value}</p>
    </div>
  );
}
