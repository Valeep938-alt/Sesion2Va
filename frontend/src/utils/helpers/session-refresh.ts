import axios from "axios";
import { useAuthStore } from "@/store/authStore";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

let refreshEnCurso: Promise<string | null> | null = null;

export function refrescarSesion(): Promise<string | null> {
  if (refreshEnCurso) return refreshEnCurso;

  refreshEnCurso = (async () => {
    const { refreshToken } = useAuthStore.getState();
    if (!refreshToken) return null;

    try {
      const { data } = await axios.post(`${API_URL}/auth/refresh`, {
        refresh_token: refreshToken,
      });
      useAuthStore
        .getState()
        .actualizarTokens(data.access_token, data.refresh_token);
      return data.access_token as string;
    } catch {
      return null;
    } finally {
      refreshEnCurso = null;
    }
  })();

  return refreshEnCurso;
}
