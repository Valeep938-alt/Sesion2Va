"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { useAuthStore } from "@/store/authStore";
import { useDebounce } from "@/hooks/useDebounce";
import {
  useSubastasInfinite,
  type FiltrosFormulario,
} from "../hooks/useSubastasInfinite";
import { useCategorias } from "../hooks/useCategorias";
import { SubastaCard } from "./SubastaCard";

const FILTROS_INICIALES: FiltrosFormulario = {
  buscar: "",
  categoria: "todas",
  precioMin: undefined,
  precioMax: undefined,
};

export function SubastasView() {
  const accessToken = useAuthStore((state) => state.accessToken);

  const [filtros, setFiltros] = useState<FiltrosFormulario>(FILTROS_INICIALES);
  const observerRef = useRef<HTMLDivElement>(null);

  const buscarDebounced = useDebounce(filtros.buscar, 400);
  const filtrosQuery: FiltrosFormulario = {
    ...filtros,
    buscar: buscarDebounced,
  };

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useSubastasInfinite(filtrosQuery);

  const { data: categorias } = useCategorias();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          void fetchNextPage();
        }
      },
      { threshold: 1 },
    );
    if (observerRef.current) observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleInputChange = (
    field: keyof FiltrosFormulario,
    value: string | number | undefined,
  ) => {
    setFiltros((prev) => ({ ...prev, [field]: value }));
  };

  const limpiarFiltros = () => setFiltros(FILTROS_INICIALES);

  const totalLotes = data?.pages?.flat()?.length ?? 0;

  return (
    <div className="min-h-screen bg-[#F9F8F6] text-stone-900 selection:bg-stone-900 selection:text-white">
      {/* Cabecera Editorial */}
      <section className="pt-20 pb-12 px-6 max-w-7xl mx-auto border-b border-stone-200">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-2xl"
          >
            <span className="text-xs font-mono tracking-[0.3em] uppercase text-stone-500 block mb-3">
              Colección Privada &middot; Catálogo 2026
            </span>
            <h1 className="text-4xl sm:text-6xl font-serif font-normal tracking-tight text-stone-900 leading-[1.1]">
              Piezas únicas en{" "}
              <span className="italic font-light">pujas abiertas</span>.
            </h1>
            <p className="mt-4 text-stone-600 text-base sm:text-lg font-light leading-relaxed">
              Explora lotes autenticados, filtra por categoría o valor y sigue
              el pulso de las ofertas en vivo.
            </p>
          </motion.div>

          {!accessToken && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.8,
                delay: 0.1,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="flex items-center gap-3"
            >
              <Link
                href="/auth?mode=login"
                className="px-6 py-3.5 bg-stone-900 hover:bg-stone-800 text-white
                           text-xs uppercase tracking-widest font-mono transition-all
                           rounded-none shadow-sm"
              >
                Acceder
              </Link>
              <Link
                href="/auth?mode=register"
                className="px-6 py-3.5 border border-stone-300 hover:border-stone-900
                           text-stone-900 text-xs uppercase tracking-widest font-mono
                           transition-all rounded-none"
              >
                Crear Cuenta
              </Link>
            </motion.div>
          )}
        </div>
      </section>

      {/* Barra de Filtros Avanzada */}
      <section className="max-w-7xl mx-auto px-6 py-8 border-b border-stone-200 bg-white shadow-xs">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          {/* Buscar por texto */}
          <div>
            <label className="block text-[10px] font-mono uppercase tracking-widest text-stone-500 mb-1.5">
              Buscar Lote
            </label>
            <input
              type="text"
              value={filtros.buscar}
              onChange={(e) => handleInputChange("buscar", e.target.value)}
              placeholder="Ej. Pintura, óleo..."
              className="w-full bg-stone-50 border border-stone-200 px-4 py-2.5
                         text-stone-900 text-sm focus:outline-none focus:border-stone-900
                         focus:ring-1 focus:ring-stone-900 transition-colors rounded-full"
            />
          </div>

          {/* Categoría — dinámicas desde la BD */}
          <div>
            <label className="block text-[10px] font-mono uppercase tracking-widest text-stone-500 mb-1.5">
              Categoría
            </label>
            <select
              value={filtros.categoria}
              onChange={(e) => handleInputChange("categoria", e.target.value)}
              className="w-full bg-stone-50 border border-stone-200 px-4 py-2.5
                         text-stone-900 text-sm focus:outline-none focus:border-stone-900
                         focus:ring-1 focus:ring-stone-900 transition-colors
                         rounded-full cursor-pointer"
            >
              <option value="todas">Todas las Categorías</option>
              {categorias?.map((c) => (
                <option key={c.idCategoria} value={c.nombre}>
                  {c.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* Precio Mínimo y Máximo */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[10px] font-mono uppercase tracking-widest text-stone-500 mb-1.5">
                Precio Mín
              </label>
              <input
                type="number"
                value={filtros.precioMin ?? ""}
                onChange={(e) =>
                  handleInputChange(
                    "precioMin",
                    e.target.value ? Number(e.target.value) : undefined,
                  )
                }
                placeholder="$ Min"
                className="w-full bg-stone-50 border border-stone-200 px-4 py-2.5
                           text-stone-900 text-sm focus:outline-none focus:border-stone-900
                           focus:ring-1 focus:ring-stone-900 transition-colors rounded-full"
              />
            </div>
            <div>
              <label className="block text-[10px] font-mono uppercase tracking-widest text-stone-500 mb-1.5">
                Precio Máx
              </label>
              <input
                type="number"
                value={filtros.precioMax ?? ""}
                onChange={(e) =>
                  handleInputChange(
                    "precioMax",
                    e.target.value ? Number(e.target.value) : undefined,
                  )
                }
                placeholder="$ Máx"
                className="w-full bg-stone-50 border border-stone-200 px-4 py-2.5
                           text-stone-900 text-sm focus:outline-none focus:border-stone-900
                           focus:ring-1 focus:ring-stone-900 transition-colors rounded-full"
              />
            </div>
          </div>

          {/* Limpiar */}
          <div className="flex items-center gap-2">
            <button
              onClick={limpiarFiltros}
              className="w-full py-2.5 border border-stone-300 text-stone-700
                         hover:border-stone-900 hover:text-stone-900 text-[11px]
                         uppercase tracking-widest font-mono transition-colors
                         cursor-pointer rounded-full"
            >
              Limpiar Filtros
            </button>
          </div>
        </div>
      </section>

      {/* Grid con Infinite Scroll */}
      <main className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex items-center justify-between mb-10">
          <span className="text-xs font-mono uppercase tracking-widest text-stone-500">
            Lotes Encontrados ({totalLotes})
          </span>
          {accessToken && (
            <Link
              href="/mis-subastas/nueva"
              className="text-xs font-mono uppercase tracking-widest text-stone-900
                         border-b border-stone-900 pb-0.5 hover:text-stone-600
                         hover:border-stone-600 transition-colors"
            >
              + Publicar Lote
            </Link>
          )}
        </div>

        {isLoading ? (
          <div className="py-32 flex flex-col items-center justify-center gap-3 text-stone-500">
            <div className="w-6 h-6 border-2 border-stone-800 border-t-transparent rounded-full animate-spin" />
            <p className="text-xs font-mono uppercase tracking-widest">
              Aplicando filtros...
            </p>
          </div>
        ) : (
          <motion.div
            initial="hidden"
            animate="show"
            variants={{
              hidden: { opacity: 0 },
              show: { opacity: 1, transition: { staggerChildren: 0.05 } },
            }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12"
          >
            {data?.pages.map((page, i) =>
              page.map((subasta, index: number) => (
                <motion.div
                  key={subasta.idSubasta || `${i}-${index}`}
                  variants={{
                    hidden: { opacity: 0, y: 15 },
                    show: {
                      opacity: 1,
                      y: 0,
                      transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
                    },
                  }}
                >
                  <SubastaCard subasta={subasta} />
                </motion.div>
              )),
            )}

            {totalLotes === 0 && (
              <div className="col-span-full text-center py-24 border border-dashed border-stone-300">
                <p className="text-stone-600 font-serif text-lg">
                  No se encontraron subastas con los criterios especificados.
                </p>
                <button
                  onClick={limpiarFiltros}
                  className="mt-4 text-xs font-mono uppercase tracking-widest
                             text-stone-900 underline underline-offset-4 cursor-pointer"
                >
                  Restablecer filtros de búsqueda
                </button>
              </div>
            )}
          </motion.div>
        )}

        <div
          ref={observerRef}
          className="h-10 flex items-center justify-center mt-10"
        >
          {isFetchingNextPage && (
            <div className="w-8 h-8 border-2 border-stone-300 border-t-stone-900 rounded-full animate-spin" />
          )}
        </div>
      </main>
    </div>
  );
}
