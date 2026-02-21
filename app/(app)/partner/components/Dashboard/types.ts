export interface PartnerDashboardMetrics {
  totalAssets: number;
  activeFunding: number;
  fullyFunded: number;
  pendingCompliance: number;
  totalRaised: number;
  avgROI: number;
}

export interface FundingSnapshot {
  assetId: string;
  assetName: string;
  targetRaise: number;
  raisedAmount: number;
  fundingPercentage: number;
  investorsCount: number;
}

export interface RecentInvestment {
  investorName: string;
  assetName: string;
  amount: number;
  date: string;
}

export type AssetFundingStatus =
  | "FUNDING"
  | "FUNDED"
  | "PENDING_COMPLIANCE"
  | "DISTRIBUTION_ACTIVE";

export interface AssetStatusRow {
  assetId: string;
  assetName: string;
  targetRaise: number;
  raisedAmount: number;
  investors: number;
  fundingStatus: AssetFundingStatus;
}
