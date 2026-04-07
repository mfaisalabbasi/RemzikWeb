export type RiskLevel = "Low" | "Moderate" | "High";

export interface Asset {
  id: string;
  title: string;
  subtitle?: string;
  image: string;
  roi: number;
  tenure: number;
  minInvest: number;
  totalValue: number;
  type: string;
  risk: RiskLevel;
  overview: string;
  financials: string;
  shariah: string;
  documents: string[];
}

export interface InvestmentInput {
  assetId: string;
  amount: number;
}
