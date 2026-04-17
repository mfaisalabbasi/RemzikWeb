import styles from "./assets.module.css";

export const AssetProgressModule = () => {
  // Mock data - replace with actual state
  const tokenProgress = 65; // Percentage funded
  const lifecycleStage = 2; // 0=Posted, 1=KYC, 2=Tokenized, 3=Active

  return (
    <div className={styles.card}>
      <h3>Capital & Tokenization Progress</h3>

      {/* 1. Funding Progress Bar */}
      <div style={{ marginBottom: "1.5rem" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: "0.8rem",
            marginBottom: "0.5rem",
          }}
        >
          <span>Funding Progress</span>
          <span style={{ fontWeight: 700 }}>{tokenProgress}%</span>
        </div>
        <div
          style={{
            height: "10px",
            background: "#e2e8f0",
            borderRadius: "5px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${tokenProgress}%`,
              height: "100%",
              background: "#2563eb",
            }}
          ></div>
        </div>
      </div>

      {/* 2. Lifecycle Progress */}
      <div style={{ display: "flex", gap: "0.5rem" }}>
        {["Originated", "KYC", "Tokenized", "Live"].map((stage, i) => (
          <div key={stage} style={{ flex: 1 }}>
            <div
              style={{
                height: "6px",
                borderRadius: "3px",
                background: i <= lifecycleStage ? "#059669" : "#e2e8f0",
              }}
            ></div>
            <div
              style={{
                fontSize: "0.65rem",
                marginTop: "0.4rem",
                color: i <= lifecycleStage ? "#059669" : "#94a3b8",
              }}
            >
              {stage}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
