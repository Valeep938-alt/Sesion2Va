import { axiosClient } from "../config/axiosClient";

export interface PujaPublica {
  id: string;
  monto: number;
  usuario: string;
  fecha: string;
}

export interface SnapshotSubasta {
  subastaId: string;
  estado: string;
  idSubastador: string;
  esDueño: boolean;
  totalPujas: number;
  limiteUsuariosConcurrentes: number | null;
  precioBase: number;
  precioActual: number;
  incrementoMinimoPct: number;
  fechaFin: string;
  servidorAhora: number;
  participantes: number;
  historial: PujaPublica[];
}

export const pujaService = {
  realizar: async (idSubasta: string, monto: number) => {
    const { data } = await axiosClient.post("/pujas", { idSubasta, monto });
    return data;
  },

  getEstado: async (idSubasta: string): Promise<SnapshotSubasta> => {
    const { data } = await axiosClient.get<SnapshotSubasta>(
      `/pujas/snapshot/${idSubasta}`,
    );
    return data;
  },
};
