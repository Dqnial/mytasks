import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

interface AuthUser {
  _id?: string;
  email: string;
  fullName: string;
  profilePic?: string;
}

interface AuthStore {
  authUser: AuthUser | null;
  isSigningUp: boolean;
  isLoggingIn: boolean;
  isUpdatingProfile: boolean;
  isCheckingAuth: boolean;
  checkAuth: () => Promise<void>;
  signup: (data: any) => Promise<void>;
  login: (data: any) => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get<AuthUser>("/auth/check");
      set({ authUser: res.data });
    } catch (error) {
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post<AuthUser>("/auth/signup", data);
      set({ authUser: res.data });
      toast.success("Аккаунт успешно создан");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Ошибка регистрации");
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post<AuthUser>("/auth/login", data);
      set({ authUser: res.data });
      toast.success("Вы успешно вошли");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Ошибка входа");
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      toast.success("Вы успешно вышли");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Ошибка выхода");
    }
  },
}));
