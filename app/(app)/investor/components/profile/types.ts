/* ======================================================
   Profile Domain Types — Remzik
   Single source of truth for all profile components
====================================================== */

export type InvestmentStatus = "Active" | "Completed" | "Pending";

export type Investment = {
  id: string;
  assetTitle: string;
  amountInvested: number;
  roi: number;
  tenure: number;
  status: InvestmentStatus;
  image: string;
};

export type RiskLevel = "Low" | "Moderate" | "High";

export type KycStatus = "Pending" | "Verified" | "Rejected";

/* Optional — future ready user model */
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;

  totalInvested: number;
  portfolioValue: number;
  activeInvestments: number;

  riskLevel: RiskLevel;
  kycStatus: KycStatus;

  investments: Investment[];
}
