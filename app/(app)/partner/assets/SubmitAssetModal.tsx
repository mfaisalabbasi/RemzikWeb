"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { assetSchema } from "@/app/integrations/validation/asset-schema";
import { z } from "zod";
import styles from "./styles/SubmitAssetModal.module.css";
import Alert from "@/app/integrations/Alert/Alert";

type AssetFormData = z.infer<typeof assetSchema>;

interface Props {
  onClose: () => void;
}

export default function SubmitAssetModal({ onClose }: Props) {
  const [submitting, setSubmitting] = useState(false);

  // ✅ ALERT STATES (added)
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
    setSubmitting(true);

    // ✅ reset alerts
    setError("");
    setSuccess("");

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
        // ❌ replaced alert
        setError(message);
        throw new Error(message);
      }

      // ✅ success alert
      setSuccess("Asset submitted successfully");

      setTimeout(() => {
        onClose();
      }, 1200);
    } catch (err: any) {
      console.error(err);

      // ❌ replaced alert
      setError(err.message || "Unexpected error");
    } finally {
      setSubmitting(false);
    }
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

        {/* ✅ ALERT UI (added) */}
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

        <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
          <label>
            Asset Title
            <input {...register("title")} />
            {errors.title && (
              <span className={styles.error}>{errors.title.message}</span>
            )}
          </label>

          <label>
            Asset Type
            <select {...register("type")}>
              <option value="">Select</option>
              <option value="RESIDENTIAL">Residential</option>
              <option value="COMMERCIAL">Commercial</option>
              <option value="INDUSTRIAL">Industrial</option>
            </select>
            {errors.type && (
              <span className={styles.error}>{errors.type.message}</span>
            )}
          </label>

          <label>
            Description
            <textarea {...register("description")} />
            {errors.description && (
              <span className={styles.error}>{errors.description.message}</span>
            )}
          </label>

          <label>
            Asset Value
            <input type="number" {...register("totalValue")} />
            {errors.totalValue && (
              <span className={styles.error}>{errors.totalValue.message}</span>
            )}
          </label>

          <label>
            Location
            <input {...register("location")} />
            {errors.location && (
              <span className={styles.error}>{errors.location.message}</span>
            )}
          </label>

          <label>
            Expected Yield %
            <input type="number" step="0.1" {...register("expectedYield")} />
            {errors.expectedYield && (
              <span className={styles.error}>
                {errors.expectedYield.message}
              </span>
            )}
          </label>

          <label>
            Rental Income (Annual)
            <input type="number" {...register("rentalIncome")} />
            {errors.rentalIncome && (
              <span className={styles.error}>
                {errors.rentalIncome.message}
              </span>
            )}
          </label>

          <label>
            Asset Size (sqft)
            <input type="number" {...register("assetSize")} />
            {errors.assetSize && (
              <span className={styles.error}>{errors.assetSize.message}</span>
            )}
          </label>

          <label>
            Token Supply
            <input type="number" {...register("tokenSupply")} />
            {errors.tokenSupply && (
              <span className={styles.error}>{errors.tokenSupply.message}</span>
            )}
          </label>

          <label>
            Gallery Images
            <input type="file" multiple {...register("galleryImages")} />
          </label>

          <label>
            Legal Documents
            <input type="file" multiple {...register("legalDocuments")} />
          </label>

          <label>
            Financial Documents
            <input type="file" multiple {...register("financialDocuments")} />
          </label>

          <label>
            Other Documents
            <input type="file" multiple {...register("otherDocuments")} />
          </label>

          <button
            type="submit"
            className={styles.submitBtn}
            disabled={submitting}
          >
            {submitting ? "Submitting..." : "Submit Asset"}
          </button>
        </form>
      </div>
    </div>
  );
}
