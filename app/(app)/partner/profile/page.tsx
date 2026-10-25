"use client";

import { useEffect, useState } from "react";
import styles from "./styles/Profile.module.css";
import ProfileForm from "./ProfileForm";
import ProfileStats from "./ProfileStats";
import ProfileAvatar from "./ProfileAvatar";
import { getProfile, getProfileStats } from "@/app/integrations/api/profile";
import { UserCheck } from "lucide-react";

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

  if (loading) {
    return (
      <div className={styles.loadingState}>
        <div className={styles.loaderSpinner}></div>
        <span>Synchronizing Corporate Profile...</span>
      </div>
    );
  }

  if (!profile) return <p className={styles.error}>Profile not found</p>;

  return (
    <div className={styles.wrapper}>
      <div className={styles.headerBlock}>
        <div>
          <div className={styles.breadcrumb}>
            Remzik Protocol / Partner Portal
          </div>
          <h2 className={styles.pageTitle}>
            Profile & <span style={{ color: "#059669" }}>Telemetry</span>
          </h2>
          <p className={styles.pageSubtitle}>
            Manage corporate identity, avatar asset records, and operational
            statistics.
          </p>
        </div>
      </div>

      <div className={styles.profileLayoutGrid}>
        <div className={styles.profileLeftCol}>
          <ProfileAvatar avatar={profile.avatar} setProfile={setProfile} />
          {stats && <ProfileStats stats={stats} />}
        </div>
        <div className={styles.profileRightCol}>
          <ProfileForm profile={profile} />
        </div>
      </div>
    </div>
  );
}
