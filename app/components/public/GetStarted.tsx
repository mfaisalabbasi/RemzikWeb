"use client";
import React from "react";
import { useState } from "react";
import GetStartedModal from "./GetStartedModal";
import styles from "@/app/styles/GetStartedCTA.module.css";

export default function GetStartedCTA() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button className={styles.button} onClick={() => setOpen(true)}>
        Get Started
      </button>

      <GetStartedModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
