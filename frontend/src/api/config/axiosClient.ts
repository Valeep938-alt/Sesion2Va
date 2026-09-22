import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import { useAuthStore } from "@/store/authStore";
import { traducirError } from "@/utils/helpers/error-messages";

export const axiosClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api",
  timeout: 20_000,
});

axiosClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as
      | (InternalAxiosRequestConfig & { _reintentado?: boolean })
      | undefined;

    (error as AxiosError & { mensajeUsuario?: string }).mensajeUsuario =
      traducirError(error);

    const esRutaAuth = original?.url?.includes("/auth/");
    if (
      error.response?.status === 401 &&
      original &&
      !original._reintentado &&
      !esRutaAuth &&
      typeof window !== "undefined"
    ) {
      original._reintentado = true;
      const refreshToken = useAuthStore.getState().refreshToken;

      if (refreshToken) {
        try {
          const { data } = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api"}/auth/refresh`,
            { refresh_token: refreshToken },
          );
          useAuthStore
            .getState()
            .actualizarTokens(data.access_token, data.refresh_token);

          original.headers.Authorization = `Bearer ${data.access_token}`;
          return axiosClient(original);
        } catch {
          useAuthStore.getState().logout();
          window.location.href = "/auth?mode=login";
          return Promise.reject(error);
        }
      }
    }

    if (
      error.response?.status === 401 &&
      !esRutaAuth &&
      typeof window !== "undefined"
    ) {
      useAuthStore.getState().logout();
      window.location.href = "/auth?mode=login";
    }

    return Promise.reject(error);
  },
);
