import { axiosClient } from "../config/axiosClient";

export interface NotificacionItem {
  idNotificacion: string;
  tipo: string;
  mensaje: string;
  leido: boolean;
  fechaEnvio: string;
  idSubasta: string | null;
}

export interface BandejaRespuesta {
  noLeidas: number;
  items: NotificacionItem[];
}

export const notificacionService = {
  getBandeja: async (): Promise<BandejaRespuesta> => {
    const { data } = await axiosClient.get<BandejaRespuesta>("/bandeja");
    return data;
  },

  leer: async (idNotificacion: string) => {
    await axiosClient.patch(`/bandeja/leer/${idNotificacion}`);
  },

  leerTodas: async () => {
    await axiosClient.patch("/bandeja/leer-todas");
  },
};
