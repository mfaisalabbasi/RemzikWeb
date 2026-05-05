const API_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * Standard GET helper
 * Maintains consistent logging and credential handling across the admin panel.
 */
const fetcher = async (path: string) => {
  console.log(`🚀 Admin Requesting: ${API_URL}${path}`);
  const res = await fetch(`${API_URL}${path}`, {
    method: "GET",
    credentials: "include",
    cache: "no-store",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    console.error("Backend Error Detail:", errorBody);
    throw new Error(errorBody.message || `API Error: ${res.status}`);
  }
  return res.json();
};

/**
 * Standard POST/PATCH helper
 * Used for administrative actions like approvals and broadcasts.
 */
const poster = async (path: string, body: any) => {
  console.log(`🚀 Admin Action: ${API_URL}${path}`, body);
  const res = await fetch(`${API_URL}${path}`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || `API Error: ${res.status}`);
  }
  return res.json();
};

// --- DASHBOARD & ANALYTICS ---

export const getAdminDashboardStats = () => fetcher("/analytics/admin");

export const getUrgentQueue = () => fetcher("/admin/urgent-queue");

/**
 * Fetches the RWA Pipeline counts from the backend
 */
export const getPipelineSnapshot = () => fetcher("/admin/pipeline-snapshot");

export const getComplianceStatus = () => fetcher("/admin/compliance-status");

export const getLiquidityMonitor = () => fetcher("/admin/liquidity-monitor");

// --- BROADCASTS & COMMUNICATION ---

export const getBroadcasts = () => fetcher("/admin/broadcasts");

export const postBroadcast = (payload: {
  title: string;
  message: string;
  target: string;
}) => poster("/admin/broadcasts", payload);

// --- YIELD DISTRIBUTION ENGINE ---

/**
 * ✅ NEW: Fetches grouped pending distribution batches for the Admin Queue
 */
export const getPendingBatches = () => fetcher("/admin/distributions/pending");

/**
 * ✅ NEW: Approves a specific batch and triggers the actual wallet credits
 */
export const approveDistribution = (batchId: string) =>
  poster(`/admin/distributions/approve/${batchId}`, {});

/**
 * ✅ NEW: Rejects a batch (e.g., if the partner entered wrong data)
 */
export const rejectDistribution = (batchId: string, reason: string) =>
  poster(`/admin/distributions/reject/${batchId}`, { reason });
