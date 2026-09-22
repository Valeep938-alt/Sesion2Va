import { keepPreviousData, useQuery } from "@tanstack/react-query";
import {
  subastaService,
  type FiltrosCatalogo,
} from "@/api/services/subastaService";

export function useSubastas(filtros: FiltrosCatalogo) {
  return useQuery({
    queryKey: ["subastas", "catalogo", filtros],
    queryFn: () => subastaService.getAll(filtros),
    placeholderData: keepPreviousData,
  });
}
