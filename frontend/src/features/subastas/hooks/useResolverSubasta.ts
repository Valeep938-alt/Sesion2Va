import { useMutation, useQueryClient } from "@tanstack/react-query";
import { subastaService } from "@/api/services/subastaService";

type ResolverInput = { idSubasta: string; aprobar: boolean; motivo?: string };

export function useResolverSubasta() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ idSubasta, aprobar, motivo }: ResolverInput) =>
      aprobar
        ? subastaService.aprobar(idSubasta)
        : subastaService.rechazar(idSubasta, motivo ?? ""),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["subastas"] });
    },
  });
}
