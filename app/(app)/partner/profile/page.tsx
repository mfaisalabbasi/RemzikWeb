"use client";

import { useState } from "react";
import styles from "./styles/Profile.module.css";
import ProfileForm from "./ProfileForm";
import ProfileStats from "./ProfileStats";
import ProfileAvatar from "./ProfileAvatar";

const mockStats = {
  totalAssets: 8,
  totalInvestors: 240,
  totalFunding: 12_500_000,
};

export default function PartnerProfilePage() {
  const [avatar, setAvatar] = useState<string | null>(null);

  const handleAvatarChange = (url: string) => {
    setAvatar(url);
  };

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.pageTitle}>Partner Profile</h2>

      {/* Avatar */}
      <ProfileAvatar avatar={avatar} onChange={handleAvatarChange} />

      {/* KPI Stats */}
      <ProfileStats stats={mockStats} />

      {/* Profile Form */}
      <ProfileForm />
    </div>
  );
}
