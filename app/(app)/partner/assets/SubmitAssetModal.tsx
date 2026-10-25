"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { assetSchema } from "@/app/integrations/validation/asset-schema";
import { z } from "zod";
import styles from "./styles/SubmitAssetModal.module.css";
import Alert from "@/app/integrations/Alert/Alert";
import { X, UploadCloud, CheckCircle2 } from "lucide-react";

type AssetFormData = z.infer<typeof assetSchema>;

interface Props {
  onClose: () => void;
}

const getFriendlyErrorMessage = (rawMessage: string): string => {
  const msg = rawMessage.toLowerCase();
  if (
    msg.includes("unauthorized") ||
    msg.includes("session") ||
    msg.includes("401")
  ) {
    return "Your session has expired. Please log in again to submit an asset.";
  }
  if (
    msg.includes("forbidden") ||
    msg.includes("role") ||
    msg.includes("partner") ||
    msg.includes("403")
  ) {
    return "You do not have the required partner permissions to submit assets.";
  }
  if (
    msg.includes("file") ||
    msg.includes("upload") ||
    msg.includes("document") ||
    msg.includes("size")
  ) {
    return "There was an issue with one or more uploaded files. Please check the formats and sizes.";
  }
  if (msg.includes("network") || msg.includes("failed to fetch")) {
    return "Connection error. Please check your internet connection and try again.";
  }
  return "Asset submission failed. Please check your details and try again.";
};

export default function SubmitAssetModal({ onClose }: Props) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AssetFormData>({
    resolver: zodResolver(assetSchema),
  });

  const appendFiles = (
    formData: FormData,
    key: string,
    fileList?: FileList | null,
  ) => {
    if (!fileList) return;
    Array.from(fileList).forEach((file) => {
      formData.append(key, file);
    });
  };

  const onSubmit = async (data: AssetFormData) => {
    setError("");
    setSuccess("");

    if (!data.galleryImages || data.galleryImages.length === 0) {
      setError("Please upload at least one gallery image.");
      return;
    }
    if (!data.legalDocuments || data.legalDocuments.length === 0) {
      setError("Please upload the required legal documents.");
      return;
    }
    if (!data.financialDocuments || data.financialDocuments.length === 0) {
      setError("Please upload the required financial documents.");
      return;
    }

    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("type", data.type);
      formData.append("description", data.description);
      formData.append("totalValue", data.totalValue);
      formData.append("location", data.location);
      formData.append("expectedYield", data.expectedYield);
      formData.append("rentalIncome", data.rentalIncome);
      formData.append("assetSize", data.assetSize);
      formData.append("tokenSupply", data.tokenSupply);

      appendFiles(formData, "galleryImages", data.galleryImages);
      appendFiles(formData, "legalDocuments", data.legalDocuments);
      appendFiles(formData, "financialDocuments", data.financialDocuments);
      appendFiles(formData, "otherDocuments", data.otherDocuments);

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/assets`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      const text = await res.text();
      let message = "Asset submission failed";

      try {
        const json = JSON.parse(text);
        message = json.message || message;
      } catch {
        message = text;
      }

      if (!res.ok) {
        setError(getFriendlyErrorMessage(message));
        return;
      }

      setSuccess("Asset submitted successfully to institutional queue.");
      setTimeout(() => {
        onClose();
      }, 1200);
    } catch (err: any) {
      console.error(err);
      setError(getFriendlyErrorMessage(err.message || ""));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        {/* STICKY HEADER */}
        <div className={styles.header}>
          <div>
            <h3>Submit New Asset Vault</h3>
            <span className={styles.modalSub}>
              Configure tokenized real-world asset parameters
            </span>
          </div>
          <button className={styles.closeBtn} onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* STICKY ALERT CONTAINER */}
        <div className={styles.stickyAlertContainer}>
          {error && (
            <Alert type="error" message={error} onClose={() => setError("")} />
          )}
          {success && (
            <Alert
              type="success"
              message={success}
              onClose={() => setSuccess("")}
            />
          )}
        </div>

        <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
          <div className={styles.formGrid}>
            <label>
              Asset Title
              <input
                {...register("title")}
                placeholder="e.g. Al-Olaya Commercial Tower"
              />
              {errors.title && (
                <span className={styles.error}>{errors.title.message}</span>
              )}
            </label>

            <label>
              Asset Type
              <select {...register("type")}>
                <option value="">Select Category</option>
                <option value="RESIDENTIAL">Residential</option>
                <option value="COMMERCIAL">Commercial</option>
                <option value="INDUSTRIAL">Industrial</option>
              </select>
              {errors.type && (
                <span className={styles.error}>{errors.type.message}</span>
              )}
            </label>
          </div>

          <label>
            Description & Highlights
            <textarea
              {...register("description")}
              placeholder="Provide institutional summary of the asset..."
            />
            {errors.description && (
              <span className={styles.error}>{errors.description.message}</span>
            )}
          </label>

          <div className={styles.formGrid}>
            <label>
              Total Asset Value (SAR)
              <input
                type="number"
                {...register("totalValue")}
                placeholder="5000000"
              />
              {errors.totalValue && (
                <span className={styles.error}>
                  {errors.totalValue.message}
                </span>
              )}
            </label>

            <label>
              Location
              <input
                {...register("location")}
                placeholder="Riyadh, Saudi Arabia"
              />
              {errors.location && (
                <span className={styles.error}>{errors.location.message}</span>
              )}
            </label>
          </div>

          <div className={styles.formGridTriple}>
            <label>
              Expected Yield %
              <input
                type="number"
                step="0.1"
                {...register("expectedYield")}
                placeholder="12.5"
              />
              {errors.expectedYield && (
                <span className={styles.error}>
                  {errors.expectedYield.message}
                </span>
              )}
            </label>

            <label>
              Annual Rental Income
              <input
                type="number"
                {...register("rentalIncome")}
                placeholder="350000"
              />
              {errors.rentalIncome && (
                <span className={styles.error}>
                  {errors.rentalIncome.message}
                </span>
              )}
            </label>

            <label>
              Asset Size (sqft)
              <input
                type="number"
                {...register("assetSize")}
                placeholder="12500"
              />
              {errors.assetSize && (
                <span className={styles.error}>{errors.assetSize.message}</span>
              )}
            </label>
          </div>

          <label>
            Token Supply
            <input
              type="number"
              {...register("tokenSupply")}
              placeholder="500000"
            />
            {errors.tokenSupply && (
              <span className={styles.error}>{errors.tokenSupply.message}</span>
            )}
          </label>

          <div className={styles.fileSectionTitle}>
            Required Verification Documentation
          </div>

          <div className={styles.fileGrid}>
            <label className={styles.fileBox}>
              <span>Gallery Images *</span>
              <input type="file" multiple {...register("galleryImages")} />
            </label>

            <label className={styles.fileBox}>
              <span>Legal Documents *</span>
              <input type="file" multiple {...register("legalDocuments")} />
            </label>

            <label className={styles.fileBox}>
              <span>Financial Documents *</span>
              <input type="file" multiple {...register("financialDocuments")} />
            </label>

            <label className={styles.fileBox}>
              <span>Other Supporting Docs</span>
              <input type="file" multiple {...register("otherDocuments")} />
            </label>
          </div>

          <button
            type="submit"
            className={styles.submitBtn}
            disabled={submitting}
          >
            {submitting
              ? "Securing & Submitting..."
              : "Submit Asset for Approval"}
          </button>
        </form>
      </div>
    </div>
  );
}
