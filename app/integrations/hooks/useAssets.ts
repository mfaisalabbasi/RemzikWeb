import { useState, useEffect } from "react";

export const useAssets = () => {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const fetchAssets = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/assets`,
        {
          credentials: "include",
        },
      );
      const data = await res.json();
      setAssets(data);
    } catch (err) {
      console.error("Failed to fetch assets", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssets();
  }, []);

  const filteredAssets = assets.filter((asset: any) => {
    const matchesSearch =
      asset.title?.toLowerCase().includes(search.toLowerCase()) ||
      asset.id?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === "All" || asset.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return {
    assets: filteredAssets,
    loading,
    setSearch,
    setStatusFilter,
    refresh: fetchAssets,
  };
};
