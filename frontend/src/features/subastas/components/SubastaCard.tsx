"use client";

import Link from "next/link";
import { ImagenConFallback } from "@/components/ui/ImagenConFallback";
import { Countdown } from "@/components/ui/Countdown";
import { EstadoBadge } from "./EstadoBadge";
import { formatearMoneda } from "@/utils/formatters";
import type { SubastaResumen } from "../types";

export function SubastaCard({ subasta }: { subasta: SubastaResumen }) {
  if (!subasta) return null;

  const enVivo = subasta.estado === "Activa";

  return (
    <div
      className="group bg-white border border-stone-200 shadow-sm
                    hover:border-stone-900 transition-colors flex flex-col h-full"
    >
      {/* Bloque de imagen*/}
      <div className="relative border-b border-stone-100">
        <ImagenConFallback
          src={subasta.imagenes?.[0]?.url}
          alt={subasta.titulo}
          className="h-44 w-full object-cover bg-stone-100
                     group-hover:opacity-90 transition-opacity"
        />
        <div className="absolute top-3 left-3">
          <EstadoBadge estado={subasta.estado} />
        </div>
      </div>

      <div className="p-6 flex flex-col justify-between flex-1">
        <div>
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-mono text-stone-400">
              Lote #{subasta.idSubasta}
            </span>
            <span className="text-[10px] font-mono uppercase tracking-wider text-stone-400">
              {subasta.idCategoria2?.nombre ?? "—"}
            </span>
          </div>

          <h3
            className="text-xl font-serif font-normal text-stone-900
                         group-hover:text-stone-600 transition-colors line-clamp-1"
          >
            {subasta.titulo}
          </h3>

          <p className="text-stone-600 text-sm font-light mt-2 line-clamp-2 leading-relaxed">
            {subasta.descripcion}
          </p>

          {enVivo && (
            <p
              className="mt-3 text-[10px] font-mono uppercase tracking-widest
                         text-green-700 flex items-center gap-2"
            >
              <span className="w-2 h-2 rounded-full bg-green-500" />
              Cierra en <Countdown fechaFin={subasta.fechaFin} />
            </p>
          )}
        </div>

        <div className="mt-8 pt-4 border-t border-stone-100 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-stone-400 block">
              Precio Base
            </span>
            <span className="text-lg font-serif font-semibold text-stone-900 tabular-nums">
              {formatearMoneda(subasta.precioBase)}
            </span>
          </div>

          {enVivo ? (
            <Link
              href={`/subastas/${subasta.idSubasta}/en-vivo`}
              className="text-xs font-mono uppercase tracking-widest bg-stone-900
                         text-white px-4 py-2.5 hover:bg-stone-800 transition-colors"
            >
              Entrar &rarr;
            </Link>
          ) : (
            <Link
              href={`/subastas/${subasta.idSubasta}`}
              className="text-xs font-mono uppercase tracking-widest text-stone-900
                         border-b border-stone-900 pb-0.5 hover:text-stone-600
                         hover:border-stone-600 transition-colors"
            >
              Ver Sala &rarr;
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
