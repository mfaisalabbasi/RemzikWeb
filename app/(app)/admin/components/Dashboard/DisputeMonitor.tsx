"use client";

import React, { useEffect, useState, useCallback } from "react";
import {
  Scale,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowRight,
  User,
  Hash,
  AlertCircle,
} from "lucide-react";
import { useAlert } from "@/app/integrations/Alert/AlertContext";
import styles from "./Dashbaord.module.css";

enum DisputeStatus {
  OPEN = "OPEN",
  UNDER_REVIEW = "UNDER_REVIEW",
  RESOLVED_FAVOR_BUYER = "RESOLVED_FAVOR_BUYER",
  RESOLVED_FAVOR_SELLER = "RESOLVED_FAVOR_SELLER",
}

export function DisputeMonitor() {
  const [disputes, setDisputes] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showAlert } = useAlert();

  const fetchDisputes = useCallback(async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/disputes/admin/all`,
        {
          credentials: "include",
        },
      );
      if (!res.ok) throw new Error("Ledger sync failed");
      const data = await res.json();

      const active = data.filter((d: any) =>
        [DisputeStatus.OPEN, DisputeStatus.UNDER_REVIEW].includes(d.status),
      );
      setDisputes(active);
    } catch (error: any) {
      showAlert("error", error.message);
    } finally {
      setLoading(false);
    }
  }, [showAlert]);

  useEffect(() => {
    fetchDisputes();
  }, [fetchDisputes]);

  const handleResolve = async (id: string, status: DisputeStatus) => {
    const verdict =
      status === DisputeStatus.RESOLVED_FAVOR_BUYER
        ? "REFUND BUYER"
        : "RELEASE TO SELLER";
    const adminNote = prompt(`Official verdict for ${verdict}:`);
    if (!adminNote) return;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/disputes/${id}/resolve`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ status, adminNote }),
        },
      );

      if (!res.ok) throw new Error("Settlement failed on ledger");
      showAlert("success", `Institutional Resolution: ${verdict} Completed`);
      fetchDisputes();
    } catch (err: any) {
      showAlert("error", err.message);
    }
  };

  return (
    <div className={styles.sectionContainer}>
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-4">
          <div className={styles.iconBox}>
            <Scale size={20} />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-slate-800 tracking-tight">
              Remzik Arbitration
            </h3>
            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">
              Global Escrow Settlement
            </p>
          </div>
        </div>
        <div className={styles.statusPill}>
          {disputes.length} PENDING REVIEW
        </div>
      </div>

      <div className="flex flex-col">
        {loading ? (
          <div className="py-12 text-center text-[10px] font-bold text-slate-300 animate-pulse uppercase">
            Syncing...
          </div>
        ) : disputes.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-400 font-medium italic">
            No system friction detected.
          </div>
        ) : (
          disputes.map((dispute: any) => (
            <div key={dispute.id} className={styles.disputeCard}>
              {/* Header: ID and Market Type */}
              <div className={styles.cardHeader}>
                <div className="flex items-center gap-3">
                  <span className={styles.reference}>
                    #{dispute.referenceId?.slice(-8).toUpperCase()}
                  </span>
                  <span className="text-[9px] bg-amber-50 text-amber-600 px-2 py-0.5 rounded font-black italic uppercase">
                    {dispute.type.replace("_", " ")}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-bold uppercase">
                  <Clock size={12} />{" "}
                  {new Date(dispute.createdAt).toLocaleDateString()}
                </div>
              </div>

              {/* Body: Grid split for reason and identity */}
              <div className={styles.cardBody}>
                <div>
                  <p className={styles.label}>Dispute Reason</p>
                  <p className={styles.reasonText}>
                    {dispute.reason || "No detail provided"}
                  </p>
                </div>
                <div>
                  <p className={styles.label}>Case Identity</p>
                  <div className={styles.identityBox}>
                    <User size={14} className="text-slate-400" />
                    <span className="text-[11px] font-mono font-bold text-slate-600">
                      ID: {dispute.userId?.slice(0, 14)}...
                    </span>
                  </div>
                </div>
              </div>

              {/* Footer: Resolution Actions */}
              <div className={styles.footer}>
                <div className="flex items-center gap-2 text-[10px] text-slate-400 italic">
                  <AlertCircle size={12} /> Pending Final Settlement
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() =>
                      handleResolve(
                        dispute.id,
                        DisputeStatus.RESOLVED_FAVOR_BUYER,
                      )
                    }
                    className={`${styles.actionButton} ${styles.refundBtn} group`}
                  >
                    <XCircle size={14} /> REFUND BUYER
                    <ArrowRight
                      size={12}
                      className="opacity-0 group-hover:opacity-100 transition-all"
                    />
                  </button>
                  <button
                    onClick={() =>
                      handleResolve(
                        dispute.id,
                        DisputeStatus.RESOLVED_FAVOR_SELLER,
                      )
                    }
                    className={`${styles.actionButton} ${styles.releaseBtn} group`}
                  >
                    <CheckCircle2 size={14} /> RELEASE TO SELLER
                    <ArrowRight
                      size={12}
                      className="opacity-0 group-hover:opacity-100 transition-all"
                    />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
