export const getPerformance = async () => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/assets/partner/performance`,
    {
      credentials: "include",
    },
  );

  if (!res.ok) {
    throw new Error("Failed to fetch performance");
  }

  return res.json();
};

export const getPartnerKPI = async () => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/assets/partner/kpi`,
    {
      credentials: "include",
    },
  );

  if (!res.ok) {
    throw new Error("Failed to fetch KPI");
  }

  return res.json();
};

export const getLiveFundingAssets = async () => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/assets/partner/live-funding`,
    {
      credentials: "include",
    },
  );

  if (!res.ok) {
    throw new Error("Failed to fetch live funding assets");
  }

  return res.json();
};

export const getFundingTable = async () => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/assets/partner/funding-table`,
    { credentials: "include" },
  );

  if (!res.ok) throw new Error("Failed funding table");

  return res.json();
};

export const getRecentActivity = async () => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/assets/partner/activity`,
    { credentials: "include" },
  );

  if (!res.ok) throw new Error("Failed activity");

  return res.json();
};

export const getPartnerAssets = async () => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/assets/partner/assets`,
    { credentials: "include" },
  );

  if (!res.ok) throw new Error("Failed to fetch assets");

  return res.json();
};

export const getPartnerInvestors = async () => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/assets/partner/investors`,
    { credentials: "include" },
  );

  if (!res.ok) throw new Error("Failed investors");

  return res.json();
};

export const getWithdrawals = async () => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/assets/partner/withdrawals`,
    { credentials: "include" },
  );

  if (!res.ok) throw new Error("Failed withdrawals");

  return res.json();
};

export const getPartnerFunding = async () => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/assets/partner/funding`,
    { credentials: "include" },
  );

  if (!res.ok) throw new Error("Failed funding data");

  return res.json();
};

export const getPartnerDistributions = async () => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/assets/partner/distributions`,
    { credentials: "include" },
  );

  if (!res.ok) throw new Error("Failed distributions");

  return res.json();
};

export const getPartnerDocuments = async () => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/assets/partner/documents`,
    { credentials: "include" },
  );

  if (!res.ok) throw new Error("Failed documents");

  return res.json();
};
