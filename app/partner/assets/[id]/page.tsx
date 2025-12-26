import AssetForm from "../AssetForm";
export default function AssetDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const assetId = params.id;

  return <AssetForm assetId={assetId} />;
}
