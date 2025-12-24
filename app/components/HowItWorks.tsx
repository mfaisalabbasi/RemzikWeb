import styles from "@/app/styles/HowItWorks.module.css";

const steps = [
  {
    title: "Asset Identification",
    desc: "We select high-quality assets for tokenization.",
  },
  {
    title: "Shariah Structuring",
    desc: "Structured to comply with Shariah guidelines.",
  },
  {
    title: "Tokenized Ownership",
    desc: "Investors gain digital ownership backed by real value.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className={styles.section}>
      <h2 className={styles.heading}>How It Works</h2>
      <div className={styles.cards}>
        {steps.map((step, idx) => (
          <div key={idx} className={styles.card}>
            <h3 className={styles.cardTitle}>{step.title}</h3>
            <p className={styles.cardDesc}>{step.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
