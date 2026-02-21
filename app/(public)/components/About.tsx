import styles from "@/app/(public)/styles/About.module.css";

interface Fact {
  title: string;
  text: string;
}

export default function AboutRemzik() {
  const facts: Fact[] = [
    { title: "Focus", text: "Real-world income-generating assets" },
    { title: "Structure", text: "Asset-backed ownership models" },
    { title: "Principle", text: "Shariah-first by design" },
    { title: "Objective", text: "Sustainable, long-term value" },
  ];

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
            {facts.map((fact, index) => (
              <div className={styles.fact} key={index}>
                <div className={styles.factTitle}>{fact.title}</div>
                <div className={styles.factText}>{fact.text}</div>
              </div>
            ))}
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
