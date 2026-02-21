export interface Asset {
  id: string;
  title: string;
  minInvestment: number;
  maxInvestment: number;
  roi: number;
  tenure: number;
  image: string;
}

export interface InvestmentInput {
  assetId: string;
  amount: number;
}
