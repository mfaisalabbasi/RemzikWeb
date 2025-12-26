import styles from "@/app/app/styles/KPICards.module.css";

export default function KPICards() {
  return (
    <div className={styles.grid}>
      <Card title="Total Invested" value="SAR 120,000" />
      <Card title="Active Investments" value="6" />
      <Card title="Expected Returns" value="SAR 18,400" />
      <Card title="Wallet Balance" value="SAR 12,500" />
    </div>
  );
}

function Card({ title, value }: { title: string; value: string }) {
  return (
    <div className={styles.card}>
      <span className={styles.title}>{title}</span>
      <strong className={styles.value}>{value}</strong>
    </div>
  );
}
