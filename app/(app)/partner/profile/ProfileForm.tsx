"use client";

import styles from "./styles/ProfileForm.module.css";
import { useState } from "react";

export default function ProfileForm() {
  const [form, setForm] = useState({
    name: "Remzik Partner",
    email: "partner@example.com",
    phone: "+966 500 000 000",
    address: "Riyadh, Saudi Arabia",
  });

  const handleChange = (field: string, value: string) => {
    setForm({ ...form, [field]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Profile saved!");
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
      <div className={styles.inputGroup}>
        <label>Email</label>
        <input
          type="email"
          value={form.email}
          onChange={(e) => handleChange("email", e.target.value)}
        />
      </div>
      <div className={styles.inputGroup}>
        <label>Phone</label>
        <input
          type="text"
          value={form.phone}
          onChange={(e) => handleChange("phone", e.target.value)}
        />
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
