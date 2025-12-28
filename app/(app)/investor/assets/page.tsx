// import AssetFilters from "@/components/investor/assets/AssetFilters";
// import AssetGrid from "@/components/investor/assets/AssetGrid";
import AssetFilters from "../components/assets/AssetFilters";
import AssetGrid from "../components/assets/AssetGrid";

export default function AssetsPage() {
  return (
    <>
      <AssetFilters />

      <AssetGrid />
    </>
  );
}
