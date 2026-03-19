"use client";

import styles from "./styles/ProfileForm.module.css";
import { useState } from "react";
import { updateProfile } from "@/app/integrations/api/profile";
import { useAlert } from "@/app/integrations/Alert/AlertContext";
export default function ProfileForm({ profile }: any) {
  const { showAlert } = useAlert();
  const [form, setForm] = useState({
    name: profile.name,
    email: profile.email,
    phone: profile.phone,
    address: profile.address,
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

      showAlert("success", "Avatar updated successfully");
    } catch (err) {
      console.error(err);
      alert("Update failed");
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.inputGroup}>
        <label>Name</label>
        <input
          type="text"
          value={form.name}
          onChange={(e) => handleChange("name", e.target.value)}
        />
      </div>

      {/* 🚫 READ ONLY */}
      <div className={styles.inputGroup}>
        <label>Email</label>
        <input type="email" value={form.email} disabled />
      </div>

      <div className={styles.inputGroup}>
        <label>Phone</label>
        <input type="text" value={form.phone} disabled />
      </div>

      <div className={styles.inputGroup}>
        <label>Address</label>
        <input
          type="text"
          value={form.address}
          onChange={(e) => handleChange("address", e.target.value)}
        />
      </div>

      <button type="submit" className={styles.submitBtn}>
        Save Profile
      </button>
    </form>
  );
}
