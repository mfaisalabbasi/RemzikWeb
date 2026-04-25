"use client";
import { useState, useEffect } from "react";

export const usePartnerDetail = (id: string) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchDetail = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/partners/${id}`,
        {
          credentials: "include",
        },
      );
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error("Failed to fetch partner detail", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchDetail();
  }, [id]);

  return { data, loading, refresh: fetchDetail };
};
