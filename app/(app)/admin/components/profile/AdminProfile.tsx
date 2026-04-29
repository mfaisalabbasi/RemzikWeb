import styles from "./profile.module.css";

export const AdminProfile = ({ user }: { user: any }) => {
  if (!user) return <div className={styles.card}>Loading Identity...</div>;
  console.log("fucking user", user);
  return (
    <div className={styles.card}>
      <div className={styles.cardTitle}>
        Account Identity
        <span className={styles.badge}>{user.role || "Admin"}</span>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "1.5rem",
        }}
      >
        <div>
          <label
            style={{ fontSize: "0.75rem", color: "#64748b", fontWeight: 600 }}
          >
            FULL NAME
          </label>
          {/* DYNAMIC VALUE */}
          <p style={{ fontSize: "1rem", color: "#0f172a", margin: "0.2rem 0" }}>
            {user.name}
          </p>
        </div>
        <div>
          <label
            style={{ fontSize: "0.75rem", color: "#64748b", fontWeight: 600 }}
          >
            PRIMARY EMAIL
          </label>
          {/* DYNAMIC VALUE */}
          <p style={{ fontSize: "1rem", color: "#0f172a", margin: "0.2rem 0" }}>
            {user.email}
          </p>
        </div>
      </div>

      {/* Visual indicator for Security Level */}
      <div
        style={{
          marginTop: "1.5rem",
          paddingTop: "1rem",
          borderTop: "1px solid #f1f5f9",
        }}
      >
        <span
          style={{
            fontSize: "0.8rem",
            color: user.twoFactorEnabled ? "#059669" : "#dc2626",
          }}
        >
          {user.twoFactorEnabled ? "✓ 2FA Protected" : "⚠ 2FA Recommended"}
        </span>
      </div>
    </div>
  );
};
