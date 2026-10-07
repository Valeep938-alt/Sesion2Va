"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { io } from "socket.io-client";
import axios from "axios";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/store/authStore";

interface EventoPush {
  tipo:
    | "RECHAZO"
    | "APROBACION"
    | "INICIO_SUBASTA"
    | "VICTORIA"
    | "RENOVACION"
    | "PAGO_CONFIRMADO"
    | "ACCESO";
  titulo: string;
  mensaje: string;
  idSubasta?: string;
}

export function NotificacionesPush() {
  const accessToken = useAuthStore((s) => s.accessToken);
  const refreshToken = useAuthStore((s) => s.refreshToken);
  const userId = useAuthStore((s) => s.user?.id);
  const queryClient = useQueryClient();
  const router = useRouter();

  useEffect(() => {
    if (!accessToken || !userId) return;

    let reintentado = false;

    const socket = io(`${process.env.NEXT_PUBLIC_WS_URL}/notifications`, {
      auth: { token: accessToken },
      transports: ["websocket"],
    });

    socket.on("connect", () => {
      socket.emit("joinRoom", userId);
    });

    socket.on("notificacion", (e: EventoPush) => {
      if (e.tipo === "VICTORIA") {
        toast.success(e.titulo, {
          description: e.mensaje,
          action: {
            label: "Ir a pagar →",
            onClick: () => router.push("/pagos"),
          },
        });
      } else if (e.tipo === "RENOVACION") {
        toast(e.titulo, {
          description: e.mensaje,
          action: {
            label: "Reformular lote",
            onClick: () => router.push("/mis-subastas"),
          },
        });
      } else if (e.tipo === "PAGO_CONFIRMADO") {
        toast.success(e.titulo, {
          description: e.mensaje,
          action: {
            label: "Ver pagos",
            onClick: () => router.push("/pagos"),
          },
        });
      } else if (e.tipo === "RECHAZO") {
        toast.error(e.titulo, {
          description: e.mensaje,
          action: {
            label: "Ver motivo",
            onClick: () => router.push("/mis-subastas"),
          },
        });
      } else {
        toast.success(e.titulo, {
          description: e.mensaje,
          action: {
            label: "Ver mis lotes",
            onClick: () => router.push("/mis-subastas"),
          },
        });
      }

      void queryClient.invalidateQueries({ queryKey: ["subastas"] });
      void queryClient.invalidateQueries({ queryKey: ["pagos"] });
    });

    socket.on("exception", async (e: { message?: string }) => {
      if (e?.message?.includes("Token") && !reintentado) {
        reintentado = true;
        try {
          if (!refreshToken) return;
          const { data } = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api"}/auth/refresh`,
            { refresh_token: refreshToken },
          );
          useAuthStore
            .getState()
            .actualizarTokens(data.access_token, data.refresh_token);
          socket.auth = { token: data.access_token };
          socket.disconnect();
          socket.connect();
        } catch {
          /* el interceptor de REST maneja el logout */
        }
      }
    });

    return () => {
      socket.removeAllListeners();
      socket.disconnect();
    };
  }, [accessToken, refreshToken, userId, queryClient, router]);

  return null;
}

