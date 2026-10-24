"use client";

import { useEffect, useState } from "react";
import styles from "../components/profile/./Profile.module.css";

import { Investment, RiskLevel, KycStatus } from "../components/profile/types";
import InvestmentCard from "../components/profile/InvestmentCard";
import Sidebar from "../components/profile/./Sidebar";
import EditProfileModal from "../components/profile/./EditProfileModal";
import ProfileHero from "../components/profile/ProfileHero";
import RecoveryCenter from "../components/profile/RecoveryCenter";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "security">(
    "overview",
  );

  // Temporary state for the preference selector before saving
  const [tempMode, setTempMode] = useState<"OFF_CHAIN" | "ON_CHAIN">(
    "OFF_CHAIN",
  );
  const [isSavingPref, setIsSavingPref] = useState(false);

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
        // Sync local temp state with fetched user preference
        if (data.distributionMode) {
          setTempMode(data.distributionMode);
        }
      } catch (err) {
        console.error("Profile load failed", err);
      }
    };

    load();
  }, []);

  // ✅ SAVE PROFILE INFO (Name, Email)
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

  // ✅ SAVE DISTRIBUTION MODE PREFERENCE (Off-Chain vs On-Chain) via explicit button click
  const handleDistributionModeChange = async (
    newMode: "OFF_CHAIN" | "ON_CHAIN",
  ) => {
    setIsSavingPref(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/investors/profile`,
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ distributionMode: newMode }),
        },
      );

      if (!res.ok) throw new Error();

      setUser((prev: any) => ({
        ...prev,
        distributionMode: newMode,
      }));

      alert("Yield distribution preference updated successfully!");
    } catch (err) {
      console.error("Failed to update distribution mode", err);
      alert("Failed to update preference. Please try again.");
    } finally {
      setIsSavingPref(false);
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
            {/* 👇 YIELD DISTRIBUTION PREFERENCE TOGGLE CARD WITH EXPLICIT SAVE BUTTON */}

            <h2 style={{ fontSize: "30px", color: "#03563c" }}>Investments</h2>
            <div
              className={styles.investmentsList}
              style={{ marginBottom: "32px" }}
            >
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
