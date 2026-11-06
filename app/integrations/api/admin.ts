const API_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * Helper to safely extract response data (JSON or empty object)
 */
const parseResponseData = async (res: Response) => {
  const text = await res.text();
  if (!text) return {};
  try {
    return JSON.parse(text);
  } catch {
    return {};
  }
};

/**
 * Standard GET helper with safe response parsing
 */
const fetcher = async (path: string) => {
  console.log(`🚀 Admin Requesting: ${API_URL}${path}`);
  const res = await fetch(`${API_URL}${path}`, {
    method: "GET",
    credentials: "include",
    cache: "no-store",
    headers: { "Content-Type": "application/json" },
  });

  const data = await parseResponseData(res);

  if (!res.ok) {
    console.error("Backend Error Detail:", data);
    throw new Error(data.message || `API Error: ${res.status}`);
  }
  return data;
};

/**
 * Standard POST/PATCH helper with safe response parsing
 */
const poster = async (path: string, body: any, method: string = "POST") => {
  console.log(`🚀 Admin Action [${method}]: ${API_URL}${path}`, body);
  const res = await fetch(`${API_URL}${path}`, {
    method: method,
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await parseResponseData(res);

  if (!res.ok) {
    console.error("Backend Error Detail:", data);
    throw new Error(data.message || `API Error: ${res.status}`);
  }
  return data;
};

// --- DASHBOARD & ANALYTICS ---
export const getAdminDashboardStats = () => fetcher("/analytics/admin");
export const getUrgentQueue = () => fetcher("/admin/urgent-queue");
export const getPipelineSnapshot = () => fetcher("/admin/pipeline-snapshot");
export const getComplianceStatus = () => fetcher("/admin/compliance-status");
export const getLiquidityMonitor = () => fetcher("/admin/liquidity-monitor");

// --- BROADCASTS & COMMUNICATION ---
export const getBroadcasts = () => fetcher("/admin/broadcasts");
export const postBroadcast = (payload: {
  title: string;
  message: string;
  target: string;
}) => poster("/admin/broadcasts", payload, "POST");

// --- YIELD DISTRIBUTION ENGINE ---
export const getPendingBatches = () => fetcher("/admin/distributions/pending");
export const approveDistribution = (batchId: string) =>
  poster(`/admin/distributions/approve/${batchId}`, {}, "POST");
export const rejectDistribution = (batchId: string, reason: string) =>
  poster(`/admin/distributions/reject/${batchId}`, { reason }, "POST");

// --- INVESTOR GOVERNANCE ---
export const approveInvestorKyc = (id: string) =>
  poster(`/admin/investors/${id}/approve-kyc`, {}, "PATCH");

export const rejectInvestorKyc = (id: string, reason: string) =>
  poster(`/admin/investors/${id}/reject-kyc`, { reason }, "PATCH");

export const toggleInvestorFreeze = (id: string, reason: string) =>
  poster(`/admin/investors/${id}/toggle-freeze`, { reason }, "PATCH");

// --- PARTNER & KYB GOVERNANCE ---
export const updatePartnerStatusApi = (
  targetId: string,
  status: string,
  reason?: string,
) => poster(`/admin/partners/${targetId}/status`, { status, reason }, "PATCH");

export const updateKycStatusApi = (
  targetId: string,
  status: string,
  reason?: string,
) => poster(`/admin/kyc/${targetId}/status`, { status, reason }, "PATCH");

export const togglePartnerFreezeApi = (targetId: string, reason: string) =>
  poster(`/admin/partners/${targetId}/toggle-freeze`, { reason }, "PATCH");
