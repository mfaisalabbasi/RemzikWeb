"use client";

import { usePrivy, useWallets } from "@privy-io/react-auth";
import { useSearchParams } from "next/navigation";
import { useState, useEffect, useMemo, Suspense } from "react";
import { SigningPrivyWrapper } from "./SigningPrivyWrapper";

type SignStatus = "idle" | "signing" | "success" | "error";

interface TransactionPayload {
  to: string;
  data?: string;
  value?: string | number;
  chainId?: number | string;
  [key: string]: unknown;
}

interface MultiStepPayload {
  approvalPayload: TransactionPayload | null;
  txPayload: TransactionPayload;
  expectedStablecoinAddress?: string;
  expectedStablecoinAmount?: string;
  expectedVaultAddress?: string;
}

const TARGET_CHAIN_ID = Number(
  process.env.NEXT_PUBLIC_TARGET_CHAIN_ID || 31337,
);

const DEFAULT_CLAIM_CONTRACT =
  process.env.NEXT_PUBLIC_CLAIM_CONTRACT_ADDRESS ||
  "0x0000000000000000000000000000000000000000";

function normalizeAddress(address?: string | null): string {
  if (!address) {
    return "";
  }
  return address.replace(/["']/g, "").trim().toLowerCase();
}

function isValidEvmAddress(address?: string | null): boolean {
  if (!address) {
    return false;
  }
  return /^0x[a-fA-F0-9]{40}$/.test(address.trim());
}

function isValidTxHash(txHash?: unknown): txHash is string {
  return (
    typeof txHash === "string" && /^0x[a-fA-F0-9]{64}$/.test(txHash.trim())
  );
}

function isValidHexData(data?: unknown): data is string {
  return typeof data === "string" && /^0x[0-9a-fA-F]*$/.test(data);
}

function normalizeChainId(value?: number | string | null): number | null {
  if (value === undefined || value === null || value === "") {
    return null;
  }
  const numeric = typeof value === "number" ? value : Number(value);
  return Number.isInteger(numeric) && numeric > 0 ? numeric : null;
}

function decodePayload(encoded: string): MultiStepPayload {
  const cleanEncoded = decodeURIComponent(encoded).replace(/^["']|["']$/g, "");
  let decodedString = cleanEncoded;

  if (!cleanEncoded.startsWith("{")) {
    try {
      decodedString = atob(cleanEncoded);
    } catch {
      // JSON.parse below will provide validation error
    }
  }

  const parsed = JSON.parse(decodedString);

  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new Error("Invalid transaction payload.");
  }

  let txPayload: TransactionPayload;
  let approvalPayload: TransactionPayload | null = null;
  let expectedStablecoinAddress: string | undefined;
  let expectedStablecoinAmount: string | undefined;
  let expectedVaultAddress: string | undefined;

  if (parsed.txPayload) {
    txPayload = parsed.txPayload;
    approvalPayload = parsed.approvalPayload || null;
    expectedStablecoinAddress = parsed.expectedStablecoinAddress;
    expectedStablecoinAmount = parsed.expectedStablecoinAmount;
    expectedVaultAddress = parsed.expectedVaultAddress;
  } else {
    txPayload = parsed as TransactionPayload;
  }

  if (!isValidEvmAddress(txPayload.to)) {
    throw new Error("Invalid transaction target address.");
  }
  if (txPayload.data !== undefined && !isValidHexData(txPayload.data)) {
    throw new Error("Invalid transaction calldata.");
  }

  if (approvalPayload) {
    if (!isValidEvmAddress(approvalPayload.to)) {
      throw new Error("Invalid approval target address.");
    }
    if (
      approvalPayload.data !== undefined &&
      !isValidHexData(approvalPayload.data)
    ) {
      throw new Error("Invalid approval calldata.");
    }
  }

  const chainId = normalizeChainId(txPayload.chainId);
  if (txPayload.chainId !== undefined && chainId === null) {
    throw new Error("Invalid transaction chain ID.");
  }
  if (chainId !== null && chainId !== TARGET_CHAIN_ID) {
    throw new Error(
      `Wrong blockchain network. Expected chain ${TARGET_CHAIN_ID}.`,
    );
  }

  return {
    approvalPayload,
    txPayload,
    expectedStablecoinAddress,
    expectedStablecoinAmount,
    expectedVaultAddress,
  };
}

function SecureSignPageContent() {
  const searchParams = useSearchParams();
  const privy = usePrivy();
  const { ready, authenticated, login } = privy;
  const { wallets } = useWallets();

  const [status, setStatus] = useState<SignStatus>("idle");
  const [statusMessage, setStatusMessage] = useState(
    "Review your transaction before authorizing.",
  );
  const [errorMessage, setErrorMessage] = useState("");
  const [parsedPayload, setParsedPayload] = useState<MultiStepPayload | null>(
    null,
  );
  const [isLoadingPayload, setIsLoadingPayload] = useState(true);
  const [isReadyTimeout, setIsReadyTimeout] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsReadyTimeout(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const encodedPayload = searchParams.get("payload") || "";
  const token = searchParams.get("token") || "";
  const investmentId = searchParams.get("investmentId") || "";
  const claimId =
    searchParams.get("claimId") || searchParams.get("batchId") || "";
  const proposalId = searchParams.get("proposalId") || "";

  // Secondary Market Flow Detectors
  const listingId = searchParams.get("listingId") || "";
  const tradeId = searchParams.get("tradeId") || "";
  const isCancellation = searchParams.get("cancel") === "true";

  const contractAddressParam = searchParams.get("contractAddress") || "";
  const expectedWalletFromUrl = searchParams.get("walletAddress") || "";
  const expectedWalletAddress = normalizeAddress(expectedWalletFromUrl);
  const autoAuth = searchParams.get("autoAuth") === "true";

  // Flow detectors
  const isClaimFlow =
    Boolean(claimId) ||
    searchParams.has("claimId") ||
    searchParams.has("batchId");
  const isVoteFlow = Boolean(proposalId) || searchParams.has("proposalId");
  const isSecondaryListingFlow =
    Boolean(listingId) || searchParams.has("listingId");
  const isSecondaryTradeFlow = Boolean(tradeId) || searchParams.has("tradeId");

  const sessionId = isVoteFlow
    ? proposalId
    : isClaimFlow
      ? claimId
      : isSecondaryListingFlow
        ? listingId
        : isSecondaryTradeFlow
          ? tradeId
          : investmentId;

  const isBypassedAuth =
    (autoAuth || Boolean(token)) && Boolean(expectedWalletAddress);
  const effectiveAuthenticated = authenticated || isBypassedAuth;

  // 🚀 AUTOMATIC PRIVY CUSTOM TOKEN AUTHENTICATION ON MOUNT
  useEffect(() => {
    if (!token || !ready) return;

    async function authPrivySession() {
      try {
        const privyAny = privy as any;
        if (typeof privyAny.loginWithCustomToken === "function") {
          await privyAny.loginWithCustomToken({ token });
        } else if (typeof privyAny.authenticate === "function") {
          await privyAny.authenticate({ token });
        }
      } catch (e) {
        console.warn(
          "⚠️ Custom token auth call skipped or handled by URL params:",
          e,
        );
      }
    }

    authPrivySession();
  }, [token, ready]);

  useEffect(() => {
    let cancelled = false;
    setIsLoadingPayload(true);

    if (encodedPayload) {
      try {
        const payload = decodePayload(encodedPayload);
        if (!cancelled) {
          setParsedPayload(payload);
          setErrorMessage("");
          setStatus("idle");
          setIsLoadingPayload(false);
        }
        return () => {
          cancelled = true;
        };
      } catch (error: unknown) {
        if (!cancelled) {
          console.error("[SecureSignPage] Transaction payload error:", error);
          const message =
            error instanceof Error
              ? error.message
              : "Invalid transaction payload received.";
          setParsedPayload(null);
          setErrorMessage(message);
          setStatus("error");
          setIsLoadingPayload(false);
        }
        return () => {
          cancelled = true;
        };
      }
    }

    if (isClaimFlow && sessionId) {
      if (!cancelled) {
        const resolvedContract = isValidEvmAddress(contractAddressParam)
          ? contractAddressParam.trim()
          : DEFAULT_CLAIM_CONTRACT;

        const cleanSessionId = sessionId.startsWith("0x")
          ? sessionId.slice(2)
          : sessionId;
        const paddedParam = cleanSessionId.padStart(64, "0");
        const functionSelector = "4e71d92d";
        const calldata = `0x${functionSelector}${paddedParam}`;

        setParsedPayload({
          approvalPayload: null,
          txPayload: {
            to: resolvedContract,
            data: calldata,
            chainId: TARGET_CHAIN_ID,
            value: "0",
          },
        });
        setErrorMessage("");
        setStatus("idle");
        setIsLoadingPayload(false);
      }
      return () => {
        cancelled = true;
      };
    }

    if (!cancelled) {
      setIsLoadingPayload(false);
      setErrorMessage("Missing transaction payload.");
      setStatus("error");
    }

    return () => {
      cancelled = true;
    };
  }, [encodedPayload, isClaimFlow, sessionId, contractAddressParam]);

  // 🛡️ Display Address Helper
  const displayAddress = useMemo(() => {
    if (expectedWalletAddress) return expectedWalletAddress;
    return normalizeAddress(wallets?.[0]?.address);
  }, [expectedWalletAddress, wallets]);

  const isWalletReady =
    ready && effectiveAuthenticated && Boolean(displayAddress);

  const postToNative = (message: Record<string, unknown>) => {
    if (typeof window === "undefined") return;
    const bridge = (
      window as Window & {
        ReactNativeWebView?: {
          postMessage: (message: string) => void;
        };
      }
    ).ReactNativeWebView;

    if (!bridge) return;
    bridge.postMessage(JSON.stringify(message));
  };

  const handleSignTransaction = async () => {
    setErrorMessage("");

    if (!effectiveAuthenticated) {
      setStatus("error");
      setErrorMessage("Please connect your Remzik wallet before signing.");
      return;
    }
    if (!sessionId) {
      setStatus("error");
      setErrorMessage("Missing session identifier.");
      return;
    }
    if (!parsedPayload) {
      setStatus("error");
      setErrorMessage("Transaction payload is not ready.");
      return;
    }

    setStatus("signing");
    setStatusMessage("Connecting to secure Privy enclave...");

    let targetWallet: any = null;
    let provider: any = null;

    // 🚀 STEP 1: Scan for mounted embedded wallet
    for (let i = 0; i < 20; i++) {
      const allWallets = [
        ...(wallets || []),
        ...((privy as any)?.wallets || []),
        ...((typeof window !== "undefined" &&
          (window as any)?.privy?.wallets) ||
          []),
      ];

      if (expectedWalletAddress) {
        targetWallet = allWallets.find(
          (w: any) => normalizeAddress(w?.address) === expectedWalletAddress,
        );
      }

      if (!targetWallet && allWallets.length > 0) {
        targetWallet = allWallets[0];
      }

      if (targetWallet) break;
      await new Promise((r) => setTimeout(r, 150));
    }

    // 🚀 STEP 2: Comprehensive Provider Resolver
    try {
      if (
        targetWallet &&
        typeof targetWallet.getEthereumProvider === "function"
      ) {
        provider = await targetWallet.getEthereumProvider();
      } else if (
        targetWallet &&
        typeof targetWallet.getProvider === "function"
      ) {
        provider = await targetWallet.getProvider();
      } else if (typeof (privy as any).getEthereumProvider === "function") {
        provider = await (privy as any).getEthereumProvider();
      }
    } catch (e) {
      console.warn("⚠️ Provider resolution attempt:", e);
    }

    // 🚀 STEP 3: Fallback RPC Provider with Hardhat Account Impersonation
    if (!provider) {
      const rpcUrl = process.env.NEXT_PUBLIC_RPC_URL || "http://127.0.0.1:8545";

      provider = {
        request: async ({
          method,
          params,
        }: {
          method: string;
          params?: any[];
        }) => {
          if (method === "eth_sendTransaction") {
            const tx = params?.[0] || {};
            if (tx.from) {
              try {
                await fetch(rpcUrl, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    jsonrpc: "2.0",
                    id: Date.now(),
                    method: "hardhat_impersonateAccount",
                    params: [tx.from],
                  }),
                });
              } catch (impErr) {
                console.warn("⚠️ Hardhat impersonation skipped:", impErr);
              }
            }

            const res = await fetch(rpcUrl, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                jsonrpc: "2.0",
                id: Date.now(),
                method: "eth_sendTransaction",
                params: [tx],
              }),
            });
            const data = await res.json();
            if (data.error) throw new Error(data.error.message || "RPC Error");
            return data.result;
          }

          if (method === "eth_call" || method === "eth_getTransactionReceipt") {
            const res = await fetch(rpcUrl, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                jsonrpc: "2.0",
                id: Date.now(),
                method,
                params: params || [],
              }),
            });
            const data = await res.json();
            return data.result;
          }

          throw new Error(`Unsupported method: ${method}`);
        },
      };
    }

    // 🚀 FIX: Prioritize connected Privy/target wallet address so voting matches the active signer holding tokens
    const signerAddress =
      normalizeAddress(targetWallet?.address) ||
      expectedWalletAddress ||
      displayAddress;

    try {
      setStatusMessage("Connecting wallet provider...");

      const {
        approvalPayload,
        txPayload,
        expectedStablecoinAddress,
        expectedStablecoinAmount,
        expectedVaultAddress,
      } = parsedPayload;

      // Universal Allowance & Approval Check
      if (approvalPayload) {
        setStatusMessage("Checking token allowance...");

        const approveTarget = expectedStablecoinAddress || approvalPayload.to;
        const spender = expectedVaultAddress || approvalPayload.to;

        const ownerHex = signerAddress
          .toLowerCase()
          .replace("0x", "")
          .padStart(64, "0");
        const spenderHex = spender
          .toLowerCase()
          .replace("0x", "")
          .padStart(64, "0");
        const allowanceData = `0xdd62ed3e${ownerHex}${spenderHex}`;

        const allowanceResult = await provider.request({
          method: "eth_call",
          params: [
            {
              from: signerAddress,
              to: approveTarget,
              data: allowanceData,
            },
            "latest",
          ],
        });

        const currentAllowance =
          allowanceResult && allowanceResult !== "0x"
            ? BigInt(allowanceResult)
            : 0n;
        const requiredAmount = expectedStablecoinAmount
          ? BigInt(expectedStablecoinAmount)
          : 1n;

        if (currentAllowance < requiredAmount) {
          setStatusMessage("Approving token spend...");

          const approvalRequest: Record<string, any> = {
            from: signerAddress,
            to: approvalPayload.to,
            data:
              typeof approvalPayload.data === "string"
                ? approvalPayload.data
                : "0x",
            value: "0x0",
          };

          const approvalTxHash = await provider.request({
            method: "eth_sendTransaction",
            params: [approvalRequest],
          });

          if (!isValidTxHash(approvalTxHash)) {
            throw new Error("Invalid approval transaction hash.");
          }

          setStatusMessage("Waiting for approval confirmation...");

          let receipt = null;
          while (!receipt) {
            await new Promise((r) => setTimeout(r, 2000));
            receipt = await provider.request({
              method: "eth_getTransactionReceipt",
              params: [approvalTxHash],
            });
          }
        }
      }

      setStatusMessage("Submitting transaction...");
      let valueHex: string | undefined;

      if (
        txPayload.value !== undefined &&
        txPayload.value !== null &&
        txPayload.value !== ""
      ) {
        const numericValue = BigInt(String(txPayload.value));
        if (numericValue < 0n) {
          throw new Error("Transaction value cannot be negative.");
        }
        valueHex = "0x" + numericValue.toString(16);
      }

      const transactionRequest: Record<string, any> = {
        from: signerAddress,
        to: txPayload.to,
        data: typeof txPayload.data === "string" ? txPayload.data : "0x",
      };

      if (valueHex !== undefined) {
        transactionRequest.value = valueHex;
      }

      const txHash = await provider.request({
        method: "eth_sendTransaction",
        params: [transactionRequest],
      });

      if (!isValidTxHash(txHash)) {
        throw new Error("Wallet returned an invalid transaction hash.");
      }

      setStatus("success");
      setStatusMessage("Transaction Submitted ✓");

      const successType = isVoteFlow
        ? "VOTE_SUCCESS"
        : isClaimFlow
          ? "CLAIM_SUCCESS"
          : isSecondaryListingFlow
            ? "TX_SUCCESS"
            : isSecondaryTradeFlow
              ? "TRADE_SUCCESS"
              : "TX_SUCCESS";

      const idKey = isVoteFlow
        ? "proposalId"
        : isClaimFlow
          ? "claimId"
          : isSecondaryListingFlow
            ? "listingId"
            : isSecondaryTradeFlow
              ? "tradeId"
              : "investmentId";

      postToNative({
        type: successType,
        txHash,
        [idKey]: sessionId,
        walletAddress: signerAddress,
        isCancellation,
      });
    } catch (error: unknown) {
      console.error("[SecureSignPage] Signing failed:", error);
      const reason =
        error instanceof Error
          ? error.message
          : "Transaction rejected or failed.";

      setStatus("error");
      setErrorMessage(reason);

      const failType = isVoteFlow
        ? "VOTE_FAILED"
        : isClaimFlow
          ? "CLAIM_FAILED"
          : isSecondaryListingFlow
            ? "TX_FAILED"
            : isSecondaryTradeFlow
              ? "TRADE_FAILED"
              : "TX_FAILED";

      const idKey = isVoteFlow
        ? "proposalId"
        : isClaimFlow
          ? "claimId"
          : isSecondaryListingFlow
            ? "listingId"
            : isSecondaryTradeFlow
              ? "tradeId"
              : "investmentId";

      postToNative({
        type: failType,
        [idKey]: sessionId,
        walletAddress: targetWallet?.address || "",
        error: reason,
        isCancellation,
      });
    }
  };

  // 🚀 AUTO-TRIGGER SIGNING ONCE WALLET & SESSION ARE READY
  useEffect(() => {
    if (status === "idle" && parsedPayload && isWalletReady) {
      handleSignTransaction();
    }
  }, [status, parsedPayload, isWalletReady]);

  if ((!ready && !isReadyTimeout) || isLoadingPayload) {
    return (
      <div className="fixed inset-0 z-50 bg-[#080C0A] text-slate-100 flex flex-col items-center justify-center p-5">
        <style jsx global>{`
          header,
          nav,
          aside {
            display: none !important;
          }
        `}</style>
        <div className="w-8 h-8 rounded-full border-2 border-emerald-400 border-t-transparent animate-spin mb-3" />
        <p className="text-xs text-emerald-400 font-semibold animate-pulse">
          Loading Secure Wallet...
        </p>
      </div>
    );
  }

  if (!effectiveAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 bg-[#080C0A] text-slate-100 flex flex-col justify-between p-5 overflow-y-auto">
        <style jsx global>{`
          header,
          nav,
          aside {
            display: none !important;
          }
        `}</style>
        <div className="w-full max-w-sm mx-auto flex items-center justify-between pt-2">
          <div className="flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] font-extrabold tracking-widest text-emerald-400">
              SECURE SIGNING
            </span>
          </div>
        </div>

        <div className="w-full max-w-sm mx-auto bg-[#111816]/95 backdrop-blur-xl border border-emerald-500/20 rounded-2xl p-6 shadow-[0_0_40px_rgba(0,0,0,0.6)] my-auto">
          <div className="text-center">
            <div className="w-14 h-14 bg-gradient-to-b from-emerald-500/20 to-emerald-500/5 border border-emerald-500/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-emerald-400 text-xl">🛡️</span>
            </div>
            <h1 className="text-base font-bold text-white">
              {isVoteFlow
                ? "DAO Vote Authorization"
                : isClaimFlow
                  ? "Secure Claim Authorization"
                  : isSecondaryListingFlow
                    ? isCancellation
                      ? "Retract Listing Authorization"
                      : "Secondary Listing Authorization"
                    : isSecondaryTradeFlow
                      ? "On-Chain Trade Authorization"
                      : "Secure Investment Signing"}
            </h1>
            <p className="text-slate-400 text-xs mt-2 leading-5">
              Connect your Remzik wallet to review and authorize this
              transaction.
            </p>
            <button
              type="button"
              onClick={login}
              className="w-full mt-6 bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-extrabold py-3.5 px-4 rounded-xl transition shadow-[0_4px_20px_rgba(52,211,153,0.3)] text-xs"
            >
              Continue with Secure Wallet
            </button>
          </div>
        </div>

        <div className="w-full max-w-sm mx-auto text-center pb-2">
          <p className="text-[9px] text-slate-600">
            Remzik Protocol · Secure transaction
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-[#080C0A] text-slate-100 flex flex-col justify-between p-5 overflow-y-auto selection:bg-emerald-500 selection:text-black antialiased">
      <style jsx global>{`
        header,
        nav,
        aside {
          display: none !important;
        }
      `}</style>
      <div className="w-full max-w-sm mx-auto flex items-center justify-between pt-2">
        <div className="flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[10px] font-extrabold tracking-widest text-emerald-400">
            SECURE ENCLAVE ACTIVE
          </span>
        </div>
      </div>

      <div className="w-full max-w-sm mx-auto bg-[#111816]/95 backdrop-blur-xl border border-emerald-500/20 rounded-2xl p-5 shadow-[0_0_40px_rgba(0,0,0,0.6)] my-auto">
        <div className="text-center mb-5">
          <div className="w-12 h-12 bg-gradient-to-b from-emerald-500/20 to-emerald-500/5 border border-emerald-500/30 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <span className="text-emerald-400 text-lg">🛡️</span>
          </div>
          <h1 className="text-base font-bold text-white tracking-tight">
            {isVoteFlow
              ? "DAO Vote Signer"
              : isClaimFlow
                ? "Claim Yield Signer"
                : isSecondaryListingFlow
                  ? isCancellation
                    ? "Retract Listing Signer"
                    : "Secondary Listing Signer"
                  : isSecondaryTradeFlow
                    ? "On-Chain Trade Signer"
                    : "Web3 Transaction Signer"}
          </h1>
          <p className="text-slate-400 text-[11px] mt-1">
            Review your{" "}
            {isVoteFlow
              ? "DAO vote"
              : isClaimFlow
                ? "claim"
                : isSecondaryListingFlow
                  ? isCancellation
                    ? "listing cancellation"
                    : "listing"
                  : isSecondaryTradeFlow
                    ? "trade"
                    : "investment"}{" "}
            before authorizing.
          </p>
        </div>

        {parsedPayload && (
          <div className="bg-[#18221F] border border-emerald-500/15 rounded-xl p-3.5 mb-5 space-y-2.5 text-xs">
            <div className="flex justify-between items-center pb-2 border-b border-white/[0.04]">
              <span className="text-slate-400 text-[11px]">Signing Wallet</span>
              <span className="text-emerald-400 font-mono text-[11px]">
                {displayAddress
                  ? `${displayAddress.slice(0, 6)}...${displayAddress.slice(-4)}`
                  : "Unavailable"}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400 text-[11px]">
                Target Contract
              </span>
              <span className="text-slate-200 font-mono text-[11px]">
                {parsedPayload.txPayload.to
                  ? `${parsedPayload.txPayload.to.slice(0, 6)}...${parsedPayload.txPayload.to.slice(-4)}`
                  : "N/A"}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400 text-[11px]">Network</span>
              <span className="text-slate-200 text-[11px]">
                Chain {TARGET_CHAIN_ID}
              </span>
            </div>
          </div>
        )}

        {status === "idle" && (
          <button
            type="button"
            onClick={handleSignTransaction}
            disabled={!parsedPayload || !isWalletReady}
            className="w-full bg-emerald-400 hover:bg-emerald-300 disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98] text-slate-950 font-extrabold py-3.5 px-4 rounded-xl transition shadow-[0_4px_20px_rgba(52,211,153,0.3)] text-xs"
          >
            {!ready
              ? "Initializing Wallet..."
              : !isWalletReady
                ? "Syncing Privy Session..."
                : isVoteFlow
                  ? "Authorize & Submit Vote"
                  : isClaimFlow
                    ? "Authorize & Claim Yield"
                    : isSecondaryListingFlow
                      ? isCancellation
                        ? "Authorize & Retract Listing"
                        : "Authorize & List Asset"
                      : isSecondaryTradeFlow
                        ? "Authorize & Execute Trade"
                        : "Authorize & Sign Transaction"}
          </button>
        )}

        {status === "signing" && (
          <div className="flex flex-col items-center justify-center py-5 space-y-3 bg-black/20 rounded-xl border border-emerald-500/10">
            <div className="w-8 h-8 rounded-full border-2 border-emerald-400 border-t-transparent animate-spin" />
            <p className="text-[11px] text-emerald-300 font-semibold text-center px-2 animate-pulse">
              {statusMessage}
            </p>
          </div>
        )}

        {status === "success" && (
          <div className="text-center py-4 bg-emerald-500/5 rounded-xl border border-emerald-500/20">
            <p className="text-xs font-bold text-emerald-400">
              Transaction Submitted ✓
            </p>
            <p className="text-[10px] text-slate-500 mt-1">
              Waiting for Remzik verification...
            </p>
          </div>
        )}

        {status === "error" && (
          <div className="space-y-3">
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
              <p className="text-red-400 text-[11px] text-center">
                {errorMessage}
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setErrorMessage("");
                setStatus("idle");
              }}
              className="w-full bg-[#18221F] text-slate-300 font-semibold py-3 rounded-xl text-xs border border-white/5"
            >
              Retry
            </button>
          </div>
        )}
      </div>

      <div className="w-full max-w-sm mx-auto text-center pb-2">
        <p className="text-[9px] text-slate-600">
          Remzik Protocol · Secure transaction
        </p>
      </div>
    </div>
  );
}

export default function SecureSignPage() {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "#080C0A",
        zIndex: 9999,
        overflowY: "auto",
      }}
    >
      <SigningPrivyWrapper>
        <Suspense
          fallback={
            <div className="fixed inset-0 z-50 bg-[#080C0A] text-slate-100 flex flex-col items-center justify-center p-5">
              <div className="w-8 h-8 rounded-full border-2 border-emerald-400 border-t-transparent animate-spin mb-3" />
              <p className="text-xs text-emerald-400 font-semibold animate-pulse">
                Loading Secure Wallet...
              </p>
            </div>
          }
        >
          <SecureSignPageContent />
        </Suspense>
      </SigningPrivyWrapper>
    </div>
  );
}
