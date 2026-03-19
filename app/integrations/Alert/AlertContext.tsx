"use client";

import { createContext, useContext, useState, useCallback } from "react";
import styles from "./Alert.module.css"; // Ensure path is correct

type AlertType = "success" | "error" | "info";

interface Alert {
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

export const AlertProvider = ({ children }: any) => {
  const [alerts, setAlerts] = useState<Alert[]>([]);

  const removeAlert = useCallback((id: number) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  }, []);

  const showAlert = (type: AlertType, message: string) => {
    const id = Date.now();
    setAlerts((prev) => [...prev, { id, type, message }]);

    // Auto-remove after 4 seconds to give users time to read
    setTimeout(() => {
      removeAlert(id);
    }, 4000);
  };

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}

      {/* FIXED CONTAINER FOR ALERTS */}
      <div
        style={{
          position: "fixed",
          top: "20px",
          left: "50%",
          transform: "translateX(-50%)", // Perfect horizontal centering
          zIndex: 9999,
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          width: "100%",
          maxWidth: "400px", // Limits width on desktop so it doesn't look too stretched
          padding: "0 20px", // Prevents touching screen edges on mobile
          pointerEvents: "none",
        }}
      >
        {alerts.map((a) => (
          <div key={a.id} className={`${styles.alert} ${styles[a.type]}`}>
            <div className={styles.left}>
              {/* Optional: Add icons here based on a.type */}
              <span>{a.message}</span>
            </div>

            <button
              className={styles.close}
              onClick={() => removeAlert(a.id)}
              aria-label="Close"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </AlertContext.Provider>
  );
};
