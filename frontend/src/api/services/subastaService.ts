import { axiosClient } from "../config/axiosClient";
import type {
  PayloadCrearSubasta,
  RespuestaDetalle,
  ResultadoVerificacionImagen,
  SubastaResumen,
} from "@/features/subastas/types";

export interface FiltrosCatalogo {
  categoria?: string;
  precioMin?: number;
  precioMax?: number;
  buscar?: string;
  limit?: number;
  offset?: number;
}

export interface RespuestaInscripcion {
  inscrito: boolean;
  estado: string;
  mensaje: string;
}

export interface RespuestaCancelacion {
  cancelada: boolean;
  mensaje: string;
}

export const subastaService = {
  getAll: async (filtros: FiltrosCatalogo = {}): Promise<SubastaResumen[]> => {
    const { data } = await axiosClient.get<SubastaResumen[]>("/subastas", {
      params: filtros,
    });
    return data;
  },

  getMisSubastas: async (): Promise<SubastaResumen[]> => {
    const { data } = await axiosClient.get<SubastaResumen[]>("/subastas/mias");
    return data;
  },

  getById: async (id: string): Promise<RespuestaDetalle> => {
    const { data } = await axiosClient.get<RespuestaDetalle>(`/subastas/${id}`);
    return data;
  },

  create: async (payload: PayloadCrearSubasta) => {
    const { data } = await axiosClient.post("/subastas", payload);
    return data;
  },

  inscribirse: async (idSubasta: string): Promise<RespuestaInscripcion> => {
    const { data } = await axiosClient.post<RespuestaInscripcion>(
      `/subastas/${idSubasta}/inscribirse`,
    );
    return data;
  },

  cancelarInscripcion: async (
    idSubasta: string,
  ): Promise<RespuestaCancelacion> => {
    const { data } = await axiosClient.delete<RespuestaCancelacion>(
      `/subastas/${idSubasta}/inscribirse`,
    );
    return data;
  },

  verificarImagen: async (
    form: FormData,
  ): Promise<ResultadoVerificacionImagen> => {
    const { data } = await axiosClient.post<ResultadoVerificacionImagen>(
      "/subastas/imagenes/verificar",
      form,
    );
    return data;
  },

  getEstadisticas: async () => {
    const { data } = await axiosClient.get("/subastas/estadisticas");
    return data;
  },

  getPendientes: async (): Promise<SubastaResumen[]> => {
    const { data } = await axiosClient.get<SubastaResumen[]>(
      "/subastas/pendientes",
    );
    return data;
  },

  aprobar: async (idSubasta: string) => {
    const { data } = await axiosClient.patch(`/subastas/${idSubasta}/aprobar`);
    return data;
  },

  rechazar: async (idSubasta: string, motivo: string) => {
    const { data } = await axiosClient.patch(
      `/subastas/${idSubasta}/rechazar`,
      { motivo },
    );
    return data;
  },
};
