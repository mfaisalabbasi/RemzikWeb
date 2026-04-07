"use client";

import { useState, useCallback } from "react";
import AssetFilters from "../components/assets/AssetFilters";
import AssetGrid from "../components/assets/AssetGrid";

export default function AssetsPage() {
  const [activeFilters, setActiveFilters] = useState({
    type: "All Asset Types",
    roi: "Any ROI",
    tenure: "Any Tenure",
  });

  // Use useCallback to prevent the function from being re-created on every render
  const handleFilterChange = useCallback(
    (newFilters: { type: string; roi: string; tenure: string }) => {
      setActiveFilters(newFilters);
    },
    [],
  ); // Empty dependency array means this function stays stable

  return (
    <div className="container">
      <AssetFilters onFilterChange={handleFilterChange} />
      <AssetGrid filters={activeFilters} />
    </div>
  );
}
