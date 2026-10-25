"use client";

import styles from "@/app/(public)/styles/ShariahCard.module.css";
import { ShieldCheck, Scale, FileText, CheckCircle2 } from "lucide-react";

interface ShariahCardProps {
  title: string;
  desc: string;
  index: number;
}

export default function ShariahCard({ title, desc, index }: ShariahCardProps) {
  // Assign icons based on card index/topic
  const getIcon = (idx: number) => {
    switch (idx) {
      case 0:
        return <ShieldCheck size={22} color="#059669" />;
      case 1:
        return <Scale size={22} color="#059669" />;
      case 2:
        return <FileText size={22} color="#059669" />;
      case 3:
        return <CheckCircle2 size={22} color="#059669" />;
      default:
        return <ShieldCheck size={22} color="#059669" />;
    }
  };

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <div className={styles.iconBox}>{getIcon(index)}</div>
        <span className={styles.pillarNumber}>0{index + 1}</span>
      </div>

      <h3 className={styles.title}>{title}</h3>
      <p className={styles.desc}>{desc}</p>
    </div>
  );
}
