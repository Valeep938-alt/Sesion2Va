"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import { ImagenConFallback } from "@/components/ui/ImagenConFallback";
import { usePendientesModeracion } from "../hooks/usePendientesModeracion";
import { useResolverSubasta } from "../hooks/useResolverSubasta";
import { obtenerMensajeError } from "@/utils/helpers/error-messages";
import { formatearMoneda, formatearFecha } from "@/utils/formatters";
import type { SubastaResumen } from "../types";

export function ModeracionView() {
  const {
    data: pendientes,
    isPending,
    isError,
    error,
  } = usePendientesModeracion();
  const resolver = useResolverSubasta();

  const [motivoEnEdicion, setMotivoEnEdicion] = useState<string | null>(null);
  const [textoMotivo, setTextoMotivo] = useState("");

  function aprobar(lote: SubastaResumen) {
    resolver.mutate(
      { idSubasta: lote.idSubasta, aprobar: true },
      {
        onSuccess: () =>
          toast.success(
            `"${lote.titulo}" aprobada — programada para su fecha de inicio.`,
          ),
        onError: (e) => toast.error(obtenerMensajeError(e)),
      },
    );
  }

  function confirmarRechazo(lote: SubastaResumen) {
    if (!textoMotivo.trim()) {
      toast.error("Escribe el motivo del rechazo para el subastador.");
      return;
    }
    resolver.mutate(
      { idSubasta: lote.idSubasta, aprobar: false, motivo: textoMotivo.trim() },
      {
        onSuccess: () => {
          toast.success(
            `"${lote.titulo}" rechazada con motivo enviado al subastador.`,
          );
          setMotivoEnEdicion(null);
          setTextoMotivo("");
        },
        onError: (e) => toast.error(obtenerMensajeError(e)),
      },
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F8F6] text-stone-900 selection:bg-stone-900 selection:text-white">
      {/* Cabecera editorial */}
      <section className="pt-20 pb-12 px-6 max-w-7xl mx-auto border-b border-stone-200">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-2xl"
        >
          <span className="text-xs font-mono tracking-[0.3em] uppercase text-stone-500 block mb-3">
            Panel de Administración &middot; Verificación de Legitimidad
          </span>
          <h1 className="text-4xl sm:text-6xl font-serif font-normal tracking-tight text-stone-900 leading-[1.1]">
            Lotes en{" "}
            <span className="italic font-light">espera de revisión</span>.
          </h1>
          <p className="mt-4 text-stone-600 text-base sm:text-lg font-light leading-relaxed">
            Verifica que el producto, las imágenes y la política de envío sean
            legítimos antes de publicarlos al catálogo.
          </p>
        </motion.div>
      </section>

      <main className="max-w-5xl mx-auto px-6 py-12">
        {isError && (
          <div className="text-center py-16 border border-dashed border-stone-300">
            <p className="text-stone-600 font-serif text-lg">
              {obtenerMensajeError(error)}
            </p>
          </div>
        )}

        {isPending && (
          <div className="space-y-6">
            {Array.from({ length: 2 }).map((_, i) => (
              <div
                key={i}
                className="h-48 bg-white border border-stone-200 animate-pulse"
              />
            ))}
          </div>
        )}

        {!isPending && pendientes?.length === 0 && (
          <div className="text-center py-24 border border-dashed border-stone-300">
            <p className="text-stone-600 font-serif text-xl">
              No hay lotes pendientes de revisión.
            </p>
            <p className="text-xs font-mono uppercase tracking-widest text-stone-400 mt-3">
              El catálogo está al día — todo aprobado o rechazado
            </p>
          </div>
        )}

        <div className="space-y-6">
          {pendientes?.map((lote, i) => (
            <motion.article
              key={lote.idSubasta}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: Math.min(i * 0.05, 0.3),
                duration: 0.35,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="bg-white border border-stone-200 shadow-sm"
            >
              <div className="grid grid-cols-1 md:grid-cols-[220px_1fr]">
                {/* Imagen principal */}
                <div className="border-b md:border-b-0 md:border-r border-stone-100">
                  <ImagenConFallback
                    src={lote.imagenes?.[0]?.url}
                    alt={lote.titulo}
                    className="w-full h-48 md:h-full object-cover bg-stone-100"
                  />
                </div>

                {/* Contenido */}
                <div className="p-6 md:p-8 space-y-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-widest text-stone-400 block">
                        Lote #{lote.idSubasta} &middot;{" "}
                        {lote.idCategoria2?.nombre ?? "—"}
                        {lote.esPrivada && " · Privada"}
                      </span>
                      <h2 className="text-2xl font-serif font-normal text-stone-900 mt-1">
                        {lote.titulo}
                      </h2>
                    </div>
                    <span className="text-2xl font-serif font-semibold text-stone-900 tabular-nums">
                      {formatearMoneda(lote.precioBase)}
                    </span>
                  </div>

                  {lote.descripcion && (
                    <p className="text-stone-600 text-sm font-light leading-relaxed line-clamp-2">
                      {lote.descripcion}
                    </p>
                  )}

                  {/* Mini galería si hay más imágenes */}
                  {lote.imagenes && lote.imagenes.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto scrollbar-none">
                      {lote.imagenes.map((img) => (
                        <ImagenConFallback
                          key={img.idImagen}
                          src={img.url}
                          alt={lote.titulo}
                          className="h-14 w-20 shrink-0 object-cover border border-stone-200"
                        />
                      ))}
                    </div>
                  )}

                  <dl className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm border-t border-stone-100 pt-4">
                    <div>
                      <dt className="text-[10px] font-mono uppercase tracking-widest text-stone-400">
                        Inicio programado
                      </dt>
                      <dd className="text-stone-700">
                        {formatearFecha(lote.fechaInicio)}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-[10px] font-mono uppercase tracking-widest text-stone-400">
                        Incremento
                      </dt>
                      <dd className="text-stone-700">
                        {lote.incrementoMinimoPct}%
                      </dd>
                    </div>
                  </dl>

                  {/* Acciones */}
                  <div className="flex flex-wrap gap-3 pt-2">
                    <button
                      onClick={() => aprobar(lote)}
                      disabled={resolver.isPending}
                      className="px-6 py-3 bg-stone-900 hover:bg-stone-800 text-white
                                 text-[11px] uppercase tracking-widest font-mono
                                 transition-colors disabled:opacity-50"
                    >
                      Aprobar Lote
                    </button>
                    <button
                      onClick={() =>
                        setMotivoEnEdicion(
                          motivoEnEdicion === lote.idSubasta
                            ? null
                            : lote.idSubasta,
                        )
                      }
                      disabled={resolver.isPending}
                      className="px-6 py-3 border border-stone-300 hover:border-red-700
                                 hover:text-red-700 text-stone-700 text-[11px]
                                 uppercase tracking-widest font-mono transition-colors
                                 disabled:opacity-50"
                    >
                      Rechazar…
                    </button>
                    <a
                      href={`/subastas/${lote.idSubasta}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 py-3 text-[11px] uppercase tracking-widest font-mono
                                 text-stone-500 underline underline-offset-4
                                 hover:text-stone-900 transition-colors"
                    >
                      Ver detalle completo ↗
                    </a>
                  </div>

                  <AnimatePresence>
                    {motivoEnEdicion === lote.idSubasta && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="bg-red-50 border-l-2 border-red-700 p-4 space-y-3">
                          <label
                            className="block text-[10px] font-mono uppercase
                                             tracking-widest text-red-700"
                          >
                            Motivo del rechazo (visible para el subastador)
                          </label>
                          <textarea
                            value={textoMotivo}
                            onChange={(e) => setTextoMotivo(e.target.value)}
                            rows={2}
                            placeholder="Ej: Las imágenes no corresponden al producto descrito…"
                            className="w-full bg-white border border-red-200 px-3 py-2
                                       text-stone-900 text-sm focus:outline-none
                                       focus:border-red-700 transition-colors resize-none"
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={() => confirmarRechazo(lote)}
                              disabled={resolver.isPending}
                              className="px-5 py-2.5 bg-red-700 hover:bg-red-800 text-white
                                         text-[10px] uppercase tracking-widest font-mono
                                         transition-colors disabled:opacity-50"
                            >
                              Confirmar Rechazo
                            </button>
                            <button
                              onClick={() => {
                                setMotivoEnEdicion(null);
                                setTextoMotivo("");
                              }}
                              className="px-5 py-2.5 border border-stone-300 text-stone-600
                                         text-[10px] uppercase tracking-widest font-mono
                                         hover:border-stone-900 transition-colors"
                            >
                              Cancelar
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </main>
    </div>
  );
}
