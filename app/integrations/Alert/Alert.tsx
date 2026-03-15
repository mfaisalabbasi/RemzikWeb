"use client";

import styles from "./Alert.module.css";
import { FiAlertCircle, FiCheckCircle, FiInfo, FiX } from "react-icons/fi";

interface Props {
  type?: "error" | "success" | "info";
  message: string;
  onClose?: () => void;
}

export default function Alert({ type = "error", message, onClose }: Props) {
  const Icon =
    type === "error"
      ? FiAlertCircle
      : type === "success"
        ? FiCheckCircle
        : FiInfo;

  return (
    <div className={`${styles.alert} ${styles[type]}`}>
      <div className={styles.left}>
        <Icon size={18} />
        <span>{message}</span>
      </div>

      {onClose && (
        <button onClick={onClose} className={styles.close}>
          <FiX size={16} />
        </button>
      )}
    </div>
  );
}
