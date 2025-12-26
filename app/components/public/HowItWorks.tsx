import styles from "@/app/styles/HowItWorks.module.css";

const steps = [
  {
    number: "01",
    title: "Asset Sourcing",
    desc: "High-quality real-world assets are sourced and vetted by Remzik and its partners.",
  },
  {
    number: "02",
    title: "Shariah Structuring",
    desc: "Each asset is structured under approved Shariah principles with full documentation.",
  },
  {
    number: "03",
    title: "Tokenized Ownership",
    desc: "Assets are tokenized, enabling fractional ownership backed by real value.",
  },
  {
    number: "04",
    title: "Investor Returns",
    desc: "Investors earn halal returns with transparent reporting and asset-backed security.",
  },
];

export default function HowItWorks() {
  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h2>How Remzik Works</h2>
        <p>
          A transparent, Shariah-compliant journey from asset sourcing to
          investor returns.
        </p>
      </div>

      <div className={styles.timeline}>
        {steps.map((step, index) => (
          <div key={index} className={styles.step}>
            <div className={styles.badge}>{step.number}</div>
            <h3>{step.title}</h3>
            <p>{step.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
