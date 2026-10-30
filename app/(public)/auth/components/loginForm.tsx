"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { login, AuthLoginResponse } from "../../../integrations/api/auth";
import { loginSchema } from "../../../integrations/validation/auth.schema";

import { z } from "zod";
import styles from "../styles/Auth.module.css";
import Alert from "../../../integrations/Alert/Alert";
import { ShieldCheck, ArrowRight } from "lucide-react";

type LoginFormData = z.infer<typeof loginSchema>;

const API_HOST = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

const getFriendlyErrorMessage = (rawMessage: string): string => {
  const msg = rawMessage.toLowerCase();

  if (
    msg.includes("unauthorized") ||
    msg.includes("invalid credentials") ||
    msg.includes("401")
  ) {
    return "Invalid credentials. Please check and try again.";
  }
  if (msg.includes("not found") || msg.includes("404")) {
    return "We couldn't find an account matching that email address.";
  }
  if (msg.includes("network") || msg.includes("failed to fetch")) {
    return "Connection error. Please check your internet connection and try again.";
  }
  if (msg.includes("too many requests") || msg.includes("429")) {
    return "Too many login attempts. Please wait a moment before trying again.";
  }
  if (msg.includes("server error") || msg.includes("500")) {
    return "Our servers are experiencing a brief hiccup. Please try again shortly.";
  }

  return rawMessage || "An unexpected error occurred. Please try again.";
};

const getSafeCallbackUrl = (rawCallbackUrl: string | null): string | null => {
  if (!rawCallbackUrl) return null;

  try {
    let decoded = rawCallbackUrl;
    for (let i = 0; i < 2; i++) {
      if (decoded.includes("%")) {
        decoded = decodeURIComponent(decoded);
      }
    }

    if (
      (!decoded.startsWith("/") && !decoded.startsWith("http")) ||
      (decoded.includes("//") && !decoded.includes(window.location.host)) ||
      decoded.includes("\\") ||
      decoded.includes("\r") ||
      decoded.includes("\n")
    ) {
      if (decoded.startsWith("/")) {
        return decoded;
      }
      return null;
    }

    if (decoded.startsWith("http")) {
      const url = new URL(decoded);
      if (url.origin === window.location.origin) {
        return url.pathname + url.search;
      }
      return null;
    }

    return decoded;
  } catch {
    return null;
  }
};

function LoginFormContent() {
  const searchParams = useSearchParams();

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- Forgot Password Modal States ---
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [forgotStep, setForgotStep] = useState<"REQUEST" | "RESET">("REQUEST");
  const [resetEmail, setResetEmail] = useState("");
  const [otpToken, setOtpToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isForgotLoading, setIsForgotLoading] = useState(false);
  const [forgotError, setForgotError] = useState("");
  const [forgotSuccess, setForgotSuccess] = useState("");

  const getCallbackUrl = (): string | null => {
    if (typeof window === "undefined") return null;

    const fromHook = searchParams.get("callbackUrl");
    if (fromHook) return fromHook;

    const params = new URLSearchParams(window.location.search);
    const cb = params.get("callbackUrl");
    if (cb) return cb;

    return sessionStorage.getItem("persisted_callback_url");
  };

  useEffect(() => {
    const rawCallback = getCallbackUrl();
    if (!rawCallback) return;

    try {
      sessionStorage.setItem("persisted_callback_url", rawCallback);

      const decodedUrl = decodeURIComponent(rawCallback);
      const queryPart = decodedUrl.split("?")[1];

      if (!queryPart) return;

      const urlParams = new URLSearchParams(queryPart);
      const walletAddressParam = urlParams.get("walletAddress");
      const investmentIdParam = urlParams.get("investmentId");

      if (typeof window !== "undefined") {
        if (walletAddressParam) {
          const cleanWallet = walletAddressParam.replace(/["']/g, "").trim();
          if (/^0x[a-fA-F0-9]{40}$/.test(cleanWallet)) {
            sessionStorage.setItem(
              "target_wallet_address",
              cleanWallet.toLowerCase(),
            );
            sessionStorage.setItem(
              "cached_walletAddress",
              cleanWallet.toLowerCase(),
            );
          }
        }

        if (investmentIdParam) {
          const cleanInvestment = investmentIdParam.replace(/["']/g, "").trim();
          if (/^[0-9a-fA-F-]{36}$/.test(cleanInvestment)) {
            sessionStorage.setItem("active_investment_id", cleanInvestment);
            sessionStorage.setItem("cached_investmentId", cleanInvestment);
          }
        }
      }
    } catch (err) {
      console.error("Failed to parse callback context:", err);
    }
  }, [searchParams]);

  const {
    register,
    handleSubmit,
    getValues,
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
      const user = response?.user;

      if (!user || !user.role) {
        setError("Invalid server response. Please try again.");
        setIsSubmitting(false);
        return;
      }

      const rawCallbackUrl = getCallbackUrl();
      const callbackUrl = getSafeCallbackUrl(rawCallbackUrl);

      setSuccess("Login successful");

      sessionStorage.setItem("webview_authenticated", "true");
      if (callbackUrl) {
        sessionStorage.setItem("persisted_callback_url", callbackUrl);
      }

      await new Promise((resolve) => setTimeout(resolve, 300));

      if (callbackUrl) {
        window.location.replace(callbackUrl);
        return;
      }

      switch (user.role) {
        case "INVESTOR":
          window.location.replace("/investor");
          break;
        case "PARTNER":
          window.location.replace("/partner");
          break;
        case "ADMIN":
          window.location.replace("/admin");
          break;
        default:
          setError("Unknown user role. Contact support.");
          setIsSubmitting(false);
      }
    } catch (err: any) {
      console.error("Login error:", err?.message || err);
      setError(getFriendlyErrorMessage(err?.message || ""));
      setIsSubmitting(false);
    }
  };

  // --- Forgot Password Handlers ---
  const handleOpenForgotModal = () => {
    const currentEmail = getValues("email");
    if (currentEmail) {
      setResetEmail(currentEmail);
    }
    setForgotStep("REQUEST");
    setOtpToken("");
    setNewPassword("");
    setForgotError("");
    setForgotSuccess("");
    setIsForgotModalOpen(true);
  };

  const handleRequestResetCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError("");
    setForgotSuccess("");

    if (!resetEmail || !resetEmail.includes("@")) {
      setForgotError("Please enter a valid email address.");
      return;
    }

    try {
      setIsForgotLoading(true);
      const res = await fetch(`${API_HOST}/users/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: resetEmail.trim().toLowerCase() }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to send reset code.");
      }

      setForgotSuccess("Verification code sent to your email.");
      setForgotStep("RESET");
    } catch (err: any) {
      setForgotError(getFriendlyErrorMessage(err?.message || ""));
    } finally {
      setIsForgotLoading(false);
    }
  };

  const handleSubmitNewPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError("");
    setForgotSuccess("");

    if (!otpToken || otpToken.trim().length < 4) {
      setForgotError("Please enter a valid verification code.");
      return;
    }
    if (!newPassword || newPassword.length < 6) {
      setForgotError("New password must be at least 6 characters long.");
      return;
    }

    try {
      setIsForgotLoading(true);
      const res = await fetch(`${API_HOST}/users/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: resetEmail.trim().toLowerCase(),
          token: otpToken.trim(),
          newPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to reset password.");
      }

      setForgotSuccess("Password reset successfully! You can now log in.");
      setTimeout(() => {
        setIsForgotModalOpen(false);
      }, 2000);
    } catch (err: any) {
      setForgotError(getFriendlyErrorMessage(err?.message || ""));
    } finally {
      setIsForgotLoading(false);
    }
  };

  return (
    <section className={styles.authCard}>
      <div className={styles.badge}>
        <ShieldCheck size={13} color="#059669" />
        <span>Secure Protocol Portal</span>
      </div>

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
              autoComplete="email"
              disabled={isSubmitting}
            />
            {errors.email && (
              <span className={styles.error}>{errors.email.message}</span>
            )}
          </label>

          <div className={styles.field}>
            <span
              style={{
                display: "block",
                fontSize: "13px",
                fontWeight: 500,
                color: "#374151",
                marginBottom: "6px",
              }}
            >
              Password
            </span>
            <input
              {...register("password")}
              type="password"
              placeholder="Enter password"
              className={styles.fieldInput}
              autoComplete="current-password"
              disabled={isSubmitting}
            />
            {errors.password && (
              <span className={styles.error}>{errors.password.message}</span>
            )}
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginTop: "-4px",
            }}
          >
            <button
              type="button"
              onClick={handleOpenForgotModal}
              style={{
                background: "none",
                border: "none",
                color: "#059669",
                fontSize: "12px",
                fontWeight: 600,
                cursor: "pointer",
                padding: 0,
              }}
            >
              Forgot Password?
            </button>
          </div>

          <button
            className={styles.primary}
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              "Authenticating..."
            ) : (
              <>
                <span>Login</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>

          <p className={styles.note}>
            Don’t have an account?{" "}
            <Link href="/auth/signup" className={styles.link}>
              Create Account
            </Link>
          </p>
        </form>
      </div>

      {/* --- Forgot Password Modal --- */}
      {isForgotModalOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(2, 11, 7, 0.85)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
            padding: "20px",
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: "400px",
              backgroundColor: "#051610",
              borderRadius: "20px",
              border: "1px solid rgba(16, 185, 129, 0.3)",
              padding: "24px",
              boxShadow: "0 10px 25px rgba(0,0,0,0.5)",
            }}
          >
            <h2
              style={{
                color: "#F0FDF4",
                fontSize: "18px",
                fontWeight: "700",
                marginBottom: "6px",
              }}
            >
              {forgotStep === "REQUEST"
                ? "Reset Password"
                : "Enter Verification Code"}
            </h2>
            <p
              style={{
                color: "#94A3B8",
                fontSize: "12px",
                marginBottom: "20px",
                lineHeight: "18px",
              }}
            >
              {forgotStep === "REQUEST"
                ? "Enter your registered email address to receive a password reset verification code."
                : `Enter the 6-digit code sent to ${resetEmail} and choose a new password.`}
            </p>

            {forgotError && (
              <div style={{ marginBottom: "12px" }}>
                <Alert
                  type="error"
                  message={forgotError}
                  onClose={() => setForgotError("")}
                />
              </div>
            )}
            {forgotSuccess && (
              <div style={{ marginBottom: "12px" }}>
                <Alert
                  type="success"
                  message={forgotSuccess}
                  onClose={() => setForgotSuccess("")}
                />
              </div>
            )}

            {forgotStep === "REQUEST" ? (
              <form onSubmit={handleRequestResetCode}>
                <label
                  className={styles.field}
                  style={{ marginBottom: "16px", color: "#F0FDF4" }}
                >
                  Email Address
                  <input
                    type="email"
                    placeholder="name@email.com"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    className={styles.fieldInput}
                    autoComplete="email"
                    disabled={isForgotLoading}
                    required
                  />
                </label>

                <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
                  <button
                    type="button"
                    onClick={() => setIsForgotModalOpen(false)}
                    disabled={isForgotLoading}
                    style={{
                      flex: 1,
                      backgroundColor: "#082017",
                      borderRadius: "12px",
                      padding: "12px",
                      border: "1px solid rgba(16, 185, 129, 0.2)",
                      color: "#94A3B8",
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isForgotLoading}
                    style={{
                      flex: 1,
                      backgroundColor: "#34D399",
                      borderRadius: "12px",
                      padding: "12px",
                      border: "none",
                      color: "#020B07",
                      fontWeight: 800,
                      cursor: "pointer",
                    }}
                  >
                    {isForgotLoading ? "Sending..." : "Send Code"}
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleSubmitNewPassword}>
                <label
                  className={styles.field}
                  style={{ marginBottom: "12px", color: "#F0FDF4" }}
                >
                  Verification Code / Token
                  <input
                    type="text"
                    placeholder="123456"
                    value={otpToken}
                    onChange={(e) => setOtpToken(e.target.value)}
                    className={styles.fieldInput}
                    autoComplete="one-time-code"
                    disabled={isForgotLoading}
                    required
                  />
                </label>

                <label
                  className={styles.field}
                  style={{ marginBottom: "16px", color: "#F0FDF4" }}
                >
                  New Password (Min 6 chars)
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className={styles.fieldInput}
                    autoComplete="new-password"
                    disabled={isForgotLoading}
                    required
                  />
                </label>

                <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
                  <button
                    type="button"
                    onClick={() => setIsForgotModalOpen(false)}
                    disabled={isForgotLoading}
                    style={{
                      flex: 1,
                      backgroundColor: "#082017",
                      borderRadius: "12px",
                      padding: "12px",
                      border: "1px solid rgba(16, 185, 129, 0.2)",
                      color: "#94A3B8",
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isForgotLoading}
                    style={{
                      flex: 1,
                      backgroundColor: "#34D399",
                      borderRadius: "12px",
                      padding: "12px",
                      border: "none",
                      color: "#020B07",
                      fontWeight: 800,
                      cursor: "pointer",
                    }}
                  >
                    {isForgotLoading ? "Updating..." : "Reset Password"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
}

export default function LoginForm() {
  return <LoginFormContent />;
}
