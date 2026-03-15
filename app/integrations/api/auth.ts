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

// SIGNUP
export const signup = async (data: SignupData) => {
  const res = await api.post("/api/auth/signup", data, {
    withCredentials: true,
  });

  return res.data;
};

// LOGIN
export const login = async (data: { email: string; password: string }) => {
  const res = await api.post<AuthLoginResponse>("/api/auth/login", data, {
    withCredentials: true,
  });

  return res.data;
};

// GET CURRENT USER
export const getCurrentUser = async () => {
  const res = await api.get<CurrentUser>("/api/auth/me", {
    withCredentials: true,
  });

  return res.data;
};

// ✅ LOGOUT
export const logout = async () => {
  const res = await api.post(
    "/api/auth/logout",
    {},
    {
      withCredentials: true,
    },
  );

  return res.data;
};
