"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { useMisSubastas } from "../hooks/useMisSubastas";
import { obtenerMensajeError } from "@/utils/helpers/error-messages";
import { CONFIG_ESTADOS, type EstadoSubasta } from "../types";
import { CardSubasta } from "./CardSubasta";

const FILTROS: { id: "todas" | EstadoSubasta; etiqueta: string }[] = [
  { id: "todas", etiqueta: "Todas" },
  { id: "Pendiente", etiqueta: "En revisión" },
  { id: "Aprobada", etiqueta: "Programadas" },
  { id: "Activa", etiqueta: "En vivo" },
  { id: "Finalizada", etiqueta: "Finalizadas" },
  { id: "Rechazada", etiqueta: "Rechazadas" },
];

export function MisSubastasView() {
  const { data: subastas, isPending, isError, error } = useMisSubastas();
  const [filtro, setFiltro] = useState<"todas" | EstadoSubasta>("todas");

  const stats = useMemo(() => {
    const lista = subastas ?? [];
    return {
      total: lista.length,
      revision: lista.filter((s) => s.estado === "Pendiente").length,
      activas: lista.filter((s) => s.estado === "Activa").length,
      finalizadas: lista.filter((s) => s.estado === "Finalizada").length,
    };
  }, [subastas]);

  const subastasFiltradas = useMemo(
    () =>
      filtro === "todas"
        ? (subastas ?? [])
        : (subastas ?? []).filter((s) => s.estado === filtro),
    [subastas, filtro],
  );

  return (
    <div className="min-h-screen bg-[#F9F8F6] text-stone-900 selection:bg-stone-900 selection:text-white">
      {/* Cabecera Editorial — mismo patrón de la home */}
      <section className="pt-20 pb-12 px-6 max-w-7xl mx-auto border-b border-stone-200">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-2xl"
          >
            <span className="text-xs font-mono tracking-[0.3em] uppercase text-stone-500 block mb-3">
              Panel del Subastador &middot; Gestión 2026
            </span>
            <h1 className="text-4xl sm:text-6xl font-serif font-normal tracking-tight text-stone-900 leading-[1.1]">
              Mis lotes y su{" "}
              <span className="italic font-light">trayectoria</span>.
            </h1>
            <p className="mt-4 text-stone-600 text-base sm:text-lg font-light leading-relaxed">
              Supervisa el estado de aprobación, el pulso en vivo y el resultado
              de cada pieza que has publicado.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            <Link
              href="/mis-subastas/nueva"
              className="inline-block px-6 py-3.5 bg-stone-900 hover:bg-stone-800 text-white text-xs uppercase tracking-widest font-mono transition-all rounded-none shadow-sm"
            >
              + Publicar Lote
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Strip de estadísticas rápidas */}
      <section className="max-w-7xl mx-auto px-6 py-8 border-b border-stone-200 bg-white shadow-xs">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { etiqueta: "Total publicados", valor: stats.total },
            { etiqueta: "En revisión", valor: stats.revision },
            { etiqueta: "En vivo ahora", valor: stats.activas },
            { etiqueta: "Finalizados", valor: stats.finalizadas },
          ].map((s) => (
            <div key={s.etiqueta}>
              <span className="text-[10px] font-mono uppercase tracking-widest text-stone-500 block">
                {s.etiqueta}
              </span>
              <span className="text-3xl font-serif font-semibold text-stone-900 tabular-nums mt-1 block">
                {isPending ? "··" : s.valor}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Pills de filtro por estado */}
      <section className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {FILTROS.map((f) => (
            <button
              key={f.id}
              onClick={() => setFiltro(f.id)}
              className={`shrink-0 font-mono text-[11px] uppercase tracking-widest px-4 py-2 transition-colors ${
                filtro === f.id
                  ? "bg-stone-900 text-white"
                  : "bg-white border border-stone-200 text-stone-600 hover:border-stone-400"
              }`}
            >
              {f.etiqueta}
            </button>
          ))}
        </div>
      </section>

      {/* Grid de lotes */}
      <main className="max-w-7xl mx-auto px-6 pb-20">
        {isError && (
          <div className="text-center py-16 border border-dashed border-stone-300">
            <p className="text-stone-600 font-serif text-lg">
              {obtenerMensajeError(error)}
            </p>
          </div>
        )}

        {isPending && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-96 border border-stone-200 bg-white animate-pulse"
              />
            ))}
          </div>
        )}

        {!isPending && subastasFiltradas.length === 0 && (
          <div className="text-center py-24 border border-dashed border-stone-300">
            <p className="text-stone-600 font-serif text-lg">
              {filtro === "todas"
                ? "Todavía no has publicado ningún lote."
                : `No tienes lotes en estado "${CONFIG_ESTADOS[filtro as EstadoSubasta]?.etiqueta ?? filtro}".`}
            </p>
            {filtro === "todas" && (
              <Link
                href="/mis-subastas/nueva"
                className="mt-4 inline-block text-xs font-mono uppercase tracking-widest text-stone-900 underline underline-offset-4"
              >
                Publica el primero →
              </Link>
            )}
          </div>
        )}

        {subastasFiltradas.length > 0 && (
          <motion.div
            initial="hidden"
            animate="show"
            variants={{
              hidden: { opacity: 0 },
              show: { opacity: 1, transition: { staggerChildren: 0.05 } },
            }}
            className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12"
          >
            {subastasFiltradas.map((s) => (
              <motion.div
                key={s.idSubasta}
                variants={{
                  hidden: { opacity: 0, y: 15 },
                  show: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
                  },
                }}
              >
                <CardSubasta subasta={s} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </main>
    </div>
  );
}
