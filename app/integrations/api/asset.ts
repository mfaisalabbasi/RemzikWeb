const API_URL = process.env.NEXT_PUBLIC_API_URL;

const fetcher = async (path: string) => {
  console.log(`🚀 Requesting: ${API_URL}${path}`); // LOG REQUEST

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
    console.log(`✅ Success for ${path}:`, result); // LOG SUCCESS
    return result;
  } catch (error) {
    console.error(`🔥 Network/Fetch Error for ${path}:`, error);
    throw error;
  }
};

export const getPerformance = () => fetcher("/assets/partner/performance");
export const getPartnerKPI = () => fetcher("/assets/partner/kpi");
export const getLiveFundingAssets = () =>
  fetcher("/assets/partner/live-funding");
export const getFundingTable = () => fetcher("/assets/partner/funding-table");

/** * ✅ FIXED: Changed path from "/assets/partner/activity"
 * to "/assets/partner/recent-activity" to match the Backend Controller
 */
export const getRecentActivity = () =>
  fetcher("/assets/partner/recent-activity");

export const getPartnerAssets = () => fetcher("/assets/partner/assets");
export const getPartnerInvestors = () => fetcher("/assets/partner/investors");
export const getWithdrawals = () => fetcher("/assets/partner/withdrawals");
export const getPartnerFunding = () => fetcher("/assets/partner/funding");
export const getPartnerDistributions = () =>
  fetcher("/assets/partner/distributions");
export const getPartnerDocuments = () => fetcher("/assets/partner/documents");
