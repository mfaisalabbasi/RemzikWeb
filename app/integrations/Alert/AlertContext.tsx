"use client";

import { createContext, useContext, useState, useCallback } from "react";
import styles from "./Alert.module.css";
import { FiAlertCircle, FiCheckCircle, FiInfo, FiX } from "react-icons/fi";

type AlertType = "success" | "error" | "info";

interface AlertItem {
  id: number;
  type: AlertType;
  message: string;
}

interface AlertContextType {
  showAlert: (type: AlertType, message: string) => void;
}

const AlertContext = createContext<AlertContextType | null>(null);

export const useAlert = () => {
  const ctx = useContext(AlertContext);
  if (!ctx) throw new Error("useAlert must be used inside AlertProvider");
  return ctx;
};

export const AlertProvider = ({ children }: { children: React.ReactNode }) => {
  const [alerts, setAlerts] = useState<AlertItem[]>([]);

  const removeAlert = useCallback((id: number) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  }, []);

  const showAlert = (type: AlertType, message: string) => {
    const id = Date.now();
    setAlerts((prev) => [...prev, { id, type, message }]);

    // 5 seconds is better for complex financial error messages
    setTimeout(() => {
      removeAlert(id);
    }, 5000);
  };

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}

      <div className={styles.alertContainer}>
        {alerts.map((a) => {
          const Icon =
            a.type === "success"
              ? FiCheckCircle
              : a.type === "error"
                ? FiAlertCircle
                : FiInfo;

          return (
            <div key={a.id} className={`${styles.alert} ${styles[a.type]}`}>
              <div className={styles.left}>
                <div className={styles.iconWrapper}>
                  <Icon size={18} strokeWidth={2.5} />
                </div>
                <span>{a.message}</span>
              </div>

              <button
                className={styles.close}
                onClick={() => removeAlert(a.id)}
                aria-label="Close"
              >
                <FiX size={14} />
              </button>
            </div>
          );
        })}
      </div>
    </AlertContext.Provider>
  );
};
