"use client";

import { useEffect, useState } from "react";
import styles from "../components/profile/Profile.module.css";

import { Investment } from "../components/profile/types";
import InvestmentCard from "../components/profile/InvestmentCard";
import Sidebar from "../components/profile/Sidebar";
import EditProfileModal from "../components/profile/EditProfileModal";
import ProfileHero from "../components/profile/ProfileHero";
import RecoveryCenter from "../components/profile/RecoveryCenter";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "security">(
    "overview",
  );

  const [tempMode, setTempMode] = useState<"OFF_CHAIN" | "ON_CHAIN">(
    "OFF_CHAIN",
  );
  const [isSavingPref, setIsSavingPref] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/investors/profile`,
          { credentials: "include" },
        );

        const data = await res.json();

        if (!res.ok) throw new Error();

        setUser(data);
        if (data.distributionMode) {
          setTempMode(data.distributionMode);
        }
      } catch (err) {
        console.error("Profile load failed", err);
      }
    };

    load();
  }, []);

  const handleSave = async (updated: { name: string; email: string }) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/investors/profile`,
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updated),
        },
      );

      if (!res.ok) throw new Error();

      setUser((prev: any) => ({
        ...prev,
        ...updated,
      }));
    } catch (err) {
      console.error("Update failed", err);
    }
  };

  if (!user) {
    return (
      <div
        style={{
          color: "#059669",
          padding: "6rem",
          textAlign: "center",
          fontWeight: 700,
        }}
      >
        Synchronizing Profile Ledger...
      </div>
    );
  }

  return (
    <div className={styles.profilePage}>
      <div className={styles.leftColumn}>
        <ProfileHero {...user} onEdit={() => setEditOpen(true)} />

        {/* Tab Navigation */}
        <div
          style={{
            display: "flex",
            gap: "20px",
            marginTop: "8px",
            borderBottom: "1px solid #e2e8f0",
            paddingBottom: "12px",
          }}
        >
          <button
            onClick={() => setActiveTab("overview")}
            style={{
              background: "transparent",
              border: "none",
              color: activeTab === "overview" ? "#059669" : "#64748b",
              fontWeight: 700,
              cursor: "pointer",
              fontSize: "0.875rem",
              textTransform: "uppercase",
              letterSpacing: "0.04em",
            }}
          >
            Overview & Investments
          </button>
          <button
            onClick={() => setActiveTab("security")}
            style={{
              background: "transparent",
              border: "none",
              color: activeTab === "security" ? "#059669" : "#64748b",
              fontWeight: 700,
              cursor: "pointer",
              fontSize: "0.875rem",
              textTransform: "uppercase",
              letterSpacing: "0.04em",
            }}
          >
            Security & Recovery Center
          </button>
        </div>

        {activeTab === "overview" ? (
          <div
            className={styles.investmentsSection}
            style={{ marginTop: "1rem" }}
          >
            <h2>Investments</h2>
            <div
              className={styles.investmentsList}
              style={{ marginBottom: "2rem" }}
            >
              {user.investments.map((inv: Investment) => (
                <InvestmentCard key={inv.id} investment={inv} />
              ))}
            </div>
          </div>
        ) : (
          <div style={{ marginTop: "1rem" }}>
            <RecoveryCenter />
          </div>
        )}
      </div>

      <Sidebar
        totalInvested={user.totalInvested}
        portfolioValue={user.portfolioValue}
        activeInvestments={user.activeInvestments}
        riskLevel={user.riskLevel}
        kycStatus={user.kycStatus}
        onEditProfile={() => setEditOpen(true)}
      />

      {editOpen && (
        <EditProfileModal
          name={user.name}
          email={user.email}
          onClose={() => setEditOpen(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
