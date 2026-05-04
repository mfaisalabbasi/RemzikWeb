// Define what the frontend expects to receive
export interface ResolveDisputeDto {
  status: string;
  disputeId: string;
  action: "APPROVE" | "REJECT";
  adminNote?: string;
}
