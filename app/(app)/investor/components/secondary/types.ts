// secondary-market/types.ts

export interface MarketPosition {
  id: string;
  assetTitle: string;
  quantity: number;
  avgPrice: number;
  currentPrice: number;
  pnl: number; // profit/loss
  image?: string; // optional
}

export interface Order {
  id: string;
  type: "buy" | "sell";
  price: number;
  quantity: number;
}

export interface TradeInput {
  positionId?: string; // optional for buy orders
  type: "buy" | "sell";
  quantity: number;
  price: number;
}
