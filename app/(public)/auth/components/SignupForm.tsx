"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema } from "../../../integrations/validation/auth.schema";
import { kycSchema } from "@/app/integrations/validation/kyc.schema";
import { login } from "../../../integrations/api/auth";
import { z } from "zod";
import { useRouter } from "next/navigation";
import styles from "../styles/Auth.module.css";
import Alert from "../../../integrations/Alert/Alert";
import {
  ShieldCheck,
  User,
  Building2,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";

type AuthFormData = z.infer<typeof signupSchema>;
type KYCFormData = z.infer<typeof kycSchema>;
type Role = "INVESTOR" | "PARTNER" | null;

// 🛡️ Human-friendly error message translator for registration and KYC
const getFriendlyErrorMessage = (rawMessage: string): string => {
  const msg = rawMessage.toLowerCase();

  if (
    msg.includes("email") &&
    (msg.includes("exist") || msg.includes("already"))
  ) {
    return "An account with this email address already exists. Please try logging in instead.";
  }
  if (
    msg.includes("phone") &&
    (msg.includes("exist") || msg.includes("already"))
  ) {
    return "This phone number is already registered to another account.";
  }
  if (
    msg.includes("file") ||
    msg.includes("upload") ||
    msg.includes("document")
  ) {
    return "There was an issue uploading your verification documents. Please ensure they are valid images or PDFs under the size limit.";
  }
  if (msg.includes("network") || msg.includes("failed to fetch")) {
    return "Connection error. Please check your internet connection and try again.";
  }
  if (msg.includes("server error") || msg.includes("500")) {
    return "Our servers are experiencing a brief hiccup. Please try again shortly.";
  }

  return "Registration or verification failed. Please check your details and try again.";
};

export default function SignupForm() {
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [authData, setAuthData] = useState<AuthFormData | null>(null);
  const [selectedRole, setSelectedRole] = useState<Role>(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register: regAuth,
    handleSubmit: handleAuthSubmit,
    formState: { errors: authErrors },
  } = useForm<AuthFormData>({
    resolver: zodResolver(signupSchema),
  });

  const {
    register: regKyc,
    handleSubmit: handleKycSubmit,
    formState: { errors: kycErrors },
  } = useForm<KYCFormData>({
    resolver: zodResolver(kycSchema),
  });

  const onAuthSubmit = (data: AuthFormData) => {
    setAuthData(data);
    setStep(2);
    setError("");
  };

  const onRoleSelect = (role: Role) => {
    setSelectedRole(role);
    setStep(3);
    setError("");
  };

  const onFinalSubmit = async (kycData: KYCFormData) => {
    if (!authData || !selectedRole) {
      setStep(1);
      return;
    }

    setError("");
    setSuccess("");
    setIsSubmitting(true);

    try {
      const formData = new FormData();

      formData.append("name", authData.name);
      formData.append("email", authData.email);
      formData.append("phone", authData.phone);
      formData.append("password", authData.password);
      formData.append("role", selectedRole);

      formData.append("fullName", kycData.fullName);
      formData.append("dob", kycData.dob);
      if (kycData.idDocument?.[0])
        formData.append("idDocument", kycData.idDocument[0]);
      if (kycData.addressProof?.[0])
        formData.append("addressProof", kycData.addressProof[0]);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/register-with-kyc`,
        {
          method: "POST",
          body: formData,
        },
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Registration failed");
      }

      setSuccess("Account created! Provisioning secure vault wallet...");

      try {
        await login({ email: authData.email, password: authData.password });
        await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/provision-wallet`,
          {
            method: "POST",
            credentials: "include",
          },
        );
      } catch (provisionErr) {
        console.warn(
          "Wallet will auto-provision on session initialization:",
          provisionErr,
        );
      }

      setSuccess("Account and secure wallet initialized successfully!");

      setTimeout(() => {
        switch (selectedRole) {
          case "INVESTOR":
            window.location.replace("/investor");
            break;
          case "PARTNER":
            window.location.replace("/partner");
            break;
          default:
            router.push("/auth/login");
        }
      }, 1500);
    } catch (err: any) {
      console.error("Signup/KYC Error:", err);
      setError(getFriendlyErrorMessage(err.message || ""));
      setIsSubmitting(false);
    }
  };

  return (
    <section className={styles.authCard}>
      <div className={styles.badge}>
        <ShieldCheck size={13} color="#059669" />
        <span>Secure Protocol Portal</span>
      </div>

      <div className={styles.header}>
        <h1>
          {step === 3
            ? "Identity Verification"
            : step === 2
              ? "Select Your Role"
              : "Create Account"}
        </h1>
        <p>
          {step === 3
            ? "Complete KYC compliance verification to finalize your registration."
            : step === 2
              ? "Choose how you want to participate in the Remzik Protocol ecosystem."
              : "Enter your credentials to establish your institutional profile."}
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
              <span>Next Step</span>
              <ArrowRight size={16} />
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
                <div className={styles.roleIconBox}>
                  <User size={20} color="#059669" />
                </div>
                <div>
                  <h3>Investor</h3>
                  <p>
                    Access tokenized asset vaults, manage portfolio holdings,
                    and track halal yields.
                  </p>
                </div>
              </div>

              <div
                className={`${styles.roleCard} ${selectedRole === "PARTNER" ? styles.active : ""}`}
                onClick={() => setSelectedRole("PARTNER")}
              >
                <div className={styles.roleIconBox}>
                  <Building2 size={20} color="#059669" />
                </div>
                <div>
                  <h3>Issuer Partner</h3>
                  <p>
                    Submit real-world properties, structure vaults, and manage
                    distributions.
                  </p>
                </div>
              </div>
            </div>

            <button
              className={styles.primary}
              onClick={() => onRoleSelect(selectedRole)}
              disabled={!selectedRole}
            >
              <span>Next: Identity Verification</span>
              <ArrowRight size={16} />
            </button>
            <button className={styles.secondary} onClick={() => setStep(1)}>
              <ArrowLeft size={16} />
              <span>Back</span>
            </button>
          </div>
        )}

        {/* STEP 3: KYC Fields */}
        {step === 3 && (
          <form
            className={styles.form}
            onSubmit={handleKycSubmit(onFinalSubmit)}
          >
            <label className={styles.field}>
              Full Name (As per official ID)
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
              Identity Document (Passport / Iqama)
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
              Proof of Address
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
              {isSubmitting
                ? "Securing Your Account & Wallet..."
                : "Finalize & Submit"}
            </button>
            <button
              className={styles.secondary}
              type="button"
              onClick={() => setStep(2)}
            >
              <ArrowLeft size={16} />
              <span>Back</span>
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
