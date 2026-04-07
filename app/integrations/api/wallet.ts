const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const getWalletData = async () => {
  // Adding a unique timestamp ?t= forces the browser to bypass any stored values
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
