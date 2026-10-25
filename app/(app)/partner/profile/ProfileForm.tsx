"use client";

import styles from "./styles/ProfileForm.module.css";
import { useState } from "react";
import { updateProfile } from "@/app/integrations/api/profile";
import { useAlert } from "@/app/integrations/Alert/AlertContext";
import { ShieldCheck, Lock } from "lucide-react";

export default function ProfileForm({ profile }: any) {
  const { showAlert } = useAlert();

  const [form, setForm] = useState({
    name: profile?.name || "",
    email: profile?.email || "",
    phone: profile?.phone || "",
    address: profile?.address || "",
  });

  const handleChange = (field: string, value: string) => {
    setForm({ ...form, [field]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await updateProfile({
        name: form.name,
        address: form.address,
      });

      showAlert("success", "Profile updated successfully");
    } catch (err) {
      console.error(err);
      showAlert("error", "Update failed. Please try again.");
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.formHeader}>
        <h3>Account Parameters</h3>
        <span className={styles.verifiedTag}>
          <ShieldCheck size={13} /> Verified Partner
        </span>
      </div>

      <div className={styles.inputGroup}>
        <label>Corporate Entity / Name</label>
        <input
          type="text"
          value={form.name || ""}
          onChange={(e) => handleChange("name", e.target.value)}
          placeholder="Enter corporate name"
        />
      </div>

      <div className={styles.inputGroup}>
        <label>
          Email Address{" "}
          <Lock size={11} style={{ display: "inline", marginLeft: 4 }} />
        </label>
        <input
          type="email"
          value={form.email || ""}
          disabled
          className={styles.disabledInput}
        />
      </div>

      <div className={styles.inputGroup}>
        <label>
          Phone Number{" "}
          <Lock size={11} style={{ display: "inline", marginLeft: 4 }} />
        </label>
        <input
          type="text"
          value={form.phone || ""}
          disabled
          className={styles.disabledInput}
        />
      </div>

      <div className={styles.inputGroup}>
        <label>Registered Address</label>
        <input
          type="text"
          value={form.address || ""}
          onChange={(e) => handleChange("address", e.target.value)}
          placeholder="Enter physical business address"
        />
      </div>

      <button type="submit" className={styles.submitBtn}>
        Save Profile Changes
      </button>
    </form>
  );
}
