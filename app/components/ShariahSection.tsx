import ShariahCard from "./ShariahCard";
import styles from "@/app/styles/ShariahSection.module.css";

const shariahPoints = [
  {
    title: "Shariah Advisory Board",
    desc: "All assets are reviewed and approved by certified Shariah advisors.",
  },
  {
    title: "Transparent Structuring",
    desc: "Clear ownership and profit distribution fully compliant.",
  },
  {
    title: "Investor Protection",
    desc: "Strict governance and risk disclosure protect investors.",
  },
];

export default function ShariahSection() {
  return (
    <section className={styles.section}>
      <h2 className={styles.heading}>Shariah Compliance</h2>
      <div className={styles.grid}>
        {shariahPoints.map((point, idx) => (
          <ShariahCard key={idx} {...point} />
        ))}
      </div>
    </section>
  );
}
