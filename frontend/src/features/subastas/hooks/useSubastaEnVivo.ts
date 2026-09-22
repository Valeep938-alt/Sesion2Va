"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { io, type Socket } from "socket.io-client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAuthStore } from "@/store/authStore";
import {
  pujaService,
  type PujaPublica,
  type SnapshotSubasta,
} from "@/api/services/pujaService";
import { refrescarSesion } from "@/utils/helpers/session-refresh";
import { formatearMoneda } from "@/utils/formatters";
import type { PujaEnVivo } from "../types";

interface EstadoWS {
  conectado: boolean;
  recibioSnapshot: boolean;
  precioActual: number | null;
  fechaFin: string | null;
  limiteUsuarios: number | null;
  participantes: number;
  extendida: boolean;
  cerrada: boolean;
  montoFinal: string | number | null;
  salaLlena: boolean;
  esDueño: boolean;
  offsetReloj: number;
  pujas: PujaEnVivo[];
}

const ESTADO_WS_INICIAL: EstadoWS = {
  conectado: false,
  recibioSnapshot: false,
  precioActual: null,
  fechaFin: null,
  limiteUsuarios: null,
  participantes: 0,
  extendida: false,
  cerrada: false,
  montoFinal: null,
  salaLlena: false,
  esDueño: false,
  offsetReloj: 0,
  pujas: [],
};

interface RespuestaPuja {
  ok: boolean;
  code?: string;
  message?: string;
}

function mapearPuja(p: PujaPublica): PujaEnVivo {
  return {
    idPuja: p.id,
    monto: String(p.monto),
    pujador: p.usuario || "Anónimo",
    precioActual: String(p.monto),
    participantes: 0,
    timestamp: p.fecha ? new Date(p.fecha).getTime() : Date.now(),
  };
}

export function useSubastaEnVivo(idSubasta: string) {
  const [ws, setWs] = useState<EstadoWS>(ESTADO_WS_INICIAL);
  const socketRef = useRef<Socket | null>(null);
  const accessToken = useAuthStore((s) => s.accessToken);
  const queryClient = useQueryClient();
  const router = useRouter();

  const esEspectador = !accessToken || ws.salaLlena;

  const { data: rest } = useQuery({
    queryKey: ["pujas", "estado", idSubasta],
    queryFn: () => pujaService.getEstado(idSubasta),
    refetchInterval: esEspectador ? 5_000 : false,
  });

  const restPujas = useMemo(
    () => (rest?.historial ?? []).map(mapearPuja),
    [rest],
  );

  const precioActual = ws.precioActual ?? (rest ? rest.precioActual : null);
  const pujas = ws.recibioSnapshot ? ws.pujas : restPujas;
  const fechaFin = ws.fechaFin ?? rest?.fechaFin ?? null;
  const limiteUsuarios =
    ws.limiteUsuarios ?? rest?.limiteUsuariosConcurrentes ?? null;
  const esDueño = ws.esDueño || Boolean(rest?.esDueño);
  const cerrada = ws.cerrada || rest?.estado === "Finalizada";
  const montoFinal = ws.montoFinal ?? (cerrada ? precioActual : null);
  const participantes = ws.conectado
    ? ws.participantes
    : (rest?.participantes ?? 0);

  const fechaFinSincronizada = useMemo(() => {
    if (!fechaFin) return null;
    return new Date(
      new Date(fechaFin).getTime() - ws.offsetReloj,
    ).toISOString();
  }, [fechaFin, ws.offsetReloj]);

  useEffect(() => {
    const token = useAuthStore.getState().accessToken;
    if (!token || !idSubasta) return;

    let reintentado = false;

    const socket: Socket = io(`${process.env.NEXT_PUBLIC_WS_URL}/auctions`, {
      auth: { token },
      transports: ["websocket"],
      reconnectionDelay: 2_000,
      reconnectionDelayMax: 30_000,
      reconnectionAttempts: 5,
    });
    socketRef.current = socket;

    socket.on("connect", () => {
      setWs((prev) => ({ ...prev, conectado: true, salaLlena: false }));
      socket.emit("joinSubasta", { subastaId: idSubasta });
    });

    socket.io.on("reconnect_failed", () => {
      setWs((prev) => ({ ...prev, conectado: false }));
    });

    socket.on("disconnect", () =>
      setWs((prev) => ({ ...prev, conectado: false })),
    );

    socket.on("subasta:snapshot", (snap: SnapshotSubasta) => {
      setWs((prev) => ({
        ...prev,
        recibioSnapshot: true,
        offsetReloj: (snap.servidorAhora ?? Date.now()) - Date.now(),
        precioActual: snap.precioActual,
        fechaFin: snap.fechaFin,
        limiteUsuarios: snap.limiteUsuariosConcurrentes,
        esDueño: Boolean(snap.esDueño),
        cerrada: snap.estado === "Finalizada",
        montoFinal: snap.estado === "Finalizada" ? snap.precioActual : null,
        pujas: (snap.historial ?? []).map(mapearPuja),
      }));
    });

    socket.on("sala:participantes", (e: { total: number }) => {
      setWs((prev) => ({ ...prev, participantes: e.total }));
    });

    socket.on("puja:nueva", (puja: PujaPublica) => {
      const p = mapearPuja(puja);
      setWs((prev) => ({
        ...prev,
        precioActual: Number(p.monto),
        pujas: [p, ...prev.pujas.filter((x) => x.idPuja !== p.idPuja)].slice(
          0,
          10,
        ),
      }));
    });

    socket.on("puja:superado", (e: { nuevoPrecio: number }) => {
      toast.warning("Te superaron en la puja", {
        description: `Nuevo precio: ${formatearMoneda(e.nuevoPrecio)} — ¡puja de nuevo!`,
      });
    });

    socket.on(
      "subasta:tiempo",
      (e: { fechaFin: string; servidorAhora: number; extendida: boolean }) => {
        setWs((prev) => ({
          ...prev,
          offsetReloj: (e.servidorAhora ?? Date.now()) - Date.now(),
          fechaFin: e.fechaFin,
          extendida: Boolean(e.extendida),
        }));
      },
    );

    socket.on(
      "subasta:cerrada",
      (e: { montoFinal: string | number | null }) => {
        setWs((prev) => ({ ...prev, cerrada: true, montoFinal: e.montoFinal }));
        void queryClient.invalidateQueries({
          queryKey: ["pujas", "estado", idSubasta],
        });
      },
    );

    socket.on("subasta:iniciada", () => {
      setWs((prev) => ({ ...prev, cerrada: false }));
    });

    socket.on("subasta:error", (e: { code: string; message: string }) => {
      if (e.code === "SALA_LLENA") {
        setWs((prev) => ({ ...prev, salaLlena: true }));
        return;
      }
      if (e.message) toast.error(e.message);
    });

    socket.on("exception", async (e: { message?: string }) => {
      if (e?.message?.includes("Token") && !reintentado) {
        reintentado = true;
        const nuevoToken = await refrescarSesion();
        if (nuevoToken) {
          socket.auth = { token: nuevoToken };
          socket.disconnect();
          socket.connect();
        } else {
          useAuthStore.getState().logout();
          router.push("/auth?mode=login");
        }
      }
    });

    return () => {
      socket.removeAllListeners();
      socket.io.removeAllListeners();
      socket.disconnect();
      socketRef.current = null;
    };
  }, [idSubasta, queryClient, router]);

  const enviarPuja = useCallback(
    (monto: number) =>
      new Promise<RespuestaPuja>((resolve) => {
        const socket = socketRef.current;
        if (!socket || !socket.connected) {
          resolve({
            ok: false,
            message:
              "Sin conexión con la sala. Espera la reconexión e intenta de nuevo.",
          });
          return;
        }

        const timeout = setTimeout(() => {
          resolve({
            ok: false,
            message: "El servidor no respondió. Intenta de nuevo.",
          });
        }, 10_000);

        socket.emit(
          "nuevaPuja",
          { subastaId: idSubasta, monto },
          (respuesta: RespuestaPuja | undefined) => {
            clearTimeout(timeout);
            resolve(respuesta ?? { ok: true });
          },
        );
      }),
    [idSubasta],
  );

  return {
    precioActual,
    pujas,
    participantes,
    conectado: ws.conectado,
    fechaFin: fechaFinSincronizada,
    extendida: ws.extendida,
    cerrada,
    montoFinal,
    salaLlena: ws.salaLlena,
    limiteUsuarios,
    esDueño,
    espectador: esEspectador,
    enviarPuja,
  };
}
