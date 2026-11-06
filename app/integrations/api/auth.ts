import api from "../lib/axios";

export type BackendUser = {
  id: string;
  email: string;
  phone: string;
  role: "INVESTOR" | "PARTNER" | "ADMIN";
};

export type AuthLoginResponse = {
  user: BackendUser;
  message: string;
};

export type CurrentUser = {
  id: string;
  role: "INVESTOR" | "PARTNER" | "ADMIN";
};

export type SignupData = {
  email: string;
  phone: string;
  password: string;
};

// SIGNUP (Basic)
export const signup = async (data: SignupData) => {
  const res = await api.post("/auth/signup", data, {
    withCredentials: true,
  });
  return res.data;
};

// SIGNUP WITH KYC (Multi-part FormData support)
export const registerWithKyc = async (formData: FormData) => {
  // ⚠️ CRITICAL FIX: Do NOT manually set Content-Type for FormData.
  // Axios will automatically attach the multipart boundary parameters.
  const res = await api.post("/users/register-with-kyc", formData, {
    withCredentials: true,
  });
  return res.data;
};

// PROVISION WALLET
export const provisionWallet = async () => {
  const res = await api.post(
    "/auth/provision-wallet",
    {},
    {
      withCredentials: true,
    },
  );
  return res.data;
};

// LOGIN
export const login = async (data: { email: string; password: string }) => {
  const res = await api.post<AuthLoginResponse>("/auth/login", data, {
    withCredentials: true,
  });
  return res.data;
};

// GET CURRENT USER
export const getCurrentUser = async () => {
  const res = await api.get<CurrentUser>("/auth/me", {
    withCredentials: true,
  });
  return res.data;
};

// LOGOUT
export const logout = async () => {
  const res = await api.post("/auth/logout", {}, { withCredentials: true });
  return res.data;
};

// FORGOT PASSWORD REQUEST
export const requestPasswordReset = async (email: string) => {
  const res = await api.post(
    "/users/forgot-password",
    { email },
    {
      withCredentials: true,
    },
  );
  return res.data;
};

// RESET PASSWORD SUBMISSION
export const resetPasswordWithToken = async (data: {
  email: string;
  token: string;
  newPassword: string;
}) => {
  const res = await api.post("/users/reset-password", data, {
    withCredentials: true,
  });
  return res.data;
};
