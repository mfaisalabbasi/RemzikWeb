"use client";

import { useState } from "react";
import styles from "../components/profile/./Profile.module.css";

import { Investment, RiskLevel, KycStatus } from "../components/profile/types";
import InvestmentCard from "../components/profile/InvestmentCard";
import Sidebar from "../components/profile/./Sidebar";
import EditProfileModal from "../components/profile/./EditProfileModal";
import ProfileHero from "../components/profile/ProfileHero";

/* ================================
   Mock User Data
================================ */
const MOCK_USER = {
  id: "u1",
  name: "Faisal Khan",
  email: "faisal@example.com",
  avatar: "/avatars/profile.jpg",
  totalInvested: 420_000,
  portfolioValue: 560_000,
  activeInvestments: 3,
  riskLevel: "Moderate" as RiskLevel,
  kycStatus: "Verified" as KycStatus,
  investments: [
    {
      id: "1",
      assetTitle: "Riyadh Commercial",
      amountInvested: 150_000,
      roi: 14,
      tenure: 12,
      status: "Active",
      image: "/slider/real-estate.jpg",
    },
    {
      id: "2",
      assetTitle: "Jeddah Tower",
      amountInvested: 200_000,
      roi: 12,
      tenure: 24,
      status: "Active",
      image: "/slider/residential.jpg",
    },
    {
      id: "3",
      assetTitle: "Makkah Hotel",
      amountInvested: 70_000,
      roi: 10,
      tenure: 36,
      status: "Completed",
      image: "/slider/hotel.jpg",
    },
  ] as Investment[],
};

/* ================================
   ProfilePage Component
================================ */
export default function ProfilePage() {
  const [user, setUser] = useState(MOCK_USER);
  const [editOpen, setEditOpen] = useState(false);

  const handleSave = (updated: { name: string; email: string }) => {
    setUser((prev) => ({ ...prev, ...updated }));
  };

  return (
    <div className={styles.profilePage}>
      {/* ------------------ LEFT COLUMN ------------------ */}
      <div className={styles.leftColumn}>
        <ProfileHero {...user} onEdit={() => setEditOpen(true)} />

        {/* Investments List */}
        <div className={styles.investmentsSection}>
          <h2>Investments</h2>
          <div className={styles.investmentsList}>
            {user.investments.map((inv) => (
              <InvestmentCard key={inv.id} investment={inv} />
            ))}
          </div>
        </div>
      </div>

      {/* ------------------ RIGHT COLUMN / SIDEBAR ------------------ */}
      <Sidebar
        totalInvested={user.totalInvested}
        portfolioValue={user.portfolioValue}
        activeInvestments={user.activeInvestments}
        riskLevel={user.riskLevel}
        kycStatus={user.kycStatus}
      />

      {/* ------------------ EDIT PROFILE MODAL ------------------ */}
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
