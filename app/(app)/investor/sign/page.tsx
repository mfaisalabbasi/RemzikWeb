"use client";

import { usePrivy, useWallets } from "@privy-io/react-auth";
import { useSearchParams } from "next/navigation";
import { useState, useEffect, useMemo, Suspense } from "react";

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
  const { ready, authenticated, login } = usePrivy();
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
  const investmentId = searchParams.get("investmentId") || "";
  const claimId =
    searchParams.get("claimId") || searchParams.get("batchId") || "";
  const proposalId = searchParams.get("proposalId") || "";
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

  const sessionId = isVoteFlow
    ? proposalId
    : isClaimFlow
      ? claimId
      : investmentId;

  const isBypassedAuth = autoAuth && Boolean(expectedWalletAddress);
  const effectiveAuthenticated = authenticated || isBypassedAuth;

  useEffect(() => {
    let cancelled = false;
    setIsLoadingPayload(true);

    // 1. If an explicit encoded payload string is provided, decode and prioritize it (Supports Investment & Voting payloads)
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

    // 2. Fallback for Claim flow
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

    // 3. Missing payloads error handler
    if (!cancelled) {
      setIsLoadingPayload(false);
      setErrorMessage("Missing transaction payload.");
      setStatus("error");
    }

    return () => {
      cancelled = true;
    };
  }, [encodedPayload, isClaimFlow, sessionId, contractAddressParam]);

  const privyWallet = useMemo(() => {
    if (!wallets || wallets.length === 0) return null;
    if (expectedWalletAddress) {
      const exactMatch = wallets.find(
        (wallet) => normalizeAddress(wallet.address) === expectedWalletAddress,
      );
      return exactMatch || null;
    }
    if (wallets.length === 1) return wallets[0];
    return null;
  }, [wallets, expectedWalletAddress]);

  const actualSignerAddress = normalizeAddress(privyWallet?.address);

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
      setErrorMessage(
        isVoteFlow
          ? "Missing voting session. Please restart."
          : isClaimFlow
            ? "Missing claim session. Please restart the claim."
            : "Missing investment session. Please restart the investment.",
      );
      return;
    }
    if (!parsedPayload) {
      setStatus("error");
      setErrorMessage("Transaction payload is not ready.");
      return;
    }
    if (!privyWallet || !actualSignerAddress) {
      setStatus("error");
      setErrorMessage("No valid Privy wallet is available for signing.");
      return;
    }
    if (
      expectedWalletAddress &&
      actualSignerAddress !== expectedWalletAddress
    ) {
      setStatus("error");
      setErrorMessage("The connected wallet does not match this session.");
      return;
    }

    try {
      setStatus("signing");
      await privyWallet.switchChain(TARGET_CHAIN_ID);
      const provider = await privyWallet.getEthereumProvider();

      if (!provider) {
        throw new Error("Privy wallet provider is unavailable.");
      }

      const {
        approvalPayload,
        txPayload,
        expectedStablecoinAddress,
        expectedStablecoinAmount,
        expectedVaultAddress,
      } = parsedPayload;

      // 1. Handle ERC-20 Allowance & Approval if present (Investment Flow logic)
      if (
        approvalPayload &&
        expectedStablecoinAddress &&
        expectedStablecoinAmount &&
        expectedVaultAddress
      ) {
        setStatusMessage("Checking allowance...");

        const ownerHex = privyWallet.address
          .toLowerCase()
          .replace("0x", "")
          .padStart(64, "0");
        const spenderHex = expectedVaultAddress
          .toLowerCase()
          .replace("0x", "")
          .padStart(64, "0");
        const allowanceData = `0xdd62ed3e${ownerHex}${spenderHex}`;

        const allowanceResult = await provider.request({
          method: "eth_call",
          params: [
            {
              to: expectedStablecoinAddress,
              data: allowanceData,
            },
            "latest",
          ],
        });

        const currentAllowance =
          allowanceResult && allowanceResult !== "0x"
            ? BigInt(allowanceResult)
            : 0n;
        const requiredAmount = BigInt(expectedStablecoinAmount);

        if (currentAllowance < requiredAmount) {
          setStatusMessage("Approving spend...");

          const approvalRequest: Record<string, string> = {
            from: privyWallet.address,
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

      // 2. Proceed to send core transaction (Deposit, Claim, or DAO Vote)
      setStatusMessage(
        isVoteFlow
          ? "Submitting DAO vote transaction..."
          : isClaimFlow
            ? "Submitting claim transaction..."
            : "Submitting deposit transaction...",
      );
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

      const transactionRequest: Record<string, string> = {
        from: privyWallet.address,
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

      // Post appropriate success type back to React Native
      const successType = isVoteFlow
        ? "VOTE_SUCCESS"
        : isClaimFlow
          ? "CLAIM_SUCCESS"
          : "TX_SUCCESS";

      const idKey = isVoteFlow
        ? "proposalId"
        : isClaimFlow
          ? "claimId"
          : "investmentId";

      postToNative({
        type: successType,
        txHash,
        [idKey]: sessionId,
        walletAddress: privyWallet.address,
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
          : "TX_FAILED";
      const idKey = isVoteFlow
        ? "proposalId"
        : isClaimFlow
          ? "claimId"
          : "investmentId";

      postToNative({
        type: failType,
        [idKey]: sessionId,
        walletAddress: privyWallet?.address || "",
        error: reason,
      });
    }
  };

  if ((!ready && !isReadyTimeout) || isLoadingPayload) {
    return (
      <main className="min-h-screen bg-[#080C0A] text-slate-100 flex flex-col items-center justify-center p-5">
        <div className="w-8 h-8 rounded-full border-2 border-emerald-400 border-t-transparent animate-spin mb-3" />
        <p className="text-xs text-emerald-400 font-semibold animate-pulse">
          Loading Secure Wallet...
        </p>
      </main>
    );
  }

  if (!effectiveAuthenticated) {
    return (
      <main className="min-h-screen bg-[#080C0A] text-slate-100 flex flex-col justify-between p-5">
        <header className="w-full max-w-sm mx-auto flex items-center justify-between pt-2">
          <div className="flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] font-extrabold tracking-widest text-emerald-400">
              SECURE SIGNING
            </span>
          </div>
        </header>

        <section className="w-full max-w-sm mx-auto bg-[#111816]/90 backdrop-blur-xl border border-emerald-500/20 rounded-2xl p-6 shadow-[0_0_40px_rgba(0,0,0,0.6)]">
          <div className="text-center">
            <div className="w-14 h-14 bg-gradient-to-b from-emerald-500/20 to-emerald-500/5 border border-emerald-500/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-emerald-400 text-xl">🛡️</span>
            </div>
            <h1 className="text-base font-bold text-white">
              {isVoteFlow
                ? "DAO Vote Authorization"
                : isClaimFlow
                  ? "Secure Claim Authorization"
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
        </section>

        <footer className="w-full max-w-sm mx-auto text-center pb-2">
          <p className="text-[9px] text-slate-600">
            Remzik Protocol · Secure transaction
          </p>
        </footer>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#080C0A] text-slate-100 flex flex-col justify-between p-5 selection:bg-emerald-500 selection:text-black antialiased">
      <header className="w-full max-w-sm mx-auto flex items-center justify-between pt-2">
        <div className="flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[10px] font-extrabold tracking-widest text-emerald-400">
            SECURE ENCLAVE ACTIVE
          </span>
        </div>
      </header>

      <section className="w-full max-w-sm mx-auto bg-[#111816]/90 backdrop-blur-xl border border-emerald-500/20 rounded-2xl p-5 shadow-[0_0_40px_rgba(0,0,0,0.6)]">
        <div className="text-center mb-5">
          <div className="w-12 h-12 bg-gradient-to-b from-emerald-500/20 to-emerald-500/5 border border-emerald-500/30 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <span className="text-emerald-400 text-lg">🛡️</span>
          </div>
          <h1 className="text-base font-bold text-white tracking-tight">
            {isVoteFlow
              ? "DAO Vote Signer"
              : isClaimFlow
                ? "Claim Yield Signer"
                : "Web3 Transaction Signer"}
          </h1>
          <p className="text-slate-400 text-[11px] mt-1">
            Review your{" "}
            {isVoteFlow ? "DAO vote" : isClaimFlow ? "claim" : "investment"}{" "}
            before authorizing.
          </p>
        </div>

        {parsedPayload && (
          <div className="bg-[#18221F] border border-emerald-500/15 rounded-xl p-3.5 mb-5 space-y-2.5 text-xs">
            <div className="flex justify-between items-center pb-2 border-b border-white/[0.04]">
              <span className="text-slate-400 text-[11px]">Signing Wallet</span>
              <span className="text-emerald-400 font-mono text-[11px]">
                {privyWallet?.address
                  ? `${privyWallet.address.slice(0, 6)}...${privyWallet.address.slice(-4)}`
                  : expectedWalletAddress
                    ? `${expectedWalletAddress.slice(0, 6)}...${expectedWalletAddress.slice(-4)}`
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
            disabled={!parsedPayload}
            className="w-full bg-emerald-400 hover:bg-emerald-300 disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98] text-slate-950 font-extrabold py-3.5 px-4 rounded-xl transition shadow-[0_4px_20px_rgba(52,211,153,0.3)] text-xs"
          >
            {isVoteFlow
              ? "Authorize & Submit Vote"
              : isClaimFlow
                ? "Authorize & Claim Yield"
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
      </section>

      <footer className="w-full max-w-sm mx-auto text-center pb-2">
        <p className="text-[9px] text-slate-600">
          Remzik Protocol · Secure transaction
        </p>
      </footer>
    </main>
  );
}

export default function SecureSignPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-[#080C0A] text-slate-100 flex flex-col items-center justify-center p-5">
          <div className="w-8 h-8 rounded-full border-2 border-emerald-400 border-t-transparent animate-spin mb-3" />
          <p className="text-xs text-emerald-400 font-semibold animate-pulse">
            Loading Secure Wallet...
          </p>
        </main>
      }
    >
      <SecureSignPageContent />
    </Suspense>
  );
}
