"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import styles from "@/app/(public)/styles/GetStartedModal.module.css";

interface ModalProps {
  open: boolean;
  onClose: () => void;
}

export default function GetStartedModal({ open, onClose }: ModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  // Prevent background scroll
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [open]);

  // ESC to close
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (open) window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  if (!mounted || !open) return null;

  const handleNavigate = () => {
    onClose();
  };

  return createPortal(
    <div
      className={styles.backdrop}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Close */}
        <button className={styles.close} onClick={onClose}>
          ×
        </button>

        {/* Header */}
        <h2 className={styles.heading}>Get Started</h2>
        <p className={styles.subheading}>
          Secure access to the Remzic Protocol platform. Authenticate to
          continue and configure your investor or partner profile.
        </p>

        {/* Single Card Layout */}
        <div className={`${styles.cards} ${styles.single}`}>
          <div className={styles.card}>
            <h3>Platform Access</h3>

            <p>
              Sign in securely to access the Remzik ecosystem. Configure your
              investor or partner profile after authentication.
            </p>

            <div className={styles.actions}>
              <Link
                href="/auth/login"
                onClick={handleNavigate}
                className={styles.primary}
              >
                Login
              </Link>

              <Link
                href="/auth/signup"
                onClick={handleNavigate}
                className={styles.secondary}
              >
                Create Account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
