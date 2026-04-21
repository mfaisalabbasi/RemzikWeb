export const getAdminDashboardStats = async () => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/analytics/admin`,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    },
  );

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    console.error("Backend Error Detail:", errorBody); // This will tell us if it's Auth or Logic
    throw new Error(
      errorBody.message || "Failed to fetch admin dashboard stats",
    );
  }

  return res.json();
};

export const getUrgentQueue = async () => {
  const response = await fetch("http://localhost:4000/api/admin/urgent-queue", {
    credentials: "include", // Required for cookie-based auth
  });
  if (!response.ok) throw new Error("Failed to fetch urgent queue");
  return response.json();
};
/**
 * Fetches the RWA Pipeline counts from the backend
 */
export const getPipelineSnapshot = async () => {
  const response = await fetch(
    "http://localhost:4000/api/admin/pipeline-snapshot",
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      // If you are using cookies for JWT, keep this
      credentials: "include",
    },
  );

  if (!response.ok) {
    throw new Error("Failed to fetch pipeline snapshot");
  }

  return response.json();
};

export const getComplianceStatus = async () => {
  const response = await fetch(
    "http://localhost:4000/api/admin/compliance-status",
    {
      credentials: "include",
    },
  );
  if (!response.ok) throw new Error("Failed to fetch compliance");
  return response.json();
};

export const getLiquidityMonitor = async () => {
  const response = await fetch(
    "http://localhost:4000/api/admin/liquidity-monitor",
    {
      credentials: "include",
    },
  );
  if (!response.ok) throw new Error("Failed to fetch liquidity data");
  return response.json();
};

export const getBroadcasts = async () => {
  const response = await fetch("http://localhost:4000/api/admin/broadcasts", {
    credentials: "include",
  });
  if (!response.ok) throw new Error("Failed to fetch broadcasts");
  return response.json();
};

export const postBroadcast = async (payload: {
  title: string;
  message: string;
  target: string;
}) => {
  const response = await fetch("http://localhost:4000/api/admin/broadcasts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    credentials: "include",
  });
  if (!response.ok) throw new Error("Failed to send broadcast");
  return response.json();
};
