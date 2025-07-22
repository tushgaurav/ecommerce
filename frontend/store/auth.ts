import { create } from "zustand";
import { persist } from "zustand/middleware";
import Cookies from "js-cookie";
import api from "@/lib/api";
import { User, RegisterData, LoginResponse } from "@/types";

interface AuthState {
  user: User | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      loading: false,

      login: async (username: string, password: string) => {
        set({ loading: true });
        try {
          const response = await api.post<LoginResponse>("/auth/login/", {
            username,
            password,
          });

          const { access, refresh, user } = response.data;

          Cookies.set("access_token", access);
          Cookies.set("refresh_token", refresh);

          set({ user, loading: false });
        } catch (error) {
          set({ loading: false });
          throw error;
        }
      },

      register: async (userData: RegisterData) => {
        set({ loading: true });
        try {
          const response = await api.post<LoginResponse>(
            "/auth/register/",
            userData
          );

          const { access, refresh, user } = response.data;

          Cookies.set("access_token", access);
          Cookies.set("refresh_token", refresh);

          set({ user, loading: false });
        } catch (error) {
          set({ loading: false });
          throw error;
        }
      },

      logout: () => {
        Cookies.remove("access_token");
        Cookies.remove("refresh_token");
        set({ user: null });
      },

      checkAuth: async () => {
        const token = Cookies.get("access_token");
        if (!token) return;

        try {
          // You'll need to implement this endpoint in Django
          const response = await api.get("/auth/me/");
          set({ user: response.data });
        } catch (error) {
          get().logout();
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({ user: state.user }),
    }
  )
);
