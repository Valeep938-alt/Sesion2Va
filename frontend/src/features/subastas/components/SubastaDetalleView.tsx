"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { motion } from "motion/react";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/store/authStore";
import { ImagenConFallback } from "@/components/ui/ImagenConFallback";
import { Countdown } from "@/components/ui/Countdown";
import { Estrellas } from "@/components/ui/Estrellas";
import { useSubastaDetalle } from "../hooks/useSubastaDetalle";
import {
  useInscribirse,
  useCancelarInscripcion,
} from "../hooks/useInscripciones";
import { obtenerMensajeError } from "@/utils/helpers/error-messages";
import { formatearMoneda, formatearFechaHora } from "@/utils/formatters";
import { calificacionService } from "@/api/services/calificacionService";
import { PanelCalificacion } from "@/features/calificaciones/components/PanelCalificacion";
import { EstadoBadge } from "./EstadoBadge";
import { SubastaPrivada } from "./SubastaPrivada";
import type { SubastaDetalle } from "../types";

export function SubastaDetalleView() {
  const params = useParams<{ id: string }>();
  const id = params.id as string;
  const router = useRouter();
  const [accesoSolicitado, setAccesoSolicitado] = useState(false);

  const { data, isPending, isError } = useSubastaDetalle(id);
  const inscribirse = useInscribirse();
  const cancelarInscripcion = useCancelarInscripcion();

  const user = useAuthStore((state) => state.user);

  const idSubastador = data?.subasta?.subastador?.id ?? null;
  const { data: reputacion } = useQuery({
    queryKey: ["calificaciones", "reputacion", idSubastador],
    queryFn: () => calificacionService.reputacion(idSubastador!),
    enabled: Boolean(idSubastador),
    staleTime: 60_000,
  });

  if (isPending) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
          className="w-10 h-10 border-2 border-stone-200 border-t-stone-900 rounded-full"
        />
        <p className="text-xs font-mono uppercase tracking-widest text-stone-400">
          Cargando sala...
        </p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3">
        <p className="text-xl font-serif text-stone-900">
          No se pudo cargar la subasta.
        </p>
        <Link
          href="/"
          className="text-xs font-mono uppercase tracking-widest text-stone-500 underline underline-offset-4"
        >
          Volver al catálogo
        </Link>
      </div>
    );
  }


  const s: SubastaDetalle = data.subasta!;
  const isUpcoming = new Date(s.fechaInicio) > new Date();
  const isActive = s.estado === "Activa" && !isUpcoming;
  const esVendedor = Boolean(user?.id && user.id === s.subastador.id);

  return (
    <div className="bg-[#F9F8F6] min-h-[70vh] py-12 px-6">
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white border border-stone-200 p-8 md:p-10 rounded-3xl shadow-sm space-y-8">
          <div className="flex items-center justify-between">
            <EstadoBadge estado={s.estado} />
            <button
              onClick={() => router.back()}
              className="text-xs font-mono uppercase tracking-widest text-stone-500 hover:text-stone-900 transition-colors"
            >
              ← Volver
            </button>
          </div>

          <div className="space-y-3">
            <ImagenConFallback
              src={s.imagenes[0]?.url}
              alt={s.titulo}
              className="w-full h-72 object-cover bg-stone-100"
            />
            {s.imagenes.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                {s.imagenes.map((img) => (
                  <ImagenConFallback
                    key={img.idImagen}
                    src={img.url}
                    alt={s.titulo}
                    className="h-16 w-24 shrink-0 object-cover border border-stone-200 cursor-pointer hover:border-stone-900 transition-colors"
                  />
                ))}
              </div>
            )}
          </div>

          <div>
            <h1 className="text-4xl font-serif font-normal text-stone-900">
              {s.titulo}
            </h1>
            <p className="text-stone-600 mt-4 font-light leading-relaxed">
              {s.descripcion ?? "Sin descripción proporcionada."}
            </p>
          </div>

          <div className="p-6 md:p-8 bg-stone-50 border border-stone-200 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="text-center sm:text-left">
              <span className="text-xs font-mono uppercase tracking-widest text-stone-500 block">
                Precio Base
              </span>
              <span className="text-4xl font-serif font-semibold text-stone-900 tabular-nums">
                {formatearMoneda(s.precioBase)}
              </span>
              <span className="block text-xs font-mono text-stone-400 mt-2 uppercase tracking-wider">
                {isActive ? (
                  <>
                    Cierra en <Countdown fechaFin={s.fechaFin} />
                  </>
                ) : isUpcoming ? (
                  <>Inicia {formatearFechaHora(s.fechaInicio)}</>
                ) : (
                  formatearFechaHora(s.fechaFin)
                )}
              </span>
            </div>

            <div className="flex flex-col items-stretch gap-2 w-full sm:w-auto">
              {isActive ? (
                <Link
                  href={`/subastas/${s.idSubasta}/en-vivo`}
                  className="text-center px-8 py-3.5 bg-stone-900 hover:bg-stone-800 text-white font-mono text-[11px] uppercase tracking-widest transition-colors"
                >
                  Entrar a la Sala
                </Link>
              ) : isUpcoming ? (
                <span className="text-center px-6 py-3 bg-stone-200 text-stone-600 font-mono text-[10px] uppercase tracking-widest">
                  Esperando inicio…
                </span>
              ) : (
                <span className="text-center px-6 py-3 bg-stone-100 text-stone-500 font-mono text-[10px] uppercase tracking-widest border border-stone-200">
                  Subasta finalizada
                </span>
              )}

              {user && !esVendedor && s.estado !== "Finalizada" && (
                <>
                  <button
                    onClick={() =>
                      inscribirse.mutate(id, {
                        onSuccess: (r) =>
                          r?.mensaje && toast.success(r.mensaje),
                        onError: (e) => toast.error(obtenerMensajeError(e)),
                      })
                    }
                    disabled={inscribirse.isPending}
                    className="px-6 py-2.5 border border-stone-300 text-stone-700 font-mono
                               text-[10px] uppercase tracking-widest hover:border-stone-900
                               hover:text-stone-900 transition-colors disabled:opacity-50"
                  >
                    {inscribirse.isPending ? "..." : "Apartar mi inscripción"}
                  </button>
                  <button
                    onClick={() =>
                      cancelarInscripcion.mutate(id, {
                        onSuccess: (r) => r?.mensaje && toast(r.mensaje),
                        onError: (e) => toast.error(obtenerMensajeError(e)),
                      })
                    }
                    className="text-[9px] font-mono uppercase tracking-widest
                               text-stone-400 underline underline-offset-4
                               hover:text-stone-700"
                  >
                    cancelar inscripción
                  </button>
                </>
              )}

              {esVendedor && (
                <span className="text-[9px] font-mono uppercase tracking-widest text-stone-400 text-center">
                  Eres el subastador de este lote
                </span>
              )}
            </div>
          </div>

          {s.estado === "Pendiente" && (
            <p className="text-sm text-amber-700 bg-amber-50 border-l-2 border-amber-600 p-4 font-light">
              Este lote está en revisión por un administrador. Aún no es visible
              en el catálogo.
            </p>
          )}
          {s.estado === "Rechazada" && s.motivoRechazo && (
            <p className="text-sm text-red-700 bg-red-50 border-l-2 border-red-700 p-4 font-light">
              Lote rechazado: {s.motivoRechazo}
            </p>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-white border border-stone-200 p-6 rounded-3xl shadow-sm">
            <h3 className="text-sm font-mono uppercase tracking-widest text-stone-900 mb-4 border-b border-stone-100 pb-3">
              Detalles del Lote
            </h3>
            <dl className="space-y-3 text-sm text-stone-600">
              <div className="flex justify-between">
                <dt className="font-mono text-[10px] uppercase tracking-widest text-stone-400">
                  Categoría
                </dt>
                <dd>{s.categoria?.nombre ?? "—"}</dd>
              </div>
              <div className="flex justify-between items-center gap-2">
                <dt className="font-mono text-[10px] uppercase tracking-widest text-stone-400 shrink-0">
                  Subastador
                </dt>
                <dd className="flex items-center gap-2 min-w-0">
                  {/*  Nombre → link al perfil del vendedor */}
                  {s.subastador.id ? (
                    <Link
                      href={`/vendedores/${s.subastador.id}`}
                      className="truncate underline underline-offset-2 hover:text-stone-900 transition-colors"
                      title={s.subastador.correo}
                    >
                      {s.subastador.nombre}
                    </Link>
                  ) : (
                    <span className="truncate">{s.subastador.nombre}</span>
                  )}
                  {reputacion && reputacion.total > 0 && (
                    <Estrellas
                      promedio={reputacion.promedio}
                      className="shrink-0"
                    />
                  )}
                </dd>
              </div>
            </dl>
          </div>

          <div className="bg-white border border-stone-200 p-6 rounded-3xl shadow-sm">
            <h3 className="text-sm font-mono uppercase tracking-widest text-stone-900 mb-4 border-b border-stone-100 pb-3">
              Reglas del Lote
            </h3>
            <ul className="text-xs text-stone-600 space-y-3 font-light leading-relaxed">
              <li>• Incremento mínimo: {s.incrementoMinimoPct}%</li>
              <li>• {s.politicaEnvio}</li>
              <li>
                •{" "}
                {s.requiereReserva
                  ? "Acceso con reserva previa"
                  : "Acceso público"}
              </li>
              {s.esPrivada && <li>• Sala privada por invitación.</li>}
              <li>• Comisiones del 5% sobre el precio final.</li>
            </ul>
          </div>

          {/* El GANADOR califica al subastador (estrellas + comentario) */}
          {s.estado === "Finalizada" && s.esGanador && (
            <PanelCalificacion idSubasta={s.idSubasta} />
          )}
        </div>
      </div>
    </div>
  );
}
