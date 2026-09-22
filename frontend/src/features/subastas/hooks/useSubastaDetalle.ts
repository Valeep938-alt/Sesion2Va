import { useQuery } from "@tanstack/react-query";
import { subastaService } from "@/api/services/subastaService";

export function useSubastaDetalle(id: string | undefined) {
  return useQuery({
    queryKey: ["subastas", "detalle", id],
    queryFn: () => subastaService.getById(id!),
    enabled: Boolean(id),
  });
}
