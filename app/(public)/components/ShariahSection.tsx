import ShariahCard from "./ShariahCard";
import styles from "@/app/(public)/styles/ShariahSection.module.css";

export default function ShariahSection() {
  const principles = [
    {
      title: "No Interest (Riba)",
      desc: "Returns are derived solely from asset performance.",
    },
    {
      title: "Real Asset Ownership",
      desc: "Each investment represents ownership in tangible assets.",
    },
    {
      title: "Contractual Clarity",
      desc: "Clear structures and transparent disclosures.",
    },
    {
      title: "Prohibited Activity Screening",
      desc: "Assets are screened against non-permissible activities.",
    },
  ];

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.title}>Shariah Governance & Compliance</h2>
        <p className={styles.subtitle}>
          Remzik operates under a strict Shariah governance framework to ensure
          every asset represents genuine, permissible ownership.
        </p>

        <div className={styles.grid}>
          {principles.map((item, index) => (
            <ShariahCard key={index} title={item.title} desc={item.desc} />
          ))}
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
