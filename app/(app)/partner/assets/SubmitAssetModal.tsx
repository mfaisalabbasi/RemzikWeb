"use client";

import { useState } from "react";
import styles from "./styles/SubmitAssetModal.module.css";

interface Props {
  onClose: () => void;
}

export default function SubmitAssetModal({ onClose }: Props) {
  const [form, setForm] = useState({
    name: "",
    type: "",
    stage: "",
    target: "",
    roi: "",
    documents: [] as File[],
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setForm({ ...form, documents: Array.from(e.target.files) });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitted asset:", form);
    onClose();
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h3>Submit New Asset</h3>
          <button className={styles.closeBtn} onClick={onClose}>
            &times;
          </button>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <label>
            Asset Name
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Type
            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              required
            >
              <option value="">Select Type</option>
              <option value="Residential">Residential</option>
              <option value="Commercial">Commercial</option>
              <option value="Industrial">Industrial</option>
            </select>
          </label>

          <label>
            Stage
            <select
              name="stage"
              value={form.stage}
              onChange={handleChange}
              required
            >
              <option value="">Select Stage</option>
              <option value="Funding">Funding</option>
              <option value="Approved">Approved</option>
              <option value="Completed">Completed</option>
            </select>
          </label>

          <label>
            Target Amount (SAR)
            <input
              type="number"
              name="target"
              value={form.target}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Expected ROI (%)
            <input
              type="number"
              name="roi"
              value={form.roi}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Upload Documents / Images
            <input
              type="file"
              multiple
              accept=".pdf,.doc,.docx,image/*"
              onChange={handleFileChange}
            />
          </label>

          <button type="submit" className={styles.submitBtn}>
            Submit Asset
          </button>
        </form>
      </div>
    </div>
  );
}
