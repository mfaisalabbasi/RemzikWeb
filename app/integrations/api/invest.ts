import api from "../lib/axios";

export const investApi = {
  getWalletBalance: async () => {
    const response = await api.get("/wallet/me", { withCredentials: true });
    return response.data;
  },

  checkInvestmentStatus: async (investmentId: string) => {
    const response = await api.get(`/investments/${investmentId}`, {
      withCredentials: true,
    });
    return response.data;
  },

  createInvestmentIntent: async (
    assetId: string,
    amount: number,
    settlementMode: "OFF_CHAIN" | "ON_CHAIN",
  ) => {
    const response = await api.post(
      "/investments/intent",
      { assetId, amount, settlementMode },
      { withCredentials: true },
    );
    return response.data;
  },

  submitOffChainInvestment: async (assetId: string, amount: number) => {
    const response = await api.post(
      "/investments",
      { assetId, amount, settlementMode: "OFF_CHAIN" },
      { withCredentials: true },
    );
    return response.data;
  },

  submitOnChainTxHash: async (investmentId: string, txHash: string) => {
    const response = await api.post(
      `/investments/${investmentId}/submit-tx`,
      { txHash },
      { withCredentials: true },
    );
    return response.data;
  },
};
