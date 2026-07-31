"use client";

import { useState } from "react";
import styles from "./RecoveryModule.module.css";

interface RecoveryVerificationWizardProps {
  requestId: string;
  onComplete: () => void;
  onCancel: () => void;
}

export default function RecoveryVerificationWizard({
  requestId,
  onComplete,
  onCancel,
}: RecoveryVerificationWizardProps) {
  const [step, setStep] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    documentType: "PASSPORT",
    documentFile: null as File | null,
    selfieFile: null as File | null,
  });

  const handleFileChange = (
    field: "documentFile" | "selfieFile",
    file: File | null,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: file }));
  };

  const handleSubmitVerification = async () => {
    try {
      setLoading(true);
      const payload = new FormData();
      payload.append("requestId", requestId);
      payload.append("documentType", formData.documentType);
      if (formData.documentFile)
        payload.append("document", formData.documentFile);
      if (formData.selfieFile) payload.append("selfie", formData.selfieFile);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/recovery/verification`,
        {
          method: "POST",
          credentials: "include",
          body: payload,
        },
      );

      const result = await res.json();
      if (!res.ok) {
        throw new Error(
          result.message || "Failed to transmit verification data",
        );
      }

      onComplete();
    } catch (err: any) {
      alert(err.message || "Failed to submit verification package");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.statusCard}>
        <div className={styles.headerRow}>
          <h3>Identity Verification</h3>
          <span className={styles.badge}>Step {step} of 2</span>
        </div>

        {/* Step 1: Document Upload */}
        {step === 1 && (
          <div className={styles.stepContent}>
            <p className={styles.subtext}>
              Upload a valid government-issued photo ID to prove ownership of
              the account.
            </p>
            <div className={styles.inputGroup}>
              <label>Document Type</label>
              <select
                value={formData.documentType}
                onChange={(e) =>
                  setFormData({ ...formData, documentType: e.target.value })
                }
                className={styles.selectInput}
              >
                <option value="PASSPORT">Passport</option>
                <option value="NATIONAL_ID">National ID Card</option>
              </select>
            </div>

            <div className={styles.inputGroup}>
              <label>Document Image / PDF</label>
              <input
                type="file"
                accept="image/*,application/pdf"
                onChange={(e) =>
                  handleFileChange("documentFile", e.target.files?.[0] || null)
                }
                className={styles.fileInput}
              />
            </div>

            <div className={styles.modalActions}>
              <button className={styles.secondaryButton} onClick={onCancel}>
                Cancel
              </button>
              <button
                className={styles.primaryButton}
                onClick={() => setStep(2)}
                disabled={!formData.documentFile}
              >
                Next: Biometrics
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Biometrics / Selfie & Final Submission */}
        {step === 2 && (
          <div className={styles.stepContent}>
            <p className={styles.subtext}>
              Upload a live face scan or selfie matching your document photo.
            </p>
            <div className={styles.inputGroup}>
              <label>Biometric Selfie Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  handleFileChange("selfieFile", e.target.files?.[0] || null)
                }
                className={styles.fileInput}
              />
            </div>

            <div className={styles.modalActions}>
              <button
                className={styles.secondaryButton}
                onClick={() => setStep(1)}
              >
                Back
              </button>
              <button
                className={styles.primaryButton}
                onClick={handleSubmitVerification}
                disabled={loading || !formData.selfieFile}
              >
                {loading ? "Transmitting..." : "Submit Verification"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
