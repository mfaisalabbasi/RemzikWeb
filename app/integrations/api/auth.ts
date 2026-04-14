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

// ... (types stay the same)

// SIGNUP
export const signup = async (data: SignupData) => {
  // Now uses: /api + /auth/signup = /api/auth/signup (CORRECT)
  const res = await api.post("/auth/signup", data, {
    withCredentials: true,
  });
  return res.data;
};

// LOGIN
export const login = async (data: { email: string; password: string }) => {
  // Now uses: /api + /auth/login = /api/auth/login (CORRECT)
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
