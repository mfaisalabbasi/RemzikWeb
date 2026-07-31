"use client";

import { useEffect, useState } from "react";
import styles from "./RecoveryModule.module.css";
import RecoveryVerificationWizard from "./RecoveryVerificationWizard";

export interface RecoveryRequest {
  id: string;
  status:
    | "PENDING_DOCUMENTS"
    | "UNDER_REVIEW"
    | "APPROVED"
    | "PROCESSING_BLOCKCHAIN"
    | "COMPLETED"
    | "REJECTED";
  createdAt: string;
  referenceNumber: string;
  oldWallet: string;
  newWallet?: string;
  reason?: string;
}

export default function RecoveryCenter() {
  const [request, setRequest] = useState<RecoveryRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [successScreen, setSuccessScreen] = useState(false);

  useEffect(() => {
    fetchStatus();
  }, []);

  const fetchStatus = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/recovery/status`,
        {
          credentials: "include",
        },
      );
      if (res.ok) {
        const data = await res.json();
        const activeRequest =
          data?.request || (Array.isArray(data) ? data[0] : null);
        setRequest(activeRequest);
      }
    } catch (err) {
      console.error("Failed to load recovery status", err);
    } finally {
      setLoading(false);
    }
  };

  const handleStartRecovery = async () => {
    try {
      setIsInitializing(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/recovery/request`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            reason: "Loss of device/privy access",
            oldWallet: "dummy",
            newWallet: "dummy",
          }),
        },
      );

      const data = await res.json();
      if (!res.ok) {
        throw new Error(
          data.message || "Failed to initialize recovery request",
        );
      }

      const createdRequest = data.request || data;
      setRequest(createdRequest);
      setShowConfirmModal(false);
      setIsVerifying(true);
    } catch (err: any) {
      alert(err.message || "Initialization error");
    } finally {
      setIsInitializing(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingState}>
        <span>Loading Recovery Center...</span>
      </div>
    );
  }

  // View 1: Active Verification Wizard
  if (isVerifying && request) {
    return (
      <RecoveryVerificationWizard
        requestId={request.id}
        onComplete={() => {
          setIsVerifying(false);
          setSuccessScreen(true);
          fetchStatus();
        }}
        onCancel={() => setIsVerifying(false)}
      />
    );
  }

  // View 2: Post-Submission Confirmation Screen
  if (successScreen && request) {
    return (
      <div className={styles.container}>
        <div className={styles.successCard}>
          <div className={styles.successIcon}>✓</div>
          <h3>Recovery Package Submitted</h3>
          <p className={styles.subtext}>
            Your identity verification package has been securely transmitted for
            compliance review.
          </p>

          <div className={styles.successMeta}>
            <div>
              <span>Status:</span>
              <strong style={{ color: "#f59e0b" }}>UNDER REVIEW</strong>
            </div>
            <div>
              <span>Est. Review Time:</span>
              <strong>1–3 business days</strong>
            </div>
            <div>
              <span>Reference Number:</span>
              <strong className={styles.mono}>
                {request.referenceNumber || `#REC-${request.id.slice(0, 8)}`}
              </strong>
            </div>
          </div>

          <button
            className={styles.primaryButton}
            onClick={() => {
              setSuccessScreen(false);
              fetchStatus();
            }}
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {!request ? (
        // View 3: Idle State (No Active Recovery)
        <div className={styles.idleCard}>
          <div className={styles.shieldIcon}>🛡️</div>
          <h3>Wallet Recovery Center</h3>
          <p>
            If you have permanently lost access to your embedded wallet,
            initiate a secure, compliance-backed recovery workflow to reinstate
            your asset holdings.
          </p>
          <button
            className={styles.primaryButton}
            onClick={() => setShowConfirmModal(true)}
          >
            Start Recovery Workflow
          </button>
        </div>
      ) : (
        // View 4: Status & Timeline View
        <div className={styles.statusCard}>
          <div className={styles.headerRow}>
            <div>
              <span className={styles.label}>Reference Number</span>
              <h4 className={styles.refNum}>
                {request.referenceNumber || `#REC-${request.id.slice(0, 8)}`}
              </h4>
            </div>
            <span
              className={`${styles.badge} ${
                styles[request.status?.toLowerCase()] || styles.pending
              }`}
            >
              {request.status?.replace(/_/g, " ")}
            </span>
          </div>

          <div className={styles.timeline}>
            <TimelineStep
              title="Pending Docs"
              active={request.status === "PENDING_DOCUMENTS"}
              passed={[
                "UNDER_REVIEW",
                "APPROVED",
                "PROCESSING_BLOCKCHAIN",
                "COMPLETED",
              ].includes(request.status)}
            />
            <TimelineStep
              title="Review"
              active={request.status === "UNDER_REVIEW"}
              passed={[
                "APPROVED",
                "PROCESSING_BLOCKCHAIN",
                "COMPLETED",
              ].includes(request.status)}
            />
            <TimelineStep
              title="Approved"
              active={request.status === "APPROVED"}
              passed={["PROCESSING_BLOCKCHAIN", "COMPLETED"].includes(
                request.status,
              )}
            />
            <TimelineStep
              title="Processing"
              active={request.status === "PROCESSING_BLOCKCHAIN"}
              passed={request.status === "COMPLETED"}
            />
            <TimelineStep
              title="Completed"
              active={request.status === "COMPLETED"}
              passed={false}
              isLast
            />
          </div>

          <div className={styles.detailsGrid}>
            <div>
              <label>Initiated On</label>
              <p>
                {request.createdAt
                  ? new Date(request.createdAt).toLocaleDateString()
                  : "N/A"}
              </p>
            </div>
            <div>
              <label>Target Wallet</label>
              <p className={styles.mono}>
                {request.newWallet && request.newWallet !== "dummy"
                  ? request.newWallet
                  : "0x_secured_enclave"}
              </p>
            </div>
          </div>

          {request.status === "PENDING_DOCUMENTS" && (
            <div className={styles.actionPrompt}>
              <p>Identity verification documents are required to proceed.</p>
              <button
                className={styles.primaryButton}
                onClick={() => setIsVerifying(true)}
              >
                Continue Verification
              </button>
            </div>
          )}
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h3>Initialize Wallet Recovery</h3>
            <p>
              By starting this process, you confirm that you no longer have
              access to your primary wallet. Compliance approval and identity
              verification will be required.
            </p>
            <div className={styles.estBox}>
              <span>Estimated Review:</span>
              <strong>1–3 business days</strong>
            </div>
            <div className={styles.modalActions}>
              <button
                className={styles.secondaryButton}
                onClick={() => setShowConfirmModal(false)}
                disabled={isInitializing}
              >
                Cancel
              </button>
              <button
                className={styles.primaryButton}
                onClick={handleStartRecovery}
                disabled={isInitializing}
              >
                {isInitializing ? "Initializing..." : "Confirm & Proceed"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function TimelineStep({
  title,
  active,
  passed,
  isLast = false,
}: {
  title: string;
  active: boolean;
  passed: boolean;
  isLast?: boolean;
}) {
  return (
    <div
      className={`${styles.step} ${active ? styles.active : ""} ${
        passed ? styles.passed : ""
      }`}
    >
      <div className={styles.indicator}>{passed ? "✓" : ""}</div>
      <span>{title}</span>
      {!isLast && <div className={styles.line} />}
    </div>
  );
}
