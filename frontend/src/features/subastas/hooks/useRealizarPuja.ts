import { useMutation } from "@tanstack/react-query";
import { pujaService } from "@/api/services/pujaService";

export function useRealizarPuja() {
  return useMutation({
    mutationFn: ({ idSubasta, monto }: { idSubasta: string; monto: number }) =>
      pujaService.realizar(idSubasta, monto),
  });
}
