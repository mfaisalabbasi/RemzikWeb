import styles from "@/app/styles/ShariahSection.module.css";

export default function ShariahSection() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.title}>Shariah Governance & Compliance</h2>

        <p className={styles.subtitle}>
          Remzik operates under a strict Shariah governance framework to ensure
          every asset represents genuine, permissible ownership.
        </p>

        <div className={styles.grid}>
          <div className={styles.card}>
            <span>01</span>
            <h3>No Interest (Riba)</h3>
            <p>Returns are derived solely from asset performance.</p>
          </div>

          <div className={styles.card}>
            <span>02</span>
            <h3>Real Asset Ownership</h3>
            <p>Each investment represents ownership in tangible assets.</p>
          </div>

          <div className={styles.card}>
            <span>03</span>
            <h3>Contractual Clarity</h3>
            <p>Clear structures and transparent disclosures.</p>
          </div>

          <div className={styles.card}>
            <span>04</span>
            <h3>Prohibited Activity Screening</h3>
            <p>Assets are screened against non-permissible activities.</p>
          </div>
        </div>

        <div className={styles.footer}>
          <p className={styles.footerText}>
            Compliance is reviewed during onboarding and monitored throughout
            the asset lifecycle.
          </p>
        </div>
      </div>
    </section>
  );
}
