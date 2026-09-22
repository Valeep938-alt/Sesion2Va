"use client";

import Link from "next/link";
import { ImagenConFallback } from "@/components/ui/ImagenConFallback";
import { Countdown } from "@/components/ui/Countdown";
import { EstadoBadge } from "./EstadoBadge";
import { formatearMoneda, formatearFecha } from "@/utils/formatters";
import type { SubastaResumen } from "../types";

export function CardSubasta({ subasta }: { subasta: SubastaResumen }) {
  const enVivo = subasta.estado === "Activa";

  return (
    <article
      className="group bg-white border border-stone-200 shadow-sm
                        hover:border-stone-900 transition-colors h-full flex flex-col"
    >
      <div className="relative border-b border-stone-100">
        <ImagenConFallback
          src={subasta.imagenes?.[0]?.url}
          alt={subasta.titulo}
          className="h-44 w-full object-cover bg-stone-100 group-hover:opacity-90 transition-opacity"
        />
        <div className="absolute top-3 left-3">
          <EstadoBadge estado={subasta.estado} />
        </div>
        <span
          className="absolute top-3 right-3 text-[10px] font-mono text-stone-500
                         bg-white/80 backdrop-blur-sm px-2 py-0.5"
        >
          Lote #{subasta.idSubasta}
        </span>
      </div>

      <div className="p-6 flex flex-col gap-3 flex-1">
        <h3 className="text-lg font-serif font-normal text-stone-900 line-clamp-1">
          {subasta.titulo}
        </h3>

        {/* Nombre del subastador → link a su perfil */}
        <div className="flex items-center justify-between gap-2 text-xs font-mono text-stone-400">
          <span className="truncate">
            por{" "}
            {subasta.idSubastador?.idUsuario ? (
              <Link
                href={`/vendedores/${subasta.idSubastador.idUsuario}`}
                className="underline underline-offset-2 hover:text-stone-900 transition-colors"
              >
                {subasta.idSubastador.nombreCompleto}
              </Link>
            ) : (
              "—"
            )}
          </span>
          <span className="shrink-0">
            {formatearFecha(subasta.fechaInicio)}
          </span>
        </div>

        <div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-stone-400 block">
            Precio Base
          </span>
          <span className="text-lg font-serif font-semibold text-stone-900 tabular-nums">
            {formatearMoneda(subasta.precioBase)}
          </span>
        </div>

        {enVivo && (
          <p
            className="text-[10px] font-mono uppercase tracking-widest text-green-700
                       flex items-center gap-2"
          >
            <span className="w-2 h-2 rounded-full bg-green-500" />
            Cierra en <Countdown fechaFin={subasta.fechaFin} />
          </p>
        )}

        {subasta.estado === "Rechazada" && subasta.motivoRechazo && (
          <p className="text-xs text-red-700 bg-red-50 border-l-2 border-red-700 p-3 font-light">
            Rechazado: {subasta.motivoRechazo}
          </p>
        )}

        <div className="flex gap-2 mt-auto pt-4 border-t border-stone-100">
          <Link
            href={`/subastas/${subasta.idSubasta}`}
            className="flex-1 text-center py-2.5 border border-stone-300 font-mono
                       text-[10px] uppercase tracking-widest text-stone-700
                       hover:border-stone-900 hover:text-stone-900 transition-colors"
          >
            Ver Lote
          </Link>
          {enVivo && (
            <Link
              href={`/subastas/${subasta.idSubasta}/en-vivo`}
              className="flex-1 text-center py-2.5 bg-stone-900 text-white
                         font-mono text-[10px] uppercase tracking-widest
                         hover:bg-stone-800 transition-colors"
            >
              En Vivo
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}
