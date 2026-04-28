"use client";
import React, { useEffect, useState } from "react";
import styles from "./assets.module.css";
import { Activity, ArrowUpRight, TrendingUp, Users } from "lucide-react";

interface MarketActivityLogProps {
  assetId: string;
}

export const MarketActivityLog = ({ assetId }: MarketActivityLogProps) => {
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMarketActivity = async () => {
      try {
        // This endpoint should aggregate Investments and Trades for this asset
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/admin/assets/${assetId}/activity`,
          {
            credentials: "include",
          },
        );
        const data = await res.json();
        setActivities(data);
      } catch (err) {
        console.error("Market Activity Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };

    if (assetId) fetchMarketActivity();
  }, [assetId]);

  return (
    <div className={styles.card} style={{ flex: 2 }}>
      <div className={styles.cardHeaderInline}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <Activity size={18} color="#0ea5e9" />
          <h3 className={styles.cardTitle}>Market Activity</h3>
        </div>
        <div className={styles.liveTag}>LIVE FEED</div>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Event Type</th>
              <th>Participant</th>
              <th>Value (SAR)</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={4}
                  style={{ textAlign: "center", padding: "1.5rem" }}
                >
                  Syncing Market Data...
                </td>
              </tr>
            ) : activities.length > 0 ? (
              activities.map((act, index) => (
                <tr key={index}>
                  <td>
                    <div className={styles.eventType}>
                      {act.type === "BUY" ? (
                        <ArrowUpRight size={14} color="#10b981" />
                      ) : (
                        <TrendingUp size={14} color="#3b82f6" />
                      )}
                      <span>
                        {act.type === "BUY"
                          ? "Primary Buy"
                          : "Valuation Update"}
                      </span>
                    </div>
                  </td>
                  <td className={styles.participantCell}>
                    <Users size={12} />{" "}
                    {act.participantName ||
                      `User #${act.participantId.slice(0, 4)}`}
                  </td>
                  <td className={styles.amountCell}>
                    {Number(act.amount).toLocaleString()}
                  </td>
                  <td className={styles.timeCell}>
                    {new Date(act.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={4}
                  style={{
                    textAlign: "center",
                    padding: "2rem",
                    color: "#94a3b8",
                  }}
                >
                  No market activity recorded yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
