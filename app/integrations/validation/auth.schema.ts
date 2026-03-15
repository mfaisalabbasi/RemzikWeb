import { z } from "zod";

export const signupSchema = z
  .object({
    name: z.string().min(3, "Full name must be at least 3 characters"),

    phone: z.string().min(8, "Phone number is invalid"),

    email: z.string().email("Invalid email address"),

    password: z.string().min(8, "Password must be at least 8 characters"),

    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),

  password: z.string().min(6, "Password must be at least 6 characters"),
});
