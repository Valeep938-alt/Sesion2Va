import { useMutation, useQueryClient } from "@tanstack/react-query";
import { subastaService } from "@/api/services/subastaService";
import type { PayloadCrearSubasta } from "../types";

export function useCrearSubasta() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: PayloadCrearSubasta) =>
      subastaService.create(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["subastas"] });
    },
  });
}
