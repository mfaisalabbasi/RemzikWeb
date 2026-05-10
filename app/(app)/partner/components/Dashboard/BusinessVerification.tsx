"use client";

import { useState } from "react";
import styles from "./styles/BusinessVerification.module.css";
import { uploadBusinessDocs } from "@/app/integrations/api/partner";

interface Props {
  status: string;
  onSuccess?: () => void;
}

export default function BusinessVerification({
  status = "UNVERIFIED",
  onSuccess,
}: Props) {
  const [files, setFiles] = useState<{ cr: File | null; tax: File | null }>({
    cr: null,
    tax: null,
  });
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async () => {
    if (!files.cr && !files.tax) {
      return alert("Please select at least one document to update.");
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      if (files.cr) formData.append("crDocument", files.cr);
      if (files.tax) formData.append("taxDocument", files.tax);

      await uploadBusinessDocs(formData);
      alert(
        "Business documents submitted successfully. Our team will review them shortly.",
      );

      // Clear file inputs after successful upload
      setFiles({ cr: null, tax: null });

      if (onSuccess) onSuccess();
    } catch (err: any) {
      alert(err.message || "Failed to upload documents");
    } finally {
      setIsUploading(false);
    }
  };

  const isVerified = status === "VERIFIED";

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleGroup}>
          <h2>Business Verification</h2>
          <p>
            {isVerified
              ? "Your business is verified. You can now list assets."
              : "Upload or update your corporate documents to unlock asset listing."}
          </p>
        </div>
        <span
          className={`${styles.statusBadge} ${styles[status.toLowerCase()]}`}
        >
          {status}
        </span>
      </div>

      {!isVerified && (
        <>
          <div className={styles.uploadGrid}>
            {/* CR Upload */}
            <div className={styles.uploadBox}>
              <label>Commercial Registration (CR)</label>
              <div className={styles.dropZone}>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) =>
                    setFiles({ ...files, cr: e.target.files?.[0] || null })
                  }
                />
                <span>
                  {files.cr ? files.cr.name : "Click to upload CR (PDF/Image)"}
                </span>
              </div>
            </div>

            {/* Tax Upload */}
            <div className={styles.uploadBox}>
              <label>VAT / Tax Certificate</label>
              <div className={styles.dropZone}>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) =>
                    setFiles({ ...files, tax: e.target.files?.[0] || null })
                  }
                />
                <span>
                  {files.tax ? files.tax.name : "Click to upload Tax Cert"}
                </span>
              </div>
            </div>
          </div>

          <button
            className={styles.submitBtn}
            onClick={handleUpload}
            disabled={isUploading}
          >
            {isUploading ? "Uploading..." : "Submit for Verification"}
          </button>
        </>
      )}
    </div>
  );
}
