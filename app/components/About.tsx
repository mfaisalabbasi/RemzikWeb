import styles from "@/app/styles/About.module.css";

export default function About() {
  return (
    <section className={styles.section}>
      <h2 className={styles.heading}>About Remzik</h2>
      <p className={styles.paragraph}>
        Remzik enables transparent, Shariah-compliant ownership of real-world
        assets. We start with real estate and aim to expand globally.
      </p>
      <p className={styles.paragraph}>
        Our vision is to become the most trusted platform for tokenized
        real-world assets, bridging traditional investments with modern digital
        finance.
      </p>
    </section>
  );
}
