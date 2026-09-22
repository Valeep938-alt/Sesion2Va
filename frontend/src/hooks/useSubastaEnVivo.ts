"use client";

import { useEffect, useState } from "react";
import { io, type Socket } from "socket.io-client";
import { useAuthStore } from "@/store/authStore";
import type { AuctionCerrada, PujaEnVivo } from "./../features/subastas/types";

interface DatosSubastaEnVivo {
  precioActual: string | null;
  pujas: PujaEnVivo[];
  participantes: number;
  conectado: boolean;
  fechaFin: string | null;
  extendida: boolean;
  cerrada: boolean;
  montoFinal: string | null;
}

const ESTADO_INICIAL: DatosSubastaEnVivo = {
  precioActual: null,
  pujas: [],
  participantes: 0,
  conectado: false,
  fechaFin: null,
  extendida: false,
  cerrada: false,
  montoFinal: null,
};

export function useSubastaEnVivo(idSubasta: string): DatosSubastaEnVivo {
  const [datos, setDatos] = useState<DatosSubastaEnVivo>(ESTADO_INICIAL);

  useEffect(() => {
    const token = useAuthStore.getState().accessToken;
    if (!token || !idSubasta) return;

    const socket: Socket = io(`${process.env.NEXT_PUBLIC_WS_URL}/auctions`, {
      auth: { token },
      transports: ["websocket"],
    });

    socket.on("connect", () => {
      setDatos((prev) => ({ ...prev, conectado: true }));
      socket.emit("joinAuction", { auctionId: idSubasta });
    });

    socket.on("disconnect", () =>
      setDatos((prev) => ({ ...prev, conectado: false })),
    );

    socket.on("bidUpdate", (evento: PujaEnVivo) => {
      setDatos((prev) => ({
        ...prev,
        precioActual: evento.precioActual,
        participantes: evento.participantes,
        fechaFin: evento.fechaFin ?? prev.fechaFin,
        extendida: Boolean(evento.extendida),
        pujas: [evento, ...prev.pujas].slice(0, 10),
      }));
    });

    socket.on("auctionClosed", (e: AuctionCerrada) => {
      setDatos((prev) => ({
        ...prev,
        cerrada: true,
        montoFinal: e.montoFinal,
      }));
    });

    return () => socket.disconnect();
  }, [idSubasta]);

  return datos;
}
