import styles from "@/app/styles/About.module.css";

export default function AboutRemzik() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.title}>About Remzik</h2>

        <div className={styles.layout}>
          {/* Main description */}
          <div className={styles.mainText}>
            <p>
              Remzik is an asset-backed investment platform designed to enable
              ethical participation in real-world assets through
              Shariah-compliant structures.
            </p>

            <p>
              The platform emphasizes transparency, governance, and long-term
              value creation — avoiding speculative models and interest-based
              financial practices.
            </p>
          </div>

          {/* Key facts */}
          <div className={styles.side}>
            <div className={styles.fact}>
              <div className={styles.factTitle}>Focus</div>
              <div className={styles.factText}>
                Real-world income-generating assets
              </div>
            </div>

            <div className={styles.fact}>
              <div className={styles.factTitle}>Structure</div>
              <div className={styles.factText}>
                Asset-backed ownership models
              </div>
            </div>

            <div className={styles.fact}>
              <div className={styles.factTitle}>Principle</div>
              <div className={styles.factText}>Shariah-first by design</div>
            </div>

            <div className={styles.fact}>
              <div className={styles.factTitle}>Objective</div>
              <div className={styles.factText}>
                Sustainable, long-term value
              </div>
            </div>
          </div>
        </div>

        {/* Closing statement */}
        <div className={styles.statement}>
          <p className={styles.statementText}>
            Remzik is being built as long-term financial infrastructure with
            systems designed to scale responsibly under ethical governance.
          </p>
        </div>
      </div>
    </section>
  );
}
