import { axiosClient } from "../config/axiosClient";
import type { Categoria } from "@/features/subastas/types";

export const categoriaService = {
  getAll: async (): Promise<Categoria[]> => {
    return [
      { idCategoria: "1", nombre: "Arte", descripcion: null },
      { idCategoria: "2", nombre: "Electrónica", descripcion: null },
      // agrega las que uses en tus subastas de prueba
    ];
  },

  create: async (payload: { nombre: string; descripcion?: string }) => {
    const { data } = await axiosClient.post("/categorias", payload);
    return data;
  },

  update: async (
    idCategoria: string,
    payload: { nombre?: string; descripcion?: string },
  ) => {
    const { data } = await axiosClient.patch(
      `/categorias/${idCategoria}`,
      payload,
    );
    return data;
  },

  remove: async (idCategoria: string) => {
    await axiosClient.delete(`/categorias/${idCategoria}`);
  },
};

