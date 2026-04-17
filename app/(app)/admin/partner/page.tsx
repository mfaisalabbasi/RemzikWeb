import styles from "../components/partner/partner.module.css";
import { PartnerGrid } from "../components/partner/PartnerGrid";
export default function PartnersDirectory() {
  return (
    <main className={styles.partnerPage}>
      <h1 style={{ fontSize: "1.5rem", marginBottom: "2rem" }}>
        Partner Directory
      </h1>
      <PartnerGrid />
    </main>
  );
}
