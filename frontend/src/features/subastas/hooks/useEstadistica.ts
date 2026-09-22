import { useQuery } from "@tanstack/react-query";
import { subastaService } from "@/api/services/subastaService";

export function useEstadisticas() {
  return useQuery({
    queryKey: ["subastas", "estadisticas"],
    queryFn: subastaService.getEstadisticas,
  });
}
