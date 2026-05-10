"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema } from "../../../integrations/validation/auth.schema";
import { kycSchema } from "@/app/integrations/validation/kyc.schema";
import { signup } from "../../../integrations/api/auth"; // You will update this API call to handle multipart
import { z } from "zod";
import { useRouter } from "next/navigation";
import styles from "../styles/Auth.module.css";
import kycStyles from "../styles/kyc.module.css";
import Alert from "../../../integrations/Alert/Alert";

type AuthFormData = z.infer<typeof signupSchema>;
type KYCFormData = z.infer<typeof kycSchema>;
type Role = "INVESTOR" | "PARTNER" | null;

export default function SignupForm() {
  const router = useRouter();

  // Multi-step state
  const [step, setStep] = useState(1);
  const [authData, setAuthData] = useState<AuthFormData | null>(null);
  const [selectedRole, setSelectedRole] = useState<Role>(null);

  // UI State
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Step 1 Form: Basic Auth
  const {
    register: regAuth,
    handleSubmit: handleAuthSubmit,
    formState: { errors: authErrors },
  } = useForm<AuthFormData>({
    resolver: zodResolver(signupSchema),
  });

  // Step 3 Form: KYC
  const {
    register: regKyc,
    handleSubmit: handleKycSubmit,
    formState: { errors: kycErrors },
  } = useForm<KYCFormData>({
    resolver: zodResolver(kycSchema),
  });

  // Handle Step 1 -> 2
  const onAuthSubmit = (data: AuthFormData) => {
    setAuthData(data);
    setStep(2);
    setError("");
  };

  // Handle Step 2 -> 3
  const onRoleSelect = (role: Role) => {
    setSelectedRole(role);
    setStep(3);
    setError("");
  };

  // Final Step: Atomic Registration + KYC Submission
  const onFinalSubmit = async (kycData: KYCFormData) => {
    if (!authData || !selectedRole) {
      setStep(1);
      return;
    }

    setError("");
    setSuccess("");
    setIsSubmitting(true);

    try {
      // Use FormData to support file uploads (ID and Address proof)
      const formData = new FormData();

      // Auth Fields
      formData.append("name", authData.name);
      formData.append("email", authData.email);
      formData.append("phone", authData.phone);
      formData.append("password", authData.password);
      formData.append("role", selectedRole);

      // KYC Fields
      formData.append("fullName", kycData.fullName);
      formData.append("dob", kycData.dob);
      if (kycData.idDocument?.[0])
        formData.append("idDocument", kycData.idDocument[0]);
      if (kycData.addressProof?.[0])
        formData.append("addressProof", kycData.addressProof[0]);

      // Using a unified endpoint for Atomic Transaction
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/register-with-kyc`,
        {
          method: "POST",
          body: formData,
        },
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Registration failed");
      }

      setSuccess("Account and KYC submitted for review!");
      setTimeout(() => {
        router.push("/auth/login");
      }, 2000);
    } catch (err: any) {
      console.error("Signup/KYC Error:", err);
      setError(err.message || "Server error. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className={styles.authCard}>
      <div className={styles.header}>
        <h1>{step === 3 ? "KYC Verification" : "Create Account"}</h1>
        <p>
          {step === 3
            ? "Complete identity verification to finalize registration."
            : "Secure access to the Remzik Protocol platform"}
        </p>
      </div>

      <div className={styles.formWrapper}>
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

        {/* STEP 1: Basic Info */}
        {step === 1 && (
          <form
            className={styles.form}
            onSubmit={handleAuthSubmit(onAuthSubmit)}
          >
            <label className={styles.field}>
              Full Name
              <input
                {...regAuth("name")}
                type="text"
                placeholder="John Doe"
                className={styles.fieldInput}
              />
              {authErrors.name && (
                <span className={styles.error}>{authErrors.name.message}</span>
              )}
            </label>

            <label className={styles.field}>
              Phone Number
              <input
                {...regAuth("phone")}
                type="tel"
                placeholder="+966..."
                className={styles.fieldInput}
              />
              {authErrors.phone && (
                <span className={styles.error}>{authErrors.phone.message}</span>
              )}
            </label>

            <label className={styles.field}>
              Email Address
              <input
                {...regAuth("email")}
                type="email"
                placeholder="john@email.com"
                className={styles.fieldInput}
              />
              {authErrors.email && (
                <span className={styles.error}>{authErrors.email.message}</span>
              )}
            </label>

            <label className={styles.field}>
              Password
              <input
                {...regAuth("password")}
                type="password"
                placeholder="Create password"
                className={styles.fieldInput}
              />
              {authErrors.password && (
                <span className={styles.error}>
                  {authErrors.password.message}
                </span>
              )}
            </label>

            <label className={styles.field}>
              Confirm Password
              <input
                {...regAuth("confirmPassword")}
                type="password"
                placeholder="Confirm password"
                className={styles.fieldInput}
              />
              {authErrors.confirmPassword && (
                <span className={styles.error}>
                  {authErrors.confirmPassword.message}
                </span>
              )}
            </label>

            <button className={styles.primary} type="submit">
              Next
            </button>
            <p className={styles.note}>
              Already registered?{" "}
              <Link href="/auth/login" className={styles.link}>
                Login
              </Link>
            </p>
          </form>
        )}

        {/* STEP 2: Role Selection */}
        {step === 2 && (
          <div className={styles.form}>
            <div className={styles.roles}>
              <div
                className={`${styles.roleCard} ${selectedRole === "INVESTOR" ? styles.active : ""}`}
                onClick={() => setSelectedRole("INVESTOR")}
              >
                <h3>Investor</h3>
                <p>Access assets, manage portfolio, and track ownership.</p>
              </div>

              <div
                className={`${styles.roleCard} ${selectedRole === "PARTNER" ? styles.active : ""}`}
                onClick={() => setSelectedRole("PARTNER")}
              >
                <h3>Partner</h3>
                <p>Submit real-world assets and manage listings.</p>
              </div>
            </div>

            <button
              className={styles.primary}
              onClick={() => step === 2 && onRoleSelect(selectedRole)}
              disabled={!selectedRole}
            >
              Next: Identity Verification
            </button>
            <button
              className={styles.secondary}
              onClick={() => setStep(1)}
              style={{ marginTop: "10px" }}
            >
              Back
            </button>
          </div>
        )}

        {/* STEP 3: KYC Fields (Merged) */}
        {step === 3 && (
          <form
            className={styles.form}
            onSubmit={handleKycSubmit(onFinalSubmit)}
          >
            <label className={styles.field}>
              Full Name (as per ID)
              <input
                {...regKyc("fullName")}
                type="text"
                placeholder="John Doe"
                className={styles.fieldInput}
              />
              {kycErrors.fullName && (
                <span className={styles.error}>
                  {kycErrors.fullName.message}
                </span>
              )}
            </label>

            <label className={styles.field}>
              Date of Birth
              <input
                {...regKyc("dob")}
                type="date"
                className={styles.fieldInput}
              />
              {kycErrors.dob && (
                <span className={styles.error}>{kycErrors.dob.message}</span>
              )}
            </label>

            <label className={styles.field}>
              Identity Document (Passport/Iqama)
              <input
                {...regKyc("idDocument")}
                type="file"
                accept=".jpg,.png,.pdf"
                className={styles.fieldInput}
              />
              {kycErrors.idDocument && (
                <span className={styles.error}>
                  {kycErrors.idDocument.message as string}
                </span>
              )}
            </label>

            <label className={styles.field}>
              Address Proof
              <input
                {...regKyc("addressProof")}
                type="file"
                accept=".jpg,.png,.pdf"
                className={styles.fieldInput}
              />
              {kycErrors.addressProof && (
                <span className={styles.error}>
                  {kycErrors.addressProof.message as string}
                </span>
              )}
            </label>

            <button
              className={styles.primary}
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Securing Your Account..." : "Finalize & Submit"}
            </button>
            <button
              className={styles.secondary}
              type="button"
              onClick={() => setStep(2)}
              style={{ marginTop: "10px" }}
            >
              Back
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
