import { useQuery } from "@tanstack/react-query";
import { categoriaService } from "@/api/services/categoriaService";

export function useCategorias() {
  return useQuery({
    queryKey: ["categorias"],
    queryFn: categoriaService.getAll,
    staleTime: 5 * 60_000,
  });
}
