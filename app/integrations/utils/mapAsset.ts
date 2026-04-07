export function mapAssetToUI(asset: any) {
  const sharePrice =
    asset.sharePrice || asset.totalValue / (asset.tokenSupply || 1);

  return {
    id: asset.id,

    title: asset.title,
    subtitle: asset.location || "Saudi Arabia",
    badge: asset.type,

    image: asset.galleryImages?.[0] || "/fallback.jpg",

    roi: asset.expectedYield || 8,
    tenure: asset.tenure || 12,
    minInvest: sharePrice,

    type: asset.type || "Real Estate",
    risk: asset.risk || "Moderate",

    overview: asset.description || "No overview provided",

    financials: `
      Total Value: SAR ${asset.totalValue}
      Token Supply: ${asset.tokenSupply}
      Price Per Share: SAR ${sharePrice.toLocaleString()}
    `,

    shariah:
      asset.shariahInfo ||
      "This asset follows a Shariah-compliant investment structure.",

    documents: asset.documents || [],
  };
}
