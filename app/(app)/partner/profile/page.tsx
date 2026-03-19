"use client";

import { useEffect, useState } from "react";
import styles from "./styles/Profile.module.css";
import ProfileForm from "./ProfileForm";
import ProfileStats from "./ProfileStats";
import ProfileAvatar from "./ProfileAvatar";
import { getProfile, getProfileStats } from "@/app/integrations/api/profile";

export default function PartnerProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      try {
        const [profileRes, statsRes] = await Promise.all([
          getProfile(),
          getProfileStats(),
        ]);

        if (mounted) {
          setProfile(profileRes);
          setStats(statsRes);
        }
      } catch (err) {
        console.error("Failed to fetch profile data:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchData();

    return () => {
      mounted = false;
    };
  }, []);

  if (loading) return <p className={styles.loading}>Loading...</p>;
  if (!profile) return <p className={styles.error}>Profile not found</p>;

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.pageTitle}>Partner Profile</h2>

      {/* Passing setProfile to allow child components to update state locally */}
      <ProfileAvatar avatar={profile.avatar} setProfile={setProfile} />

      {stats && <ProfileStats stats={stats} />}

      <ProfileForm profile={profile} />
    </div>
  );
}
