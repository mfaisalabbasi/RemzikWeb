"use client";

import React, { useState } from "react";
import Link from "next/link";
import styles from "../styles/Auth.module.css";

type Role = "investor" | "partner" | null;

export default function ProfileCreationPage() {
  const [selectedRole, setSelectedRole] = useState<Role>(null);

  const handleSelect = (role: Role) => {
    setSelectedRole(role);
  };

  const handleContinue = () => {
    if (!selectedRole) return;
    // TODO: redirect to role-specific profile form / dashboard
    console.log("Selected Role:", selectedRole);
  };

  return (
    <main className={styles.container}>
      <section className={styles.card}>
        <h1 className={styles.heading}>Complete Your Profile</h1>
        <p className={styles.subheading}>
          Choose your role to set up your Remzik Protocol account.
        </p>

        <div className={styles.roles}>
          <div
            className={`${styles.roleCard} ${
              selectedRole === "investor" ? styles.active : ""
            }`}
            onClick={() => handleSelect("investor")}
          >
            <h3>Investor</h3>
            <p>Access assets, manage portfolio, and track ownership.</p>
          </div>

          <div
            className={`${styles.roleCard} ${
              selectedRole === "partner" ? styles.active : ""
            }`}
            onClick={() => handleSelect("partner")}
          >
            <h3>Partner</h3>
            <p>Submit real-world assets and manage tokenized listings.</p>
          </div>
        </div>

        <button
          className={styles.primary}
          onClick={handleContinue}
          disabled={!selectedRole}
        >
          Continue
        </button>

        <p className={styles.note}>
          Already have an account?
          <Link href="/auth/login" className={styles.link}>
            Login
          </Link>
        </p>
      </section>
    </main>
  );
}
