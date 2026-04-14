const API_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * ✅ Generic Fetcher
 */
const fetcher = async (path: string) => {
  const res = await fetch(`${API_URL}${path}`, {
    method: "GET",
    credentials: "include",
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-cache, no-store, must-revalidate",
      Pragma: "no-cache",
    },
  });
  if (!res.ok) throw new Error(`API Error: ${res.status}`);
  return res.json();
};

/**
 * ✅ WALLET API EXPORTS
 */

export const getWalletData = async () => {
  // Uses the specific timestamp logic you shared to bypass cache
  const res = await fetch(`${API_URL}/wallet/me?t=${Date.now()}`, {
    method: "GET",
    credentials: "include",
    cache: "no-store",
    headers: {
      "Cache-Control": "no-cache, no-store, must-revalidate",
      Pragma: "no-cache",
    },
  });

  if (!res.ok) throw new Error("Failed to fetch wallet summary");
  return res.json();
};

export const getWalletTransactions = async () => {
  const res = await fetch(`${API_URL}/wallet/transactions?t=${Date.now()}`, {
    method: "GET",
    credentials: "include",
    cache: "no-store",
    headers: { "Cache-Control": "no-cache" },
  });

  if (!res.ok) throw new Error("Failed to fetch transactions");
  return res.json();
};

/**
 * ✅ PARTNER & ASSET API EXPORTS
 */

export const getPartnerKPI = async () => {
  return fetcher("/assets/partner/kpi");
};

export const getLiveFundingAssets = async () => {
  return fetcher("/assets/partner/live-funding");
};

export const getFundingTable = async () => {
  return fetcher("/assets/partner/funding-table");
};

export const getPerformance = async () => {
  return fetcher("/assets/partner/performance");
};

export const getRecentActivity = async () => {
  // Currently mocked until Transaction module is integrated
  return [
    {
      investorName: "Omar Al-Farsi",
      assetName: "Riyadh Commercial Hub",
      amount: 75000,
      date: "5 mins ago",
    },
    {
      investorName: "Khalid Mansour",
      assetName: "Jeddah Residential",
      amount: 25000,
      date: "12 mins ago",
    },
    {
      investorName: "Sara Williams",
      assetName: "Dammam Industrial",
      amount: 100000,
      date: "1 hour ago",
    },
  ];
};
