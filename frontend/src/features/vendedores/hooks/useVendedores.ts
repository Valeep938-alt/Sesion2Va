import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { vendedorService } from "@/api/services/vendedorService";

export function useVendedores(buscar: string) {
  return useQuery({
    queryKey: ["vendedores", "lista", buscar],
    queryFn: () => vendedorService.getAll(buscar || undefined),
    placeholderData: keepPreviousData,
  });
}

export function usePerfilVendedor(id: string | undefined) {
  return useQuery({
    queryKey: ["vendedores", "perfil", id],
    queryFn: () => vendedorService.getPerfil(id!),
    enabled: Boolean(id),
  });
}
