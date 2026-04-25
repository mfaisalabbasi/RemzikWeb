"use client";

import { useState, useEffect } from "react";

export const usePartners = () => {
  const [partners, setPartners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Statuses");

  const fetchPartners = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/partners`,
        {
          credentials: "include",
        },
      );
      const data = await res.json();
      setPartners(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch partners:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPartners();
  }, []);

  const filteredPartners = partners.filter((p) => {
    const name = p.companyName || "";
    const email = p.user?.email || "";
    const matchesSearch =
      name.toLowerCase().includes(search.toLowerCase()) ||
      email.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === "All Statuses" || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return {
    partners: filteredPartners,
    loading,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
  };
};
