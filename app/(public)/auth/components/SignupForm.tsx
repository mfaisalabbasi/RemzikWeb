"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema } from "../../../integrations/validation/auth.schema";
import { signup } from "../../../integrations/api/auth";
import { z } from "zod";
import { useRouter } from "next/navigation";
import styles from "../styles/Auth.module.css";
import Alert from "../../../integrations/Alert/Alert";

type FormData = z.infer<typeof signupSchema>;
type Role = "INVESTOR" | "PARTNER" | null;

export default function SignupForm() {
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [step1Data, setStep1Data] = useState<FormData | null>(null);
  const [selectedRole, setSelectedRole] = useState<Role>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // react-hook-form for step 1
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(signupSchema),
  });

  // Step 1: Save basic info
  const handleStep1 = (data: FormData) => {
    setStep1Data(data);
    setStep(2); // move to role selection
    setError("");
  };

  // Step 2: Final submit
  const handleStep2 = async () => {
    if (!selectedRole || !step1Data) {
      setError("Please select a role to continue.");
      return;
    }

    setError("");
    setSuccess("");
    setIsSubmitting(true);

    try {
      // Prepare payload exactly as backend expects
      const payload = {
        name: step1Data.name,
        email: step1Data.email,
        phone: step1Data.phone,
        password: step1Data.password,
        role: selectedRole,
      };

      await signup(payload);

      setSuccess("Account created successfully!");
      setTimeout(() => {
        router.push("/auth/kyc"); // move to KYC or dashboard
      }, 1500);
    } catch (err: any) {
      // Replace line 71 with this to see the real error:
      console.error(
        "Signup Error Details:",
        err.response?.data || err.message || err,
      );
      setError(
        err?.response?.data?.message || "Server error. Please try again later.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className={styles.authCard}>
      <div className={styles.header}>
        <h1>Create Account</h1>
        <p>Secure access to the Remzik Protocol platform</p>
      </div>

      <div className={styles.formWrapper}>
        {/* ALERTS */}
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

        {/* STEP 1: User Info */}
        {step === 1 && (
          <form className={styles.form} onSubmit={handleSubmit(handleStep1)}>
            <label className={styles.field}>
              Full Name
              <input
                {...register("name")}
                type="text"
                placeholder="John Doe"
                className={styles.fieldInput}
              />
              {errors.name && (
                <span className={styles.error}>{errors.name.message}</span>
              )}
            </label>

            <label className={styles.field}>
              Phone Number
              <input
                {...register("phone")}
                type="tel"
                placeholder="+966..."
                className={styles.fieldInput}
              />
              {errors.phone && (
                <span className={styles.error}>{errors.phone.message}</span>
              )}
            </label>

            <label className={styles.field}>
              Email Address
              <input
                {...register("email")}
                type="email"
                placeholder="john@email.com"
                className={styles.fieldInput}
              />
              {errors.email && (
                <span className={styles.error}>{errors.email.message}</span>
              )}
            </label>

            <label className={styles.field}>
              Password
              <input
                {...register("password")}
                type="password"
                placeholder="Create password"
                className={styles.fieldInput}
              />
              {errors.password && (
                <span className={styles.error}>{errors.password.message}</span>
              )}
            </label>

            <label className={styles.field}>
              Confirm Password
              <input
                {...register("confirmPassword")}
                type="password"
                placeholder="Confirm password"
                className={styles.fieldInput}
              />
              {errors.confirmPassword && (
                <span className={styles.error}>
                  {errors.confirmPassword.message}
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
                <p>Submit real-world assets and manage tokenized listings.</p>
              </div>
            </div>

            <button
              className={styles.primary}
              onClick={handleStep2}
              disabled={!selectedRole || isSubmitting}
            >
              {isSubmitting ? "Creating Account..." : "Finish Signup"}
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
      </div>
    </section>
  );
}
