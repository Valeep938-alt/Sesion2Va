import { useQuery } from "@tanstack/react-query";
import { subastaService } from "@/api/services/subastaService";

export function usePendientesModeracion() {
  return useQuery({
    queryKey: ["subastas", "pendientes"],
    queryFn: subastaService.getPendientes,
    refetchInterval: 5_000,
  });
}
