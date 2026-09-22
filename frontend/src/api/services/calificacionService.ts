import { axiosClient } from "../config/axiosClient";

export const calificacionService = {
  crear: async (payload: {
    idSubasta: string;
    puntuacion: number;
    comentario?: string;
  }) => {
    const { data } = await axiosClient.post("/calificaciones", payload);
    return data;
  },
  reputacion: async (idSubastador: string) => {
    const { data } = await axiosClient.get(
      `/calificaciones/subastador/${idSubastador}`,
    );
    return data as { promedio: number; total: number };
  },
};
