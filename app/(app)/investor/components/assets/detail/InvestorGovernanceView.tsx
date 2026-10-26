"use client";

import React, { useState, useEffect, useCallback } from "react";
import { ethers } from "ethers";
import {
  X,
  Loader2,
  ShieldCheck,
  Scale,
  ExternalLink,
  AlertTriangle,
} from "lucide-react";
import api from "@/app/integrations/lib/axios";
import { useAppWallet } from "@/app/integrations/context/WalletContext";
import styles from "./Invest.module.css";

interface Proposal {
  id: string;
  proposalId: number;
  description: string;
  status: "ACTIVE" | "PENDING" | "EXECUTED" | "LIQUIDATED";
  txHash?: string;
}

interface InvestorGovernanceProps {
  asset: any;
}

export const InvestorGovernanceView = ({ asset }: InvestorGovernanceProps) => {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isVoting, setIsVoting] = useState<number | null>(null);

  // 🚀 Shared Secure Enclave Iframe Signer State
  const [signUrl, setSignUrl] = useState<string | null>(null);
  const [activeProposalId, setActiveProposalId] = useState<number | null>(null);

  const { userWalletAddress } = useAppWallet();

  const assetId = asset?.id || asset?._id;
  const govAddress =
    asset?.governanceAddress ||
    asset?.governanceContract ||
    asset?.governance_address;

  const fetchProposals = useCallback(async () => {
    if (!assetId) {
      setLoading(false);
      setErrorMsg("Asset ID is missing.");
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    const rawBase =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";
    const normalizedBase = rawBase.endsWith("/api")
      ? rawBase
      : `${rawBase}/api`;
    const apiUrl = `${normalizedBase}/governance/${assetId}/proposals`;

    try {
      const res = await fetch(apiUrl);
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Failed to fetch proposals: ${res.status} ${text}`);
      }
      const data = await res.json();
      setProposals(Array.isArray(data) ? data : data.proposals || []);
    } catch (err: any) {
      console.error("Governance fetch error:", err);
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  }, [assetId]);

  useEffect(() => {
    fetchProposals();
  }, [fetchProposals]);

  // 🚀 Listen for postMessage events from the /auth/sign iframe
  useEffect(() => {
    const handleMessage = async (event: MessageEvent) => {
      try {
        let data = event.data;
        if (typeof data === "string") {
          try {
            data = JSON.parse(data);
          } catch {
            return;
          }
        }

        if (!data || typeof data !== "object") return;

        if (
          data.type === "VOTE_SUCCESS" ||
          data.type === "CLAIM_SUCCESS" ||
          data.type === "TRANSACTION_COMPLETE" ||
          data.type === "SIGN_SUCCESS" ||
          data.type === "TX_SUCCESS"
        ) {
          setSignUrl(null);
          setIsVoting(null);
          setActiveProposalId(null);
          await fetchProposals();
        } else if (data.type === "VOTE_FAILED" || data.type === "TX_FAILED") {
          setSignUrl(null);
          setIsVoting(null);
          setActiveProposalId(null);
          alert(
            `Voting Failed: ${data.error || "User cancelled or transaction reverted."}`,
          );
        } else if (data.type === "CLOSE_MODAL") {
          setSignUrl(null);
          setIsVoting(null);
          setActiveProposalId(null);
          await fetchProposals();
        }
      } catch (err) {
        // Ignore unrelated window postMessages
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [fetchProposals]);

  const castVote = async (onChainProposalId: number, support: boolean) => {
    if (!govAddress) {
      return alert("❌ Governance contract address is missing for this asset.");
    }

    setIsVoting(onChainProposalId);
    setActiveProposalId(onChainProposalId);

    try {
      // 1. Fetch fresh Privy custom token from backend API
      const tokenRes = await api.get("/auth/privy-token", {
        withCredentials: true,
      });
      const token = tokenRes.data?.privyCustomToken || tokenRes.data?.token;

      if (!token) {
        throw new Error("Failed to authenticate secure signing session.");
      }

      // 2. Encode governance vote call data
      const iface = new ethers.Interface([
        "function vote(uint256 _proposalId, bool _support) external",
      ]);
      const callData = iface.encodeFunctionData("vote", [
        onChainProposalId,
        support,
      ]);

      const targetChainId = Number(
        process.env.NEXT_PUBLIC_TARGET_CHAIN_ID || 31337,
      );

      const txPayload = {
        to: govAddress,
        data: callData,
        value: "0x0",
        chainId: targetChainId,
      };

      const encodedPayload = encodeURIComponent(JSON.stringify({ txPayload }));

      // 3. Construct URL matching the enclave parameters
      let url =
        `/auth/sign` +
        `?proposalId=${onChainProposalId}` +
        `&payload=${encodedPayload}` +
        `&contractAddress=${encodeURIComponent(govAddress)}` +
        `&autoAuth=true`;

      if (userWalletAddress) {
        url += `&walletAddress=${encodeURIComponent(userWalletAddress)}`;
      }
      if (token) {
        url += `&token=${encodeURIComponent(token)}`;
      }

      // 4. Open embedded iframe enclave modal
      setSignUrl(url);
    } catch (err: any) {
      console.error("Governance Voting Setup Failed:", err);
      alert(`❌ Could not prepare vote transaction: ${err.message || err}`);
      setIsVoting(null);
      setActiveProposalId(null);
    }
  };

  return (
    <>
      <div className={styles.container}>
        <div className={styles.header}>
          <div>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "4px 10px",
                borderRadius: "9999px",
                background: "#ecfdf5",
                border: "1px solid #a7f3d0",
                color: "#059669",
                fontSize: "0.7rem",
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                marginBottom: "8px",
              }}
            >
              <Scale size={12} color="#059669" />
              <span>DAO Module</span>
            </div>
            <h3 className={styles.title}>Asset Governance</h3>
            <p className={styles.subtitle}>
              Participate in operational and emergency decisions for this vault.
            </p>
          </div>
          <span className={styles.statusBadge}>
            {asset?.status || "ACTIVE"}
          </span>
        </div>

        {!govAddress && (
          <div className={styles.warningBox}>
            <AlertTriangle size={16} color="#d97706" />
            <span>
              <strong>Notice:</strong> Governance contract address is not linked
              to this asset object.
            </span>
          </div>
        )}

        <div className={styles.proposalList}>
          {loading ? (
            <div className={styles.loadingState}>
              Synchronizing on-chain proposals...
            </div>
          ) : errorMsg ? (
            <div className={styles.loadingState} style={{ color: "#ef4444" }}>
              Error loading proposals: {errorMsg}
            </div>
          ) : proposals.length > 0 ? (
            proposals.map((p) => {
              const targetId = Number(p.proposalId);
              const isPendingOrActive =
                p.status === "ACTIVE" || p.status === "PENDING";

              return (
                <div key={p.id || targetId} className={styles.proposalCard}>
                  <div className={styles.proposalHeader}>
                    <span className={styles.proposalId}>
                      Proposal #{targetId}
                    </span>
                    <span className={styles.statusBadge}>{p.status}</span>
                  </div>
                  <p className={styles.proposalDesc}>{p.description}</p>

                  {p.txHash && (
                    <div style={{ marginTop: "8px" }}>
                      <a
                        href={`https://etherscan.io/tx/${p.txHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.txLink}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px",
                        }}
                      >
                        <span>View Genesis TX</span>
                        <ExternalLink size={12} />
                      </a>
                    </div>
                  )}

                  {isPendingOrActive && (
                    <div className={styles.votingActions}>
                      <button
                        className={styles.btnApprove}
                        disabled={isVoting === targetId}
                        onClick={() => castVote(targetId, true)}
                      >
                        {isVoting === targetId &&
                        activeProposalId === targetId ? (
                          <span
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "6px",
                            }}
                          >
                            <Loader2 size={14} className="animate-spin" />{" "}
                            Signing...
                          </span>
                        ) : (
                          "Vote FOR"
                        )}
                      </button>
                      <button
                        className={styles.btnReject}
                        disabled={isVoting === targetId}
                        onClick={() => castVote(targetId, false)}
                      >
                        {isVoting === targetId &&
                        activeProposalId === targetId ? (
                          <span
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "6px",
                            }}
                          >
                            <Loader2 size={14} className="animate-spin" />{" "}
                            Signing...
                          </span>
                        ) : (
                          "Vote AGAINST"
                        )}
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className={styles.emptyState}>
              No active governance proposals found for asset ID: {assetId}.
            </div>
          )}
        </div>

        <div className={styles.footer}>
          <span className={styles.contractMeta}>Pod Contract Address:</span>
          <code className={styles.codeBadge}>{govAddress || "Not Linked"}</code>
        </div>
      </div>

      {/* 🚀 Shared Institutional White/Emerald Secure Enclave Iframe Overlay */}
      {signUrl && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 99999,
            backgroundColor: "rgba(15, 23, 42, 0.75)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: "460px",
              height: "640px",
              backgroundColor: "#ffffff",
              borderRadius: "24px",
              border: "1px solid #e2e8f0",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              position: "relative",
              fontFamily: "Plus Jakarta Sans, sans-serif",
            }}
          >
            {/* Modal Header Bar */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "16px 20px",
                borderBottom: "1px solid #f1f5f9",
                backgroundColor: "#f8fafc",
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <span
                  style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    backgroundColor: "#059669",
                    boxShadow: "0 0 8px rgba(5, 150, 105, 0.5)",
                  }}
                />
                <ShieldCheck size={14} color="#059669" />
                <span
                  style={{
                    color: "#0f172a",
                    fontSize: "11px",
                    fontWeight: "800",
                    letterSpacing: "0.5px",
                    textTransform: "uppercase",
                  }}
                >
                  Secure DAO Signer
                </span>
              </div>

              <button
                onClick={() => {
                  setSignUrl(null);
                  setIsVoting(null);
                  setActiveProposalId(null);
                }}
                style={{
                  background: "#ffffff",
                  border: "1px solid #cbd5e1",
                  color: "#475569",
                  padding: "5px 10px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  fontSize: "12px",
                  fontWeight: "700",
                  transition: "all 0.2s ease",
                }}
              >
                <X size={14} /> Close
              </button>
            </div>

            <iframe
              src={signUrl}
              style={{
                flex: 1,
                border: "none",
                width: "100%",
                height: "100%",
                backgroundColor: "#ffffff",
              }}
              title="DAO Governance Signer"
            />
          </div>
        </div>
      )}
    </>
  );
};
