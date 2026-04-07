export interface MarketPosition {
  id: string;
  assetId: string;
  assetTitle: string;
  quantity: number;
  avgPrice: number;
  currentPrice: number;
  pnl: number;
  image?: string;
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
