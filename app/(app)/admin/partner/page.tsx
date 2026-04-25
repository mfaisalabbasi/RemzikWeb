"use client";

import styles from "../components/partner/partner.module.css";
import { PartnerGrid } from "../components/partner/PartnerGrid";
import { ActionBar } from "../components/partner/ActionBar";
import { usePartners } from "@/app/integrations/hooks/usePartners";

export default function PartnersDirectory() {
  const {
    partners,
    loading,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
  } = usePartners();

  return (
    <main className={styles.partnerPage}>
      <h1 style={{ fontSize: "1.5rem", marginBottom: "2rem" }}>
        Partner Directory
      </h1>
      <div className={styles.card}>
        <h3 style={{ marginBottom: "1.5rem" }}>Active Partners</h3>
        <ActionBar
          search={search}
          setSearch={setSearch}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
        />
        <PartnerGrid partners={partners} loading={loading} />
      </div>
    </main>
  );
}
