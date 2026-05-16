"use client";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  ShieldAlert,
  ArrowRight,
  X,
  CloudUpload,
  Loader2,
  CheckCircle2,
  Info,
} from "lucide-react";
import api from "@/app/integrations/lib/axios";
import styles from "./Dashboard.module.css";

export default function KycAlert({ user }: { user: any }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [mounted, setMounted] = useState(false);

  const [files, setFiles] = useState<{
    idDocument: File | null;
    addressProof: File | null;
  }>({
    idDocument: null,
    addressProof: null,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const kyc = user?.kyc;
  if (kyc?.status !== "REJECTED") return null;

  const handleResubmit = async () => {
    if (!files.idDocument || !files.addressProof) return;

    setIsUploading(true);
    const formData = new FormData();

    // MUST match your SubmitKycDto requirements
    formData.append("fullName", user.fullName || "User");
    formData.append("dob", user.dob || "1990-01-01");
    formData.append("idDocument", files.idDocument);
    formData.append("addressProof", files.addressProof);

    try {
      // POST /kyc/submit as per your KycController
      await api.post("/kyc/submit", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      window.location.reload();
    } catch (err: any) {
      console.error("KYC Vault Error:", err.response?.data);
      setIsUploading(false);
      alert(err.response?.data?.message || "Verification sync failed.");
    }
  };

  if (!mounted) return null;

  return (
    <>
      {/* --- INSTITUTIONAL BANNER --- */}
      <div className={styles.alertContainer}>
        <div className={styles.accentLine} />
        <div className={styles.contentWrapper}>
          <div className={styles.infoSection}>
            <div className={styles.iconBox}>
              <ShieldAlert size={28} strokeWidth={2.5} />
            </div>
            <div className={styles.textStack}>
              <span className={styles.statusLabel}>Compliance Notice</span>
              <h3 className={styles.title}>Identity Verification Failed</h3>
              <div className={styles.reasonText}>
                <Info size={14} />
                <span>
                  {kyc.rejectionReason ||
                    "Documents provided do not meet standards."}
                </span>
              </div>
            </div>
          </div>
          <div className={styles.actionSection}>
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className={styles.reverifyBtn}
            >
              Re-verify Account <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* --- SECURE VAULT MODAL (PORTAL) --- */}
      {isModalOpen &&
        createPortal(
          <div
            className={styles.modalOverlay}
            onClick={() => setIsModalOpen(false)}
          >
            <div
              className={styles.modalContent}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={styles.modalHeader}>
                <div>
                  <h2 className={styles.modalTitle}>Secure Vault</h2>
                  <p className={styles.modalSubtitle}>
                    Update your institutional identity assets
                  </p>
                </div>
                <button
                  className={styles.closeBtn}
                  onClick={() => setIsModalOpen(false)}
                >
                  <X size={20} />
                </button>
              </div>

              <div className={styles.modalBody}>
                {/* ID Document Slot */}
                <div className={styles.fileSlot}>
                  <label className={styles.inputLabel}>
                    1. Government ID (Passport/National ID)
                  </label>
                  <div className={styles.dropzone}>
                    <input
                      type="file"
                      onChange={(e) =>
                        setFiles({
                          ...files,
                          idDocument: e.target.files?.[0] || null,
                        })
                      }
                      className={styles.hiddenInput}
                    />
                    <div className={styles.dropzoneContent}>
                      {files.idDocument ? (
                        <CheckCircle2 className="text-emerald-500" />
                      ) : (
                        <CloudUpload className="text-slate-300" />
                      )}
                      <span>
                        {files.idDocument
                          ? files.idDocument.name
                          : "Select ID File"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Address Slot */}
                <div className={styles.fileSlot}>
                  <label className={styles.inputLabel}>
                    2. Proof of Residence (Utility Bill)
                  </label>
                  <div className={styles.dropzone}>
                    <input
                      type="file"
                      onChange={(e) =>
                        setFiles({
                          ...files,
                          addressProof: e.target.files?.[0] || null,
                        })
                      }
                      className={styles.hiddenInput}
                    />
                    <div className={styles.dropzoneContent}>
                      {files.addressProof ? (
                        <CheckCircle2 className="text-emerald-500" />
                      ) : (
                        <CloudUpload className="text-slate-300" />
                      )}
                      <span>
                        {files.addressProof
                          ? files.addressProof.name
                          : "Select Address Proof"}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  className={styles.submitBtn}
                  onClick={handleResubmit}
                  disabled={
                    isUploading || !files.idDocument || !files.addressProof
                  }
                >
                  {isUploading ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="animate-spin" size={18} />
                      Syncing with Vault...
                    </div>
                  ) : (
                    "Finalize & Re-submit"
                  )}
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
