"use client";

import React, { useState, useEffect, useCallback } from "react";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import { ethers } from "ethers";
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
  const { authenticated, login } = usePrivy();
  const { wallets } = useWallets();

  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isVoting, setIsVoting] = useState<number | null>(null);

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

  const castVote = async (onChainProposalId: number, support: boolean) => {
    if (!authenticated) {
      login();
      return;
    }

    const wallet = wallets[0];
    if (!wallet) {
      return alert("❌ No active wallet connection found. Please reconnect.");
    }

    if (!govAddress) {
      return alert("❌ Governance contract address is missing for this asset.");
    }

    setIsVoting(onChainProposalId);
    try {
      const provider = new ethers.BrowserProvider(
        await wallet.getEthereumProvider(),
      );
      const signer = await provider.getSigner();
      const userAddress = await signer.getAddress();

      const govContract = new ethers.Contract(
        govAddress,
        ["function token() view returns (address)"],
        provider,
      );

      const tokenAddress = await govContract.token();

      // Safety check to prevent calling methods on the zero address
      if (
        !tokenAddress ||
        tokenAddress === "0x0000000000000000000000000000000000000000"
      ) {
        throw new Error(
          "Governance contract returned a zero/invalid token address.",
        );
      }

      // Safe self-delegation check
      const tokenContract = new ethers.Contract(
        tokenAddress,
        [
          "function delegates(address account) view returns (address)",
          "function delegate(address delegatee) external",
        ],
        signer,
      );

      const zeroAddress = "0x0000000000000000000000000000000000000000";
      const currentDelegate = await tokenContract.delegates(userAddress);

      if (
        currentDelegate === zeroAddress ||
        currentDelegate.toLowerCase() !== userAddress.toLowerCase()
      ) {
        const delegateTx = await tokenContract.delegate(userAddress);
        await delegateTx.wait();
      }

      // Execute vote transaction
      const governanceContract = new ethers.Contract(
        govAddress,
        ["function vote(uint256 _proposalId, bool _support) external"],
        signer,
      );

      const gasLimit = BigInt(300000);
      const tx = await governanceContract.vote(onChainProposalId, support, {
        gasLimit,
      });
      await tx.wait();

      alert("✅ Vote recorded successfully on-chain.");
      await fetchProposals();
    } catch (err: any) {
      console.error("Voting Transaction Failed:", err);
      let errorMessage = "Check your wallet connection and try again.";
      const errString = err?.reason || err?.message || "";

      if (errString.includes("Already voted")) {
        errorMessage = "You have already cast your vote for this proposal.";
      } else if (errString.includes("No voting power")) {
        errorMessage =
          "You have 0 voting weight. Ensure this wallet holds tokens.";
      } else if (errString.includes("Voting period ended")) {
        errorMessage = "The voting deadline for this proposal has passed.";
      } else if (errString) {
        errorMessage = `Contract revert: ${errString}`;
      }

      alert(`❌ Voting failed: ${errorMessage}`);
    } finally {
      setIsVoting(null);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h3 className={styles.title}>Asset DAO Governance</h3>
          <p className={styles.subtitle}>
            Participate in operational and emergency decisions for this vault.
          </p>
        </div>
        <span className={styles.statusBadge}>{asset?.status || "ACTIVE"}</span>
      </div>

      {!govAddress && (
        <div className={styles.warningBox}>
          <span>⚠️</span>
          <span>
            <strong>Warning:</strong> Governance contract address is not linked
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
          <div className={styles.loadingState} style={{ color: "#DC2626" }}>
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
                  <div>
                    <a
                      href={`https://etherscan.io/tx/${p.txHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.txLink}
                    >
                      View Genesis TX ↗
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
                      {isVoting === targetId ? "Signing..." : "Vote FOR"}
                    </button>
                    <button
                      className={styles.btnReject}
                      disabled={isVoting === targetId}
                      onClick={() => castVote(targetId, false)}
                    >
                      {isVoting === targetId ? "Signing..." : "Vote AGAINST"}
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
  );
};
