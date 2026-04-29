"use client";

import { useEffect, useState } from "react";
import styles from "../components/profile/profile.module.css";
import { AdminProfile } from "../components/profile/AdminProfile";
import { AdminActivityLog } from "../components/profile/AdminActivityLog";
import { SecuritySettings } from "../components/profile/SecuritySettings";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/me`, {
          credentials: "include",
        });
        const data = await res.json();
        setUser(data);
      } catch (err) {
        console.error("Identity sync failed", err);
      }
    };
    fetchMe();
  }, []);

  return (
    <main className={styles.profilePage}>
      <div className={styles.mainGrid}>
        <div className={styles.column}>
          <AdminProfile user={user} />
          <SecuritySettings user={user} />
        </div>
        <div className={styles.column}>
          <AdminActivityLog />
        </div>
      </div>
    </main>
  );
}
