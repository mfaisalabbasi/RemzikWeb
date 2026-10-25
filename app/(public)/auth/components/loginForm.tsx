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

  return "An unexpected error occurred during login. Please try again.";
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

          <label className={styles.field}>
            Password
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
          </label>

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
    </section>
  );
}

export default function LoginForm() {
  return <LoginFormContent />;
}
