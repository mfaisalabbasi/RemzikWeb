import { z } from "zod";

export const assetSchema = z.object({
  title: z.string().min(3),

  type: z.enum(["RESIDENTIAL", "COMMERCIAL", "INDUSTRIAL"]),

  description: z.string().min(10),

  totalValue: z.string().refine((v) => Number(v) > 0),

  location: z.string().min(3),

  expectedYield: z.string().refine((v) => Number(v) >= 0),

  rentalIncome: z.string().refine((v) => Number(v) >= 0),

  assetSize: z.string().refine((v) => Number(v) > 0),

  tokenSupply: z.string().refine((v) => Number(v) > 0),

  galleryImages: z.any().optional(),
  legalDocuments: z.any().optional(),
  financialDocuments: z.any().optional(),
  otherDocuments: z.any().optional(),
});
