import { z } from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "application/pdf"];

export const kycSchema = z.object({
  fullName: z.string().min(3, "Full name must be at least 3 characters"),

  dob: z.string().min(1, "Date of birth is required"),

  idDocument: z
    .any()
    .refine((file) => file?.length === 1, "Identity document is required")
    .refine((file) => file?.[0]?.size <= MAX_FILE_SIZE, "Max file size is 5MB")
    .refine(
      (file) => ACCEPTED_TYPES.includes(file?.[0]?.type),
      "Only JPG, PNG or PDF allowed",
    ),

  addressProof: z
    .any()
    .refine((file) => file?.length === 1, "Address proof is required")
    .refine((file) => file?.[0]?.size <= MAX_FILE_SIZE, "Max file size is 5MB")
    .refine(
      (file) => ACCEPTED_TYPES.includes(file?.[0]?.type),
      "Only JPG, PNG or PDF allowed",
    ),
});
