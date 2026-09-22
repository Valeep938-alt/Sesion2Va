"use client";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/store/authStore";
import { authService } from "@/api/services/authService";

export function useSincronizarPerfil() {
  const accessToken = useAuthStore((s) => s.accessToken);
  const sincronizar = useAuthStore((s) => s.sincronizarUser);

  const { data } = useQuery({
    queryKey: ["auth", "perfil"],
    queryFn: authService.me,
    enabled: Boolean(accessToken),
    staleTime: 5 * 60_000,
    retry: false,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (data?.user) sincronizar(data.user);
  }, [data, sincronizar]);
}
