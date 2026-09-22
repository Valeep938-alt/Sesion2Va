import { useMutation } from "@tanstack/react-query";
import { subastaService } from "@/api/services/subastaService";

export function useInscribirse() {
  return useMutation({
    mutationFn: (idSubasta: string) => subastaService.inscribirse(idSubasta),
  });
}

export function useCancelarInscripcion() {
  return useMutation({
    mutationFn: (idSubasta: string) =>
      subastaService.cancelarInscripcion(idSubasta),
  });
}
