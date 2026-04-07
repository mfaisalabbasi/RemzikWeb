export const getDashboardStats = async () => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/investors/dashboard`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // Essential for session/cookie auth
    },
  );

  if (!res.ok) throw new Error("Failed to fetch investor dashboard stats");

  return res.json();
};

export const getPortfolio = async () => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/investors/dashboard`,
    { credentials: "include" },
  );

  if (!res.ok) throw new Error("Failed portfolio");
  return res.json();
};
