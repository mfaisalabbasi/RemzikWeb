"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { loginSchema } from "../../../integrations/validation/auth.schema";
import { login, AuthLoginResponse } from "../../../integrations/api/auth";

import { z } from "zod";
import styles from "../styles/Auth.module.css";
import Alert from "../../../integrations/Alert/Alert";

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setError("");
    setSuccess("");
    setIsSubmitting(true);

    try {
      const response: AuthLoginResponse = await login(data);

      console.log("Backend login response:", response);

      const user = response.user;

      if (!user || !user.role) {
        setError("Invalid server response. Please try again.");
        return;
      }

      switch (user.role) {
        case "INVESTOR":
          router.push("/investor");
          break;

        case "PARTNER":
          router.push("/partner");
          break;

        case "ADMIN":
          router.push("/admin");
          break;

        default:
          setError("Unknown user role. Contact support.");
          return;
      }

      setSuccess("Login successful");
    } catch (err: any) {
      console.error("Login error:", err.message);
      setError(err.message || "Authentication failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className={styles.authCard}>
      <div className={styles.header}>
        <h1>Welcome Back</h1>
        <p>Authenticate to continue to Remzik Protocol</p>
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

        <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
          <label className={styles.field}>
            Email Address
            <input
              {...register("email")}
              type="email"
              placeholder="name@email.com"
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
              placeholder="Enter password"
              className={styles.fieldInput}
            />
            {errors.password && (
              <span className={styles.error}>{errors.password.message}</span>
            )}
          </label>

          <button
            className={styles.primary}
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Authenticating..." : "Login"}
          </button>

          <p className={styles.note}>
            Don’t have an account?{" "}
            <Link href="/auth/signup" className={styles.link}>
              Create Account
            </Link>
          </p>
        </form>
      </div>
    </section>
  );
}
