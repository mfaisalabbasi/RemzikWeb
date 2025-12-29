"use client";

import { useState } from "react";
import styles from "./styles/NewAssetForm.module.css";

export default function NewAssetForm() {
  const [form, setForm] = useState({
    name: "",
    type: "",
    description: "",
    value: "",
    expectedReturn: "",
    documents: null as File | null,
    shariahCompliant: false,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "checkbox") {
      setForm((prev) => ({ ...prev, [name]: checked }));
    } else if (type === "file" && files) {
      setForm((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(form);
    alert("Asset submitted (mock)");
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h2 className={styles.heading}>Submit New Asset</h2>

      <label className={styles.label}>
        Asset Name
        <input
          className={styles.input}
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
        />
      </label>

      <label className={styles.label}>
        Asset Type
        <input
          className={styles.input}
          type="text"
          name="type"
          value={form.type}
          onChange={handleChange}
          required
        />
      </label>

      <label className={styles.label}>
        Description
        <textarea
          className={styles.textarea}
          name="description"
          value={form.description}
          onChange={handleChange}
          required
        />
      </label>

      <label className={styles.label}>
        Value
        <input
          className={styles.input}
          type="number"
          name="value"
          value={form.value}
          onChange={handleChange}
          required
        />
      </label>

      <label className={styles.label}>
        Expected Return (%)
        <input
          className={styles.input}
          type="number"
          name="expectedReturn"
          value={form.expectedReturn}
          onChange={handleChange}
          required
        />
      </label>

      <label className={styles.label}>
        Upload Documents
        <input
          className={styles.input}
          type="file"
          name="documents"
          onChange={handleChange}
        />
      </label>

      <label className={styles.checkboxLabel}>
        <input
          className={styles.checkboxInput}
          type="checkbox"
          name="shariahCompliant"
          checked={form.shariahCompliant}
          onChange={handleChange}
        />
        Shariah Compliant
      </label>

      <button type="submit" className={styles.submit}>
        Submit Asset
      </button>
    </form>
  );
}
