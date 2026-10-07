"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/store/authStore";
import { notificacionService } from "@/api/services/notificacionService";
import { formatearFecha } from "@/utils/formatters";

const DESTINO_POR_TIPO: Record<string, string> = {
  VICTORIA: "/pagos",
  PAGO_CONFIRMADO: "/pagos",
  RENOVACION: "/mis-subastas",
  RECHAZO: "/mis-subastas",
  APROBACION: "/mis-subastas",
  INICIO_SUBASTA: "/mis-subastas",
};

export function CampanaNotificaciones() {
  const [abierto, setAbierto] = useState(false);
  const accessToken = useAuthStore((s) => s.accessToken);
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: ["bandeja"],
    queryFn: notificacionService.getBandeja,
    enabled: Boolean(accessToken),
    refetchInterval: 15_000,
  });

  const noLeidas = data?.noLeidas ?? 0;

  async function abrirItem(id: string, tipo: string, idSubasta: string | null) {
    await notificacionService.leer(id);
    void queryClient.invalidateQueries({ queryKey: ["bandeja"] });
    setAbierto(false);
    const destino = idSubasta
      ? `/subastas/${idSubasta}`
      : (DESTINO_POR_TIPO[tipo] ?? "/");
    router.push(destino);
  }

  if (!accessToken) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setAbierto((v) => !v)}
        aria-label="Notificaciones"
        className="relative w-10 h-10 grid place-items-center text-stone-600
                   hover:text-stone-900 transition-colors cursor-pointer"
      >
        <span className="text-lg">🔔</span>
        {noLeidas > 0 && (
          <span
            className="absolute top-1 right-1 bg-red-600 text-white font-mono
                       text-[9px] min-w-4 h-4 px-1 grid place-items-center
                       rounded-full leading-none"
          >
            {noLeidas > 9 ? "9+" : noLeidas}
          </span>
        )}
      </button>

      {abierto && (
        <div
          className="absolute right-0 top-12 w-80 max-h-96 overflow-y-auto
                     bg-white border border-stone-200 shadow-xl z-50"
        >
          <div className="flex items-center justify-between px-4 py-3 border-b border-stone-100">
            <span className="font-mono text-[10px] uppercase tracking-widest text-stone-500">
              Notificaciones
            </span>
            {noLeidas > 0 && (
              <button
                onClick={async () => {
                  await notificacionService.leerTodas();
                  void queryClient.invalidateQueries({ queryKey: ["bandeja"] });
                }}
                className="text-[9px] font-mono uppercase tracking-widest
                           text-stone-400 hover:text-stone-900 cursor-pointer"
              >
                Marcar todas leídas
              </button>
            )}
          </div>

          {(data?.items ?? []).length === 0 && (
            <p className="px-4 py-6 text-sm text-stone-400 font-light text-center">
              Sin notificaciones.
            </p>
          )}

          {(data?.items ?? []).map((n) => (
            <button
              key={n.idNotificacion}
              onClick={() =>
                void abrirItem(n.idNotificacion, n.tipo, n.idSubasta)
              }
              className={`w-full text-left px-4 py-3 border-b border-stone-50
                          hover:bg-stone-50 transition-colors cursor-pointer
                          ${!n.leido ? "bg-stone-50" : ""}`}
            >
              <div className="flex items-start justify-between gap-2">
                <p
                  className={`text-xs leading-relaxed ${
                    n.leido ? "text-stone-400 font-light" : "text-stone-700"
                  }`}
                >
                  {n.mensaje}
                </p>
                {!n.leido && (
                  <span className="w-2 h-2 rounded-full bg-red-600 shrink-0 mt-1" />
                )}
              </div>
              <span className="text-[9px] font-mono text-stone-400 uppercase tracking-wider">
                {n.tipo} · {formatearFecha(n.fechaEnvio)}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

