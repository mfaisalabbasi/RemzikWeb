"use client";

import { useEffect, useState } from "react";
import styles from "../components/profile/./Profile.module.css";

import { Investment, RiskLevel, KycStatus } from "../components/profile/types";
import InvestmentCard from "../components/profile/InvestmentCard";
import Sidebar from "../components/profile/./Sidebar";
import EditProfileModal from "../components/profile/./EditProfileModal";
import ProfileHero from "../components/profile/ProfileHero";
// Import your Recovery Center component here:
import RecoveryCenter from "../components/profile/RecoveryCenter";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "security">(
    "overview",
  );

  // ✅ FETCH FROM BACKEND
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
      } catch (err) {
        console.error("Profile load failed", err);
      }
    };

    load();
  }, []);

  // ✅ SAVE TO BACKEND
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

  if (!user) return <div>Loading...</div>;

  return (
    <div className={styles.profilePage}>
      <div className={styles.leftColumn}>
        <ProfileHero {...user} onEdit={() => setEditOpen(true)} />

        {/* Tab Navigation for Profile vs Security/Recovery */}
        <div
          style={{
            display: "flex",
            gap: "16px",
            marginTop: "24px",
            borderBottom: "1px solid #1f2937",
            paddingBottom: "12px",
          }}
        >
          <button
            onClick={() => setActiveTab("overview")}
            style={{
              background: "transparent",
              border: "none",
              color: activeTab === "overview" ? "#10b981" : "#9ca3af",
              fontWeight: 600,
              cursor: "pointer",
              fontSize: "16px",
            }}
          >
            Overview & Investments
          </button>
          <button
            onClick={() => setActiveTab("security")}
            style={{
              background: "transparent",
              border: "none",
              color: activeTab === "security" ? "#10b981" : "#9ca3af",
              fontWeight: 600,
              cursor: "pointer",
              fontSize: "16px",
            }}
          >
            Security & Recovery Center
          </button>
        </div>

        {/* Conditional Tab Rendering */}
        {activeTab === "overview" ? (
          <div
            className={styles.investmentsSection}
            style={{ marginTop: "24px" }}
          >
            <h2>Investments</h2>
            <div className={styles.investmentsList}>
              {user.investments.map((inv: Investment) => (
                <InvestmentCard key={inv.id} investment={inv} />
              ))}
            </div>
          </div>
        ) : (
          <div style={{ marginTop: "24px" }}>
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
