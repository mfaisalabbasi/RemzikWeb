"use client";

import styles from "./styles/KPICard.module.css";

interface Props {
  title: string;
  value: string;
  icon?: React.ReactNode; // Optional icon for extra visual
}

export default function PartnerKPICard({ title, value, icon }: Props) {
  return (
    <div className={styles.card}>
      {icon && <div className={styles.icon}>{icon}</div>}
      <p className={styles.title}>{title}</p>
      <h3 className={styles.value}>{value}</h3>
    </div>
  );
}
