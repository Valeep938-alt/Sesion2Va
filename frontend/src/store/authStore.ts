import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { DatosUsuario } from "@/api/services/authService";

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: DatosUsuario | null;

  login: (
    user: DatosUsuario,
    accessToken: string,
    refreshToken?: string,
  ) => void;
  logout: () => void;
  actualizarTokens: (accessToken: string, refreshToken: string) => void;
  sincronizarUser: (user: DatosUsuario) => void;
  tieneAlgunRol: (...roles: string[]) => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      accessToken: null,
      refreshToken: null,
      user: null,

      login: (user, accessToken, refreshToken) =>
        set({ user, accessToken, refreshToken }),

      logout: () => set({ user: null, accessToken: null, refreshToken: null }),

      actualizarTokens: (accessToken, refreshToken) =>
        set({ accessToken, refreshToken }),

      sincronizarUser: (user) => set({ user }),

      tieneAlgunRol: (...rolesBuscados) => {
        const rolesUsuario = get().user?.roles;
        if (!rolesUsuario) return false;
        return rolesBuscados.some((r) => rolesUsuario.includes(r));
      },
    }),
    {
      name: "live-auction-auth",
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        user: state.user,
      }),
    },
  ),
);
