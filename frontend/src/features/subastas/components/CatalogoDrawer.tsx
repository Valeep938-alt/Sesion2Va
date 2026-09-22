"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { useDebounce } from "@/hooks/useDebounce";
import { useSubastas } from "../hooks/useSubastas";
import { formatearMoneda } from "@/utils/formatters";
import type { SubastaResumen } from "../types";

interface PropsCatalogoDrawer {
  abierto: boolean;
  onCerrar: () => void;
}

export function CatalogoDrawer({ abierto, onCerrar }: PropsCatalogoDrawer) {
  const [busqueda, setBusqueda] = useState("");
  const busquedaDebounced = useDebounce(busqueda, 400);

  const { data: subastas, isPending } = useSubastas({
    buscar: busquedaDebounced.trim() || undefined,
  });

  return (
    <AnimatePresence>
      {abierto && (
        <>
          {/* Overlay */}
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCerrar}
            className="fixed inset-0 bg-stone-900/40 z-40"
          />

          {/* Panel lateral */}
          <motion.aside
            key="panel"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="fixed top-0 right-0 h-full w-full sm:w-[420px] bg-[#F9F8F6]
                       border-l border-stone-200 z-50 flex flex-col"
          >
            <header className="p-6 border-b border-stone-200 bg-white">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-stone-500">
                  Catálogo &middot; Multitarea
                </span>
                <button
                  onClick={onCerrar}
                  className="text-xs font-mono uppercase tracking-widest
                             text-stone-500 hover:text-stone-900 transition-colors"
                >
                  Cerrar ✕
                </button>
              </div>
              <p className="font-serif text-xl text-stone-900 mb-4">
                Explora mientras tu puja sigue{" "}
                <span className="italic">en vivo</span>.
              </p>
              <input
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Buscar lotes…"
                className="w-full bg-stone-50 border border-stone-200 px-4 py-2.5
                           text-stone-900 text-sm focus:outline-none
                           focus:border-stone-900 transition-colors rounded-full"
              />
            </header>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {isPending && (
                <div className="space-y-4">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div
                      key={i}
                      className="h-24 bg-white border border-stone-200 animate-pulse"
                    />
                  ))}
                </div>
              )}

              {subastas?.map((lote) => (
                <ItemLote key={lote.idSubasta} lote={lote} />
              ))}

              {subastas?.length === 0 && (
                <p className="text-sm text-stone-500 font-light text-center py-10">
                  No hay lotes
                  {busquedaDebounced && ` para "${busquedaDebounced}"`}.
                </p>
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

function ItemLote({ lote }: { lote: SubastaResumen }) {
  const enVivo = lote.estado === "Activa";

  return (
    <Link
      href={
        enVivo
          ? `/subastas/${lote.idSubasta}/en-vivo`
          : `/subastas/${lote.idSubasta}`
      }
      target="_blank"
      className="block bg-white border border-stone-200 p-4 hover:border-stone-900
                 transition-colors"
    >
      <div className="flex justify-between items-start gap-3">
        <div className="min-w-0">
          <span className="text-[9px] font-mono uppercase tracking-widest text-stone-400 block">
            {lote.idCategoria2?.nombre ?? "—"}
            {enVivo && <span className="text-green-700 ml-2">● En vivo</span>}
          </span>
          <h4 className="font-serif text-base text-stone-900 line-clamp-1 mt-0.5">
            {lote.titulo}
          </h4>
          <span className="text-sm font-serif font-semibold text-stone-900 tabular-nums">
            {formatearMoneda(lote.precioBase)}
          </span>
        </div>
        <span
          className="text-[9px] font-mono uppercase tracking-widest
                         text-stone-500 border-b border-stone-400 pb-0.5 shrink-0"
        >
          Abrir ↗
        </span>
      </div>
    </Link>
  );
}
