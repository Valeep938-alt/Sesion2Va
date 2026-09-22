import { useMutation } from "@tanstack/react-query";
import { calificacionService } from "@/api/services/calificacionService";

export function useCalificar() {
  return useMutation({
    mutationFn: calificacionService.crear,
  });
}
