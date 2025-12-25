"use client";
import React from "react";
import { useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import styles from "@/app/styles/GetStartedModal.module.css";

interface ModalProps {
  open: boolean;
  onClose: () => void;
}

export default function GetStartedModal({ open, onClose }: ModalProps) {
  const [mounted, setMounted] = React.useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [open]);

  if (!mounted || !open) return null;

  return createPortal(
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.close} onClick={onClose}>
          &times;
        </button>
        <h2 className={styles.heading}>Get Started</h2>
        <p className={styles.subheading}>Choose your role to continue</p>

        <div className={styles.cards}>
          <div className={styles.card}>
            <h3>Investor</h3>
            <p>Access your portfolio, view assets, and invest.</p>
            <Link href="/login?role=investor" className={styles.primary}>
              Login
            </Link>
            <Link href="/signup?role=investor" className={styles.secondary}>
              Sign Up
            </Link>
          </div>

          <div className={styles.card}>
            <h3>Partner</h3>
            <p>Submit assets, track approvals, and manage listings.</p>
            <Link href="/login?role=partner" className={styles.primary}>
              Login
            </Link>
            <Link href="/signup?role=partner" className={styles.secondary}>
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
