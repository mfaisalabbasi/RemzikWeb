"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { kycSchema } from "@/app/integrations/validation/kyc.schema";
import { z } from "zod";
import styles from "../styles/kyc.module.css";

type KYCFormData = z.infer<typeof kycSchema>;

interface KYCProps {
  role: "INVESTOR" | "PARTNER";
  onComplete?: () => void;
}

export default function KYCPage({ role, onComplete }: KYCProps) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<KYCFormData>({
    resolver: zodResolver(kycSchema),
  });

  const onSubmit = async (data: KYCFormData) => {
    setSubmitting(true);
    setServerError("");

    try {
      const formData = new FormData();

      formData.append("fullName", data.fullName);
      formData.append("dob", data.dob);
      formData.append("idDocument", data.idDocument[0]);
      formData.append("addressProof", data.addressProof[0]);

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/kyc/submit`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!res.ok) {
        const text = await res.text();

        let message = "KYC submission failed";

        try {
          const json = JSON.parse(text);
          message = json.message || message;
        } catch {
          message = text;
        }

        throw new Error(message);
      }

      /**
       * Fetch current user to detect role safely
       */
      const meRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
        credentials: "include",
      });

      if (!meRes.ok) {
        router.push("/auth/login");
        return;
      }

      const user = await meRes.json();

      onComplete?.();

      /**
       * Redirect based on role
       */
      if (user.role === "INVESTOR") {
        router.push("/investor");
      } else if (user.role === "PARTNER") {
        router.push("/partner");
      } else {
        router.push("/dashboard");
      }

      router.refresh();
    } catch (err: any) {
      console.error("KYC submission failed:", err);
      setServerError(err.message || "Unexpected server error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSkip = () => {
    router.push("/auth/login");
  };

  return (
    <main className={styles.container}>
      <section className={styles.card}>
        <h1 className={styles.heading}>KYC Verification</h1>

        <p className={styles.subheading}>
          Complete identity verification to access Remzik{" "}
          {role === "INVESTOR" ? "investment" : "partner"} features.
        </p>

        {serverError && <div className={styles.errorBox}>{serverError}</div>}

        <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
          {/* Full Name */}
          <label className={styles.field}>
            Full Name
            <input
              {...register("fullName")}
              type="text"
              placeholder="John Doe"
              className={styles.fieldInput}
            />
            {errors.fullName && (
              <span className={styles.error}>{errors.fullName.message}</span>
            )}
          </label>

          {/* DOB */}
          <label className={styles.field}>
            Date of Birth
            <input
              {...register("dob")}
              type="date"
              className={styles.fieldInput}
            />
            {errors.dob && (
              <span className={styles.error}>{errors.dob.message}</span>
            )}
          </label>

          {/* ID Document */}
          <label className={styles.field}>
            Identity Document
            <input
              {...register("idDocument")}
              type="file"
              accept=".jpg,.png,.pdf"
              className={styles.fieldInput}
            />
            {errors.idDocument && (
              <span className={styles.error}>
                {errors.idDocument.message as string}
              </span>
            )}
          </label>

          {/* Address Proof */}
          <label className={styles.field}>
            Address Proof
            <input
              {...register("addressProof")}
              type="file"
              accept=".jpg,.png,.pdf"
              className={styles.fieldInput}
            />
            {errors.addressProof && (
              <span className={styles.error}>
                {errors.addressProof.message as string}
              </span>
            )}
          </label>

          <div className={styles.actions}>
            <button
              type="submit"
              className={styles.primary}
              disabled={submitting}
            >
              {submitting ? "Submitting..." : "Submit KYC"}
            </button>

            <button
              type="button"
              className={styles.secondary}
              onClick={handleSkip}
            >
              Skip for now
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}
