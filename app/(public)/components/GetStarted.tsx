"use client";

import React, { useState } from "react";
import GetStartedModal from "./GetStartedModal";
import styles from "@/app/(public)/styles/GetStartedCTA.module.css";
import { ArrowRight } from "lucide-react";

export default function GetStartedCTA() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button className={styles.button} onClick={() => setOpen(true)}>
        <span>Get Started</span>
        {/* <ArrowRight size={15} className={styles.arrowIcon} /> */}
      </button>

      <GetStartedModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
