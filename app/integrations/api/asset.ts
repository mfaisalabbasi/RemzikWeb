/**
 * Remzik Partner API Integration
 * Standardized via Centralized Axios Instance
 */
import api from "../lib/axios";

// --- INCOME & DISTRIBUTION ACTIONS ---

/**
 * Sends the Revenue Report (Gross, Expenses, Period) to the backend.
 * Creates the AssetIncome record.
 */
export const submitAssetIncome = async (data: {
  assetId: string;
  grossAmount: number;
  expenses: number;
  period: string;
}) => {
  const res = await api.post("/assets/income/report", data, {
    withCredentials: true,
  });
  return res.data;
};

/**
 * Triggers the distribution batch based on a specific Income Report ID.
 */
export const triggerDistributionFromIncome = async (incomeId: string) => {
  const res = await api.post(
    "/distributions/trigger-from-income",
    { incomeId },
    {
      withCredentials: true,
    },
  );
  return res.data;
};

/**
 * Legacy/Alternative trigger (if still needed)
 */
export const triggerYieldDistribution = async (
  assetId: string,
  amount: number,
) => {
  const res = await api.post(
    `/partner/assets/${assetId}/distribute`,
    { amount },
    {
      withCredentials: true,
    },
  );
  return res.data;
};

// --- DATA RETRIEVAL METHODS (GET) ---

export const getPerformance = async () => {
  const res = await api.get("/assets/partner/performance", {
    withCredentials: true,
  });
  return res.data;
};

export const getPartnerKPI = async () => {
  const res = await api.get("/assets/partner/kpi", { withCredentials: true });
  return res.data;
};

export const getLiveFundingAssets = async () => {
  const res = await api.get("/assets/partner/live-funding", {
    withCredentials: true,
  });
  return res.data;
};

export const getFundingTable = async () => {
  const res = await api.get("/assets/partner/funding-table", {
    withCredentials: true,
  });
  return res.data;
};

export const getRecentActivity = async () => {
  const res = await api.get("/assets/partner/recent-activity", {
    withCredentials: true,
  });
  return res.data;
};

export const getPartnerAssets = async () => {
  const res = await api.get("/assets/partner/assets", {
    withCredentials: true,
  });
  return res.data;
};

export const getPartnerInvestors = async () => {
  const res = await api.get("/assets/partner/investors", {
    withCredentials: true,
  });
  return res.data;
};

export const getWithdrawals = async () => {
  const res = await api.get("/assets/partner/withdrawals", {
    withCredentials: true,
  });
  return res.data;
};

export const getPartnerFunding = async () => {
  const res = await api.get("/assets/partner/funding", {
    withCredentials: true,
  });
  return res.data;
};

export const getPartnerDocuments = async () => {
  const res = await api.get("/assets/partner/documents", {
    withCredentials: true,
  });
  return res.data;
};

export const getPartnerDistribution = async () => {
  const res = await api.get("/assets/partner/distributions", {
    withCredentials: true,
  });
  return res.data;
};

/**
 * Plural version kept for backward compatibility if needed elsewhere
 */
export const getPartnerDistributions = async () => {
  const res = await api.get("/assets/partner/distributions", {
    withCredentials: true,
  });
  return res.data;
};
