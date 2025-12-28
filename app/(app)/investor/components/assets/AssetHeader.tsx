import styles from "@/app/(app)/investor/styles/AssetHeader.module.css";

export default function AssetHeader() {
  return (
    <section className={styles.header}>
      <div>
        <span className={styles.badge}>Shariah Compliant</span>
        <h1>Riyadh Commercial Property</h1>
        <p>Prime office space in central Riyadh</p>
      </div>

      <button className={styles.invest}>Invest Now</button>
    </section>
  );
}
