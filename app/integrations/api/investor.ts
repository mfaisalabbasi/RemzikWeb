export const getDashboardStats = async () => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/investors/dashboard`,
    {
      credentials: "include",
    },
  );

  if (!res.ok) throw new Error("Failed to fetch dashboard");

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
