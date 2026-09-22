"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { useDebounce } from "@/hooks/useDebounce";
import { useVendedores } from "../hooks/useVendedores";
import { Estrellas } from "@/components/ui/Estrellas";

export function VendedoresView() {
  const [busqueda, setBusqueda] = useState("");
  const busquedaDebounced = useDebounce(busqueda, 400);
  const { data: vendedores, isPending } = useVendedores(busquedaDebounced);

  return (
    <div className="min-h-screen bg-[#F9F8F6] text-stone-900 selection:bg-stone-900 selection:text-white">
      <section className="pt-20 pb-12 px-6 max-w-5xl mx-auto border-b border-stone-200">
        <span className="text-xs font-mono tracking-[0.3em] uppercase text-stone-500 block mb-3">
          Comunidad · Vendedores
        </span>
        <h1 className="text-4xl sm:text-5xl font-serif font-normal text-stone-900">
          Subastadores con <span className="italic font-light">reputación</span>
          .
        </h1>
        <input
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Buscar vendedor por nombre…"
          className="mt-6 w-full max-w-md bg-stone-50 border border-stone-200 px-4 py-2.5 text-sm
                     focus:outline-none focus:border-stone-900 rounded-full"
        />
      </section>

      <main className="max-w-5xl mx-auto px-6 py-12">
        {isPending && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="h-32 bg-white border border-stone-200 animate-pulse"
              />
            ))}
          </div>
        )}

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {vendedores?.map((v, i) => (
            <motion.div
              key={v.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
            >
              <Link
                href={`/vendedores/${v.id}`}
                className="block bg-white border border-stone-200 p-6 hover:border-stone-900 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <span className="w-12 h-12 rounded-full bg-stone-900 text-white grid place-items-center font-serif text-xl shrink-0">
                    {v.nombre.charAt(0).toUpperCase()}
                  </span>
                  <div className="min-w-0">
                    <h3 className="font-serif text-lg text-stone-900 truncate">
                      {v.nombre}
                    </h3>
                    <div className="flex items-center gap-2">
                      <Estrellas promedio={v.reputacion.promedio} />
                      <span className="text-[10px] font-mono text-stone-400">
                        ({v.reputacion.total})
                      </span>
                    </div>
                  </div>
                </div>
                <span className="block mt-4 text-[9px] font-mono uppercase tracking-widest text-stone-500">
                  Ver perfil y subastas →
                </span>
              </Link>
            </motion.div>
          ))}
        </div>

        {!isPending && vendedores?.length === 0 && (
          <div className="text-center py-24 border border-dashed border-stone-300">
            <p className="text-stone-600 font-serif text-lg">
              No encontramos vendedores con "{busquedaDebounced}".
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
