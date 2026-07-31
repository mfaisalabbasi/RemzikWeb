"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./Dashbaord.module.css";

export function RecoveryApprovalQueue() {
  const [requests, setRequests] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetchPendingRecoveries();
  }, []);

  const fetchPendingRecoveries = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/recovery/admin/all`,
        {
          credentials: "include",
        },
      );
      if (res.ok) {
        const data = await res.json();
        setRequests(data);
      }
    } catch (err) {
      console.error("Failed to load admin recovery queues", err);
    }
  };

  const handleViewInvestor = (investorProfileId: string, userId: string) => {
    const targetId = investorProfileId || userId;

    if (!targetId) {
      alert("Associated investor ID not found on this request.");
      return;
    }

    router.push(`/admin/investors/${targetId}`);
  };

  return (
    <div className={styles.cardContainer}>
      <h3>Wallet Recovery Queue</h3>
      <p className={styles.subtext}>
        Review compliance packages and inspect profiles.
      </p>
      {requests.length === 0 ? (
        <p className={styles.emptyState}>No pending recovery requests.</p>
      ) : (
        <div className={styles.list}>
          {requests.map((req) => {
            const targetUserId =
              req.investorProfileId || req.userId || req.user?.id;
            return (
              <div key={req.id} className={styles.queueItem}>
                <div>
                  <strong>
                    {req.referenceNumber || `#REC-${req.id.slice(0, 8)}`}
                  </strong>
                  <span className={styles.badge}>{req.status}</span>
                  {req.user?.email && (
                    <p className={styles.userEmail}>{req.user.email}</p>
                  )}
                </div>
                <button
                  className={styles.actionBtn}
                  onClick={() =>
                    handleViewInvestor(req.investorProfileId, req.userId)
                  }
                >
                  View Profile & Files
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
