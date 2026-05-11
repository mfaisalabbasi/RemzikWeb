/**
 * Remzik Partner API Integration
 * Unified Fetcher/Poster Standard
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * Standard GET Fetcher
 * Used for retrieving dashboard data (KPIs, Assets, Performance)
 */
const fetcher = async (path: string) => {
  console.log(`🚀 Requesting GET: ${API_URL}${path}`);

  try {
    const res = await fetch(`${API_URL}${path}`, {
      method: "GET",
      credentials: "include",
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      console.error(`❌ API Error ${res.status}: ${res.statusText}`);
      throw new Error(`API Error: ${res.status}`);
    }

    const result = await res.json();
    console.log(`✅ Success for ${path}:`, result);
    return result;
  } catch (error) {
    console.error(`🔥 Network/Fetch Error for ${path}:`, error);
    throw error;
  }
};

/**
 * Standard POST Fetcher
 * Handles all write actions (Income Reports, Distributions)
 */
const poster = async (path: string, body: any) => {
  console.log(`🚀 Requesting POST: ${API_URL}${path}`, body);

  try {
    const res = await fetch(`${API_URL}${path}`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      const message = errorData.message || `API Error: ${res.status}`;
      console.error(`❌ POST Error:`, message);
      throw new Error(message);
    }

    const result = await res.json();
    console.log(`✅ POST Success for ${path}:`, result);
    return result;
  } catch (error) {
    console.error(`🔥 Network/Fetch Error for ${path}:`, error);
    throw error;
  }
};

// --- INCOME & DISTRIBUTION ACTIONS (NEW) ---

/**
 * Sends the Revenue Report (Gross, Expenses, Period) to the backend.
 * Creates the AssetIncome record.
 */
export const submitAssetIncome = (data: {
  assetId: string;
  grossAmount: number;
  expenses: number;
  period: string;
}) => poster("/assets/income/report", data);

/**
 * Triggers the distribution batch based on a specific Income Report ID.
 */
export const triggerDistributionFromIncome = (incomeId: string) =>
  poster(`/distributions/trigger-from-income`, { incomeId });

/**
 * Legacy/Alternative trigger (if still needed)
 */
export const triggerYieldDistribution = (assetId: string, amount: number) =>
  poster(`/partner/assets/${assetId}/distribute`, { amount });

// --- DATA RETRIEVAL METHODS (GET) ---

export const getPerformance = () => fetcher("/assets/partner/performance");
export const getPartnerKPI = () => fetcher("/assets/partner/kpi");
export const getLiveFundingAssets = () =>
  fetcher("/assets/partner/live-funding");
export const getFundingTable = () => fetcher("/assets/partner/funding-table");

/**
 * ✅ FIXED: Recent Activity Path
 */
export const getRecentActivity = () =>
  fetcher("/assets/partner/recent-activity");

export const getPartnerAssets = () => fetcher("/assets/partner/assets");
export const getPartnerInvestors = () => fetcher("/assets/partner/investors");
export const getWithdrawals = () => fetcher("/assets/partner/withdrawals");
export const getPartnerFunding = () => fetcher("/assets/partner/funding");
export const getPartnerDocuments = () => fetcher("/assets/partner/documents");

/**
 * ✅ Standardized Name: getPartnerDistribution
 * Used by your Distribution page to fetch the grid items.
 */
export const getPartnerDistribution = () =>
  fetcher("/assets/partner/distributions");

/**
 * Plural version kept for backward compatibility if needed elsewhere
 */
export const getPartnerDistributions = () =>
  fetcher("/assets/partner/distributions");
