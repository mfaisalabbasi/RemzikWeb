"use client";

import React from "react";
import { usePartnerDetail } from "@/app/integrations/hooks/usePartnerDetail";
import styles from "../../components/partner/partner.module.css";
import { PartnerSummary } from "../../components/partner/PartnerSummary";
import { PartnerGovernance } from "../../components/partner/PartnerGovernance";
import { AssetOriginationLedger } from "../../components/partner/AssetOriginationLedger";
import { PartnerCommunication } from "../../components/partner/PartnerCommunication";

export default function PartnerDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = React.use(params);
  const { data, loading, refresh } = usePartnerDetail(id);

  if (loading)
    return <div className={styles.loader}>Initializing Secure Session...</div>;

  // Handle case where API might wrap the object in { partner: ... }
  const partnerData = data?.id ? data : data?.partner;

  if (!partnerData)
    return (
      <div className={styles.partnerPage}>
        <div className={styles.card}>Partner record not found.</div>
      </div>
    );

  return (
    <main className={styles.partnerPage}>
      <header className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Partner Portfolio Management</h1>
        <p className={styles.pageSubtitle}>ID: {id.toUpperCase()}</p>
      </header>

      <PartnerSummary partner={partnerData} />

      <div className={styles.gridContainer}>
        <PartnerGovernance partner={partnerData} onAction={refresh} />

        {/* PASSING THE CORRECT ID: 
          We need the user.id for the messaging socket room (user-UUID)
        */}
        <PartnerCommunication
          userId={partnerData.user?.id}
          companyName={partnerData.companyName}
        />
      </div>

      <section style={{ marginTop: "2rem" }}>
        <AssetOriginationLedger assets={partnerData.assets || []} />
      </section>
    </main>
  );
}
