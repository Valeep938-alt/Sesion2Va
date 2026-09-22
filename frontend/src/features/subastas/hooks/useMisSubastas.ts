import { useQuery } from "@tanstack/react-query";
import { subastaService } from "@/api/services/subastaService";

export function useMisSubastas() {
  return useQuery({
    queryKey: ["subastas", "mias"],
    queryFn: subastaService.getMisSubastas,

    refetchInterval: 10_000,
  });
}
