"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { ethers } from "ethers";
import {
  Loader2,
  X,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Search,
  SlidersHorizontal,
  ArrowUpRight,
  Sparkles,
  Lock,
  Wallet,
  TrendingUp,
  Building2,
  AlertCircle,
  FileText,
} from "lucide-react";
import api from "@/app/integrations/lib/axios";
import { useAppWallet } from "@/app/integrations/context/WalletContext";
import { useAlert } from "@/app/integrations/Alert/AlertContext";
import styles from "./Distributions.module.css";

interface DistributionItem {
  id: string;
  batchId?: string;
  title: string;
  location: string;
  date: string;
  amount: number;
  currency: string;
  status: "Upcoming" | "Processing" | "Paid" | "Ready";
  distributionMode?: "OFF_CHAIN" | "ON_CHAIN";
  txHash?: string;
  tokenStandard: string;
  yieldRate: string;
  assetType: string;
}

const YIELD_NOTARY_ADDRESS =
  process.env.NEXT_PUBLIC_YIELD_NOTARY_ADDRESS ||
  "0x959922bE3CAee4b8Cd9a407cc3ac1C251C2007B1";

export default function DistributionsPage() {
  const [distributions, setDistributions] = useState<DistributionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState<"ALL" | "READY" | "PAID">(
    "ALL",
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [distributionMode, setDistributionMode] = useState<
    "OFF_CHAIN" | "ON_CHAIN"
  >("OFF_CHAIN");
  const [isSavingPref, setIsSavingPref] = useState(false);

  // Modal & Signer states
  const [selectedItem, setSelectedItem] = useState<DistributionItem | null>(
    null,
  );
  const [modalVisible, setModalVisible] = useState(false);
  const [signUrl, setSignUrl] = useState<string | null>(null);
  const [isCheckingClaim, setIsCheckingClaim] = useState(false);

  const { userWalletAddress } = useAppWallet();
  const { showAlert } = useAlert();

  const fetchDistributions = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get("/distributions/my-distributions", {
        withCredentials: true,
      });
      const data = res.data;

      const mapped: DistributionItem[] = (
        Array.isArray(data) ? data : data?.distributions || []
      ).map((item: any) => ({
        id: item.id,
        batchId: item.batchId,
        title: item.asset?.title || "Tokenized RWA Asset",
        location: item.asset?.location || "Verified Location",
        date: new Date(item.period || item.createdAt).toLocaleDateString(
          "en-US",
          {
            month: "short",
            day: "numeric",
            year: "numeric",
          },
        ),
        amount: Number(item.amount || 0),
        currency: "SAR",
        status:
          item.status === "PAID"
            ? "Paid"
            : item.status === "READY"
              ? "Ready"
              : "Upcoming",
        distributionMode: item.distributionMode,
        txHash: item.txHash,
        tokenStandard: item.asset?.tokenStandard || "ERC-3643 (RWA Token)",
        yieldRate: item.asset?.yieldRate || "8.0% APY",
        assetType: item.asset?.assetType || "Prime Real Estate",
      }));

      setDistributions(mapped);
    } catch (err) {
      console.error("Failed to load distributions:", err);
      setDistributions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDistributions();
  }, [fetchDistributions]);

  // 🚀 Dual-bridge postMessage listener for /auth/sign iframe
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
          data.type === "CLAIM_SUCCESS" ||
          data.type === "TX_SUCCESS" ||
          data.type === "SIGN_SUCCESS"
        ) {
          setSignUrl(null);
          setModalVisible(false);
          showAlert(
            "success",
            "On-chain yield claim & cryptographic signature verified!",
          );
          await fetchDistributions();
        } else if (data.type === "CLAIM_FAILED" || data.type === "TX_FAILED") {
          setSignUrl(null);
          showAlert(
            "error",
            data.error || "Claim transaction failed or was rejected.",
          );
        }
      } catch (err) {
        console.warn("Message parsing notice:", err);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [fetchDistributions, showAlert]);

  // Fintech Metric Aggregations
  const totalDistributed = useMemo(() => {
    return distributions
      .filter((i) => i.status === "Paid")
      .reduce((acc, curr) => acc + curr.amount, 0);
  }, [distributions]);

  const claimableYield = useMemo(() => {
    return distributions
      .filter((i) => i.status === "Ready")
      .reduce((acc, curr) => acc + curr.amount, 0);
  }, [distributions]);

  const readyToClaimCount = useMemo(() => {
    return distributions.filter((i) => i.status === "Ready").length;
  }, [distributions]);

  const filteredItems = useMemo(() => {
    return distributions.filter((item) => {
      const matchesTab =
        selectedTab === "ALL"
          ? true
          : selectedTab === "READY"
            ? item.status === "Ready" || item.status === "Upcoming"
            : item.status === "Paid";

      const matchesQuery =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.batchId &&
          item.batchId.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesTab && matchesQuery;
    });
  }, [selectedTab, searchQuery, distributions]);

  const handleModeChange = async (newMode: "OFF_CHAIN" | "ON_CHAIN") => {
    if (isSavingPref) return;
    setIsSavingPref(true);
    try {
      await api.patch(
        "/investors/profile",
        { distributionMode: newMode },
        { withCredentials: true },
      );
      setDistributionMode(newMode);
      showAlert("success", "Yield routing preference updated successfully.");
    } catch (err) {
      showAlert("error", "Failed to update routing preference.");
    } finally {
      setIsSavingPref(false);
    }
  };

  const handleOpenClaim = async (item: DistributionItem) => {
    if (!item.batchId) {
      showAlert("error", "Missing Batch ID for this distribution.");
      return;
    }

    try {
      setIsCheckingClaim(true);
      const proofRes = await api.get(
        `/distributions/proof/${encodeURIComponent(item.batchId)}`,
        { withCredentials: true },
      );
      const proofPayload = proofRes.data;

      const provider = new ethers.JsonRpcProvider(
        process.env.NEXT_PUBLIC_RPC_URL || "http://localhost:8545",
      );
      const notaryContract = new ethers.Contract(
        YIELD_NOTARY_ADDRESS,
        [
          "function isClaimed(bytes32 _batchId, address _account) view returns (bool)",
        ],
        provider,
      );

      const cleanBatchIdStr = String(proofPayload.batchId).trim();
      const encodedBatchId =
        cleanBatchIdStr.startsWith("0x") && cleanBatchIdStr.length === 66
          ? cleanBatchIdStr
          : ethers.id(cleanBatchIdStr);

      const targetAccount = ethers.getAddress(
        String(proofPayload.account).trim(),
      );

      let alreadyClaimed = false;
      try {
        alreadyClaimed = await notaryContract.isClaimed(
          encodedBatchId,
          targetAccount,
        );
      } catch (checkErr) {
        console.warn("isClaimed check skipped:", checkErr);
      }

      if (alreadyClaimed || proofPayload.status === "PAID") {
        showAlert(
          "info",
          "Yield for this distribution has already been claimed.",
        );
        await fetchDistributions();
        return;
      }

      const iface = new ethers.Interface([
        "function claimYield(bytes32 _batchId, address _account, uint256 _amount, bytes32[] calldata _merkleProof)",
      ]);

      const targetAmountWei = String(proofPayload.amount).trim();
      const targetProof = Array.isArray(proofPayload.proof)
        ? proofPayload.proof
        : [];

      const callData = iface.encodeFunctionData("claimYield", [
        encodedBatchId,
        targetAccount,
        targetAmountWei,
        targetProof,
      ]);

      const txPayload = {
        to: YIELD_NOTARY_ADDRESS,
        data: callData,
        value: "0x0",
        chainId: Number(process.env.NEXT_PUBLIC_TARGET_CHAIN_ID || 31337),
      };

      const tokenRes = await api.get("/auth/privy-token", {
        withCredentials: true,
      });
      const token = tokenRes.data?.privyCustomToken || tokenRes.data?.token;

      if (!token)
        throw new Error("Failed to authenticate secure signing session.");

      const encodedPayload = encodeURIComponent(JSON.stringify({ txPayload }));
      let url =
        `/auth/sign` +
        `?batchId=${encodeURIComponent(item.batchId)}` +
        `&payload=${encodedPayload}` +
        `&contractAddress=${encodeURIComponent(YIELD_NOTARY_ADDRESS)}` +
        `&autoAuth=true`;

      if (userWalletAddress) {
        url += `&walletAddress=${encodeURIComponent(userWalletAddress)}`;
      }
      if (token) {
        url += `&token=${encodeURIComponent(token)}`;
      }

      setModalVisible(false);
      setSignUrl(url);
    } catch (err: any) {
      showAlert(
        "error",
        err?.response?.data?.message ||
          err?.message ||
          "Proof verification error.",
      );
    } finally {
      setIsCheckingClaim(false);
    }
  };

  return (
    <div className={styles.pageContainer}>
      {/* 🚀 Header */}
      <header className={styles.header}>
        <div className={styles.headerTitleArea}>
          <div className={styles.breadcrumb}>
            <span>Remzik Protocol</span>
            <span className={styles.dot}>•</span>
            <span className={styles.activeBreadcrumb}>
              Yield Clearing House
            </span>
          </div>
          <h1>
            Yield <span className={styles.goldText}>Distributions</span>
          </h1>
          <p>
            Institutional-grade automated dividend engine & on-chain Merkle
            proof claim engine.
          </p>
        </div>

        <div className={styles.networkBadge}>
          <div className={styles.livePulse} />
          <span>Remzik Notary Active</span>
        </div>
      </header>

      {/* 🚀 Financial Metrics Grid */}
      <section className={styles.metricsGrid}>
        <div className={styles.metricCard}>
          <div className={styles.metricHeader}>
            <span className={styles.metricLabel}>Total Settled Yield</span>
            <div className={styles.metricIconBox}>
              <TrendingUp size={16} className={styles.goldIcon} />
            </div>
          </div>
          <div className={styles.metricValue}>
            SAR{" "}
            {totalDistributed.toLocaleString(undefined, {
              minimumFractionDigits: 2,
            })}
          </div>
          <div className={styles.metricSubtext}>Verified on Remzik Ledger</div>
        </div>

        <div className={`${styles.metricCard} ${styles.highlightMetric}`}>
          <div className={styles.metricHeader}>
            <span className={styles.metricLabel}>Available to Claim</span>
            <div className={styles.metricIconBoxGreen}>
              <Sparkles size={16} />
            </div>
          </div>
          <div className={styles.metricValueGreen}>
            SAR{" "}
            {claimableYield.toLocaleString(undefined, {
              minimumFractionDigits: 2,
            })}
          </div>
          <div className={styles.metricSubtextGreen}>
            {readyToClaimCount} Dividend{" "}
            {readyToClaimCount === 1 ? "batch" : "batches"} pending release
          </div>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.metricHeader}>
            <span className={styles.metricLabel}>Yield Settlement Routing</span>
            <div className={styles.metricIconBox}>
              <Wallet size={16} className={styles.goldIcon} />
            </div>
          </div>
          <div className={styles.modeToggleContainer}>
            <button
              className={
                distributionMode === "OFF_CHAIN"
                  ? styles.modeActive
                  : styles.modeBtn
              }
              onClick={() => handleModeChange("OFF_CHAIN")}
              disabled={isSavingPref}
            >
              Managed Vault
            </button>
            <button
              className={
                distributionMode === "ON_CHAIN"
                  ? styles.modeActive
                  : styles.modeBtn
              }
              onClick={() => handleModeChange("ON_CHAIN")}
              disabled={isSavingPref}
            >
              On-Chain Direct
            </button>
          </div>
        </div>
      </section>

      {/* 🚀 Search & Filter Toolbar */}
      <section className={styles.toolbar}>
        <div className={styles.searchBox}>
          <Search size={16} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Filter by asset name, location, or batch ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className={styles.clearSearch}
            >
              <X size={14} />
            </button>
          )}
        </div>

        <div className={styles.filterTabs}>
          <button
            className={selectedTab === "ALL" ? styles.tabActive : styles.tabBtn}
            onClick={() => setSelectedTab("ALL")}
          >
            All Batches
          </button>
          <button
            className={
              selectedTab === "READY" ? styles.tabActive : styles.tabBtn
            }
            onClick={() => setSelectedTab("READY")}
          >
            Ready / Pending ({readyToClaimCount})
          </button>
          <button
            className={
              selectedTab === "PAID" ? styles.tabActive : styles.tabBtn
            }
            onClick={() => setSelectedTab("PAID")}
          >
            Claimed
          </button>
        </div>
      </section>

      {/* 🚀 Distribution Cards Grid */}
      <section className={styles.feedSection}>
        {loading ? (
          <div className={styles.loadingFeed}>
            <Loader2
              size={28}
              className="animate-spin"
              style={{ color: "#d4af37" }}
            />
            <span>Synchronizing cryptographic proofs...</span>
          </div>
        ) : filteredItems.length > 0 ? (
          <div className={styles.cardsGrid}>
            {filteredItems.map((item) => {
              const isReady = item.status === "Ready";
              const isPaid = item.status === "Paid";

              return (
                <div
                  key={item.id}
                  className={`${styles.distCard} ${isReady ? styles.readyCardBorder : ""}`}
                >
                  <div className={styles.cardHeaderRow}>
                    <div className={styles.assetBadge}>
                      <Building2 size={13} />
                      <span>{item.assetType}</span>
                    </div>

                    <div
                      className={`${styles.statusPill} ${
                        isPaid
                          ? styles.statusPaid
                          : isReady
                            ? styles.statusReady
                            : styles.statusUpcoming
                      }`}
                    >
                      {isPaid ? (
                        <>
                          <CheckCircle2 size={12} /> Claimed
                        </>
                      ) : isReady ? (
                        <>
                          <Sparkles size={12} /> Ready to Claim
                        </>
                      ) : (
                        <>
                          <Clock size={12} /> Upcoming
                        </>
                      )}
                    </div>
                  </div>

                  <div className={styles.cardBody}>
                    <h3>{item.title}</h3>
                    <p className={styles.locationText}>{item.location}</p>

                    <div className={styles.financialBlock}>
                      <div className={styles.finStat}>
                        <span className={styles.finLabel}>Dividend Amount</span>
                        <span className={styles.finValue}>
                          SAR{" "}
                          {item.amount.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                          })}
                        </span>
                      </div>
                      <div className={styles.finStat}>
                        <span className={styles.finLabel}>APY Yield Rate</span>
                        <span className={styles.finValueGold}>
                          {item.yieldRate}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className={styles.cardFooterRow}>
                    <span className={styles.dateMeta}>
                      Settled: {item.date}
                    </span>
                    <button
                      className={
                        isReady ? styles.claimCtaBtn : styles.detailsBtn
                      }
                      onClick={() => {
                        setSelectedItem(item);
                        setModalVisible(true);
                      }}
                    >
                      {isReady ? (
                        <>
                          Check Yield <ArrowUpRight size={14} />
                        </>
                      ) : (
                        "View Proof"
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className={styles.emptyFeed}>
            <AlertCircle size={32} style={{ color: "#64748b" }} />
            <h4>No distributions found</h4>
            <p>No dividend records match your selected filter criteria.</p>
          </div>
        )}
      </section>

      {/* 🚀 Institutional Receipt & Merkle Verification Modal */}
      {modalVisible && selectedItem && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalPanel}>
            <div className={styles.modalHeader}>
              <div className={styles.modalHeaderTitle}>
                <ShieldCheck size={18} className={styles.goldIcon} />
                <span>Yield Notary Certificate</span>
              </div>
              <button
                onClick={() => setModalVisible(false)}
                className={styles.modalCloseBtn}
              >
                <X size={16} />
              </button>
            </div>

            <div className={styles.receiptBody}>
              <div className={styles.receiptMainAmount}>
                <span>Dividend Allocation</span>
                <h2>
                  SAR{" "}
                  {selectedItem.amount.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                  })}
                </h2>
              </div>

              <div className={styles.receiptDetailsTable}>
                <div className={styles.receiptRow}>
                  <span>Asset Title</span>
                  <strong>{selectedItem.title}</strong>
                </div>
                <div className={styles.receiptRow}>
                  <span>Yield Rate</span>
                  <strong style={{ color: "#d4af37" }}>
                    {selectedItem.yieldRate}
                  </strong>
                </div>
                <div className={styles.receiptRow}>
                  <span>Token Standard</span>
                  <strong>{selectedItem.tokenStandard}</strong>
                </div>
                <div className={styles.receiptRow}>
                  <span>Batch Identifier</span>
                  <code className={styles.batchCode}>
                    {selectedItem.batchId
                      ? `${selectedItem.batchId.slice(0, 10)}...${selectedItem.batchId.slice(-8)}`
                      : "Standard Release"}
                  </code>
                </div>
              </div>

              <div className={styles.proofNotice}>
                <Lock size={14} />
                <span>
                  Yield claims use Merkle tree cryptographic zero-knowledge
                  verification against the Remzik Yield Notary contract.
                </span>
              </div>
            </div>

            <div className={styles.modalFooter}>
              {selectedItem.status === "Paid" ? (
                <div className={styles.settledBadgeLarge}>
                  <CheckCircle2 size={16} /> Settled On-Chain
                </div>
              ) : (
                <button
                  onClick={() => handleOpenClaim(selectedItem)}
                  disabled={isCheckingClaim}
                  className={styles.modalClaimCta}
                >
                  {isCheckingClaim ? (
                    <>
                      <Loader2 size={16} className="animate-spin" /> Verifying
                      Proof...
                    </>
                  ) : (
                    <>
                      <ShieldCheck size={16} /> Execute On-Chain Claim
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 🚀 Embedded Enclave Iframe Overlay */}
      {signUrl && (
        <div className={styles.enclaveOverlay}>
          <div className={styles.enclavePanel}>
            <div className={styles.enclaveHeader}>
              <div className={styles.enclaveTitle}>
                <span className={styles.enclaveDot} />
                <span>SECURE CLAIM SIGNER</span>
              </div>
              <button
                onClick={() => setSignUrl(null)}
                className={styles.enclaveCloseBtn}
              >
                <X size={14} /> Close
              </button>
            </div>

            <iframe
              src={signUrl}
              className={styles.enclaveFrame}
              title="Yield Distribution Claim Signer"
            />
          </div>
        </div>
      )}
    </div>
  );
}
