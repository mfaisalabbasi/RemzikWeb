import styles from "@/app/styles/ShariahCard.module.css";

interface ShariahCardProps {
  title: string;
  desc: string;
}

export default function ShariahCard({ title, desc }: ShariahCardProps) {
  return (
    <div className={styles.card}>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.desc}>{desc}</p>
    </div>
  );
}
