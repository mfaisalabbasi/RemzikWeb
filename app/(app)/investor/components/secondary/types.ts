export interface MarketPosition {
  id: string;
  assetId: string;
  assetTitle: string;
  quantity: number;
  avgPrice: number;
  currentPrice: number;
  pnl: number;
  image?: string;
  tokenAddress: string;
}

export interface Order {
  id: string; // The ID of the Listing in the DB
  type: "buy" | "sell";
  quantity: number;
  price: number;
  assetTitle: string;
  assetId: string;
}

export interface TradeInput {
  assetId: string;
  positionId?: string;
  type: "buy" | "sell";
  quantity: number;
  price: number;
}

export interface ActiveTrade {
  id: string;
  assetTitle: string;
  amount: number;
  status: "LOCKED" | "DISPUTED" | "RELEASED";
  type: "buy" | "sell";
  createdAt: string;
  buyerId?: string; // Add this
  sellerId?: string; // Add this for completeness
}
