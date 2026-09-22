"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "motion/react";
import { usePerfilVendedor } from "../hooks/useVendedores";
import { Estrellas } from "@/components/ui/Estrellas";
import { ImagenConFallback } from "@/components/ui/ImagenConFallback";
import { Countdown } from "@/components/ui/Countdown";
import { EstadoBadge } from "@/features/subastas/components/EstadoBadge";
import { formatearMoneda, formatearFecha } from "@/utils/formatters";

const ESTADO_SUBASTA: Record<string, string> = {
  Aprobada: "Pendiente",
  Activa: "Activa",
  Finalizada: "Finalizada",
};

export function PerfilVendedorView() {
  const params = useParams<{ id: string }>();
  const id = params.id as string;
  const { data: v, isPending, isError } = usePerfilVendedor(id);

  if (isPending) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center text-stone-400 font-mono text-xs uppercase tracking-widest">
        Cargando perfil…
      </div>
    );
  }

  if (isError || !v) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3">
        <p className="text-xl font-serif text-stone-900">
          Vendedor no encontrado.
        </p>
        <Link
          href="/vendedores"
          className="text-xs font-mono uppercase tracking-widest text-stone-500 underline underline-offset-4"
        >
          Volver a vendedores
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F8F6] text-stone-900">
      {/* Cabecera del perfil */}
      <section className="pt-20 pb-10 px-6 max-w-5xl mx-auto border-b border-stone-200">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center gap-6"
        >
          <span className="w-20 h-20 rounded-full bg-stone-900 text-white grid place-items-center font-serif text-4xl shrink-0">
            {v.nombre.charAt(0).toUpperCase()}
          </span>
          <div>
            <h1 className="text-3xl sm:text-4xl font-serif font-normal text-stone-900">
              {v.nombre}
            </h1>
            <div className="flex items-center gap-3 mt-2">
              <Estrellas promedio={v.reputacion.promedio} className="text-lg" />
              <span className="text-xs font-mono text-stone-400">
                {v.reputacion.promedio}/5 · {v.reputacion.total}{" "}
                calificación(es)
              </span>
            </div>
            <p className="text-xs font-mono uppercase tracking-widest text-stone-500 mt-2">
              Vendedor desde {formatearFecha(v.desde)} · {v.subastasActivas} en
              vivo
            </p>
          </div>
        </motion.div>
      </section>

      <main className="max-w-5xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Subastas */}
        <section className="lg:col-span-2 space-y-6">
          <h2 className="text-xs font-mono uppercase tracking-widest text-stone-500">
            Subastas ({v.subastas.length})
          </h2>
          {v.subastas.length === 0 && (
            <p className="text-stone-400 font-light text-sm py-8 border border-dashed border-stone-300 text-center">
              Este vendedor aún no tiene subastas publicadas.
            </p>
          )}
          <div className="grid sm:grid-cols-2 gap-6">
            {v.subastas.map((s) => {
              const estado = (ESTADO_SUBASTA[s.estado] ?? s.estado) as never;
              return (
                <Link
                  key={s.idSubasta}
                  href={`/subastas/${s.idSubasta}`}
                  className="group bg-white border border-stone-200 hover:border-stone-900 transition-colors flex flex-col"
                >
                  <div className="relative border-b border-stone-100">
                    <ImagenConFallback
                      src={s.imagen}
                      alt={s.titulo}
                      className="h-36 w-full object-cover bg-stone-100"
                    />
                    <div className="absolute top-2 left-2">
                      <EstadoBadge estado={estado} />
                    </div>
                  </div>
                  <div className="p-4 space-y-2">
                    <h3 className="font-serif text-lg text-stone-900 line-clamp-1">
                      {s.titulo}
                    </h3>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-stone-400">
                      {s.categoria ?? "—"}
                    </span>
                    <div className="flex items-center justify-between">
                      <span className="font-serif font-semibold text-stone-900 tabular-nums">
                        {formatearMoneda(s.precioBase)}
                      </span>
                      {s.estado === "Activa" && (
                        <span className="text-[10px] font-mono uppercase text-green-700 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                          <Countdown fechaFin={s.fechaFin} />
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Calificaciones y comentarios */}
        <aside className="space-y-4">
          <h2 className="text-xs font-mono uppercase tracking-widest text-stone-500">
            Opiniones ({v.calificaciones.length})
          </h2>
          {v.calificaciones.length === 0 && (
            <p className="text-stone-400 font-light text-sm py-6 text-center border border-dashed border-stone-300">
              Sin calificaciones aún.
            </p>
          )}
          {v.calificaciones.map((c, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(i * 0.04, 0.3) }}
              className="bg-white border border-stone-200 p-4 space-y-2"
            >
              <div className="flex items-center justify-between">
                <Estrellas promedio={c.puntuacion} />
                <span className="text-[10px] font-mono text-stone-400">
                  {formatearFecha(c.fecha)}
                </span>
              </div>
              {c.comentario && (
                <p className="text-sm text-stone-600 font-light leading-relaxed">
                  “{c.comentario}”
                </p>
              )}
              <span className="text-[9px] font-mono uppercase tracking-widest text-stone-400 block">
                {c.comprador}
              </span>
            </motion.div>
          ))}
        </aside>
      </main>
    </div>
  );
}
