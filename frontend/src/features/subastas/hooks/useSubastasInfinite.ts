import { useInfiniteQuery } from "@tanstack/react-query";
import { subastaService } from "@/api/services/subastaService";

const PAGE_SIZE = 12;

export interface FiltrosFormulario {
  buscar: string;
  categoria: string;
  precioMin?: number;
  precioMax?: number;
}

export function useSubastasInfinite(filtros: FiltrosFormulario) {
  return useInfiniteQuery({
    queryKey: ["subastas", "catalogo", filtros],
    initialPageParam: 0,
    queryFn: ({ pageParam }) => {
      const offset = typeof pageParam === "number" ? pageParam : 0;
      return subastaService.getAll({
        buscar: filtros.buscar.trim() || undefined,
        categoria:
          filtros.categoria && filtros.categoria !== "todas"
            ? filtros.categoria
            : undefined,
        precioMin: filtros.precioMin,
        precioMax: filtros.precioMax,
        limit: PAGE_SIZE,
        offset,
      });
    },
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length === PAGE_SIZE ? allPages.length * PAGE_SIZE : undefined,
  });
}
