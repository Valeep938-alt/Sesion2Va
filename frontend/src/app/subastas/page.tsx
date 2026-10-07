"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { axiosClient as apiClient } from "@/api/config/axiosClient";
import { AuctionCard } from "@/features/auctions/components/AuctionCard";
import { useAuthStore } from "@/store/authStore";
import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

interface FiltroSubastas {
  buscar: string;
  categoria: string;
  precioMin?: number;
  precioMax?: number;
}

export default function SubastasPage() {
  const accessToken = useAuthStore((state) => state.accessToken);

  const [filtros, setFiltros] = useState<FiltroSubastas>({
    buscar: "",
    categoria: "todas",
    precioMin: undefined,
    precioMax: undefined,
  });

  const observerRef = useRef<HTMLDivElement>(null);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery<any[]>({
      queryKey: ["auctions", "list", filtros],
      queryFn: async ({ pageParam }) => {
        const offset = typeof pageParam === "number" ? pageParam : 0;
        const params = new URLSearchParams();
        if (filtros.buscar) params.append("buscar", filtros.buscar);
        if (filtros.categoria && filtros.categoria !== "todas")
          params.append("categoria", filtros.categoria);
        if (filtros.precioMin)
          params.append("precioMin", filtros.precioMin.toString());
        if (filtros.precioMax)
          params.append("precioMax", filtros.precioMax.toString());

        const { data } = await apiClient.get(
          `/subastas?limit=12&offset=${offset}&${params.toString()}`,
        );
        return data;
      },
      getNextPageParam: (lastPage, allPages) =>
        lastPage.length === 12 ? allPages.length * 12 : undefined,
      initialPageParam: 0,
    });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 1 },
    );
    if (observerRef.current) observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleInputChange = (field: keyof FiltroSubastas, value: any) => {
    setFiltros((prev) => ({ ...prev, [field]: value }));
  };

  const limpiarFiltros = () => {
    setFiltros({
      buscar: "",
      categoria: "todas",
      precioMin: undefined,
      precioMax: undefined,
    });
  };

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
                className="px-6 py-3.5 bg-stone-900 hover:bg-stone-800 text-white text-xs uppercase tracking-widest font-mono transition-all rounded-none shadow-sm"
              >
                Acceder
              </Link>
              <Link
                href="/auth?mode=register"
                className="px-6 py-3.5 border border-stone-300 hover:border-stone-900 text-stone-900 text-xs uppercase tracking-widest font-mono transition-all rounded-none"
              >
                Crear Cuenta
              </Link>
            </motion.div>
          )}
        </div>
      </section>

      {/* Barra de Filtros Avanzada (Diseño Moderno) */}
      <section className="max-w-7xl mx-auto px-6 py-8 border-b border-stone-200 bg-white shadow-xs">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          {/* Buscar por texto (titulo o descripción) */}
          <div>
            <label className="block text-[10px] font-mono uppercase tracking-widest text-stone-500 mb-1.5">
              Buscar Lote
            </label>
            <input
              type="text"
              value={filtros.buscar || ""}
              onChange={(e) => handleInputChange("buscar", e.target.value)}
              placeholder="Ej. Pintura, óleo..."
              className="w-full bg-stone-50 border border-stone-200 px-4 py-2.5 text-stone-900 text-sm focus:outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-900 transition-colors rounded-full"
            />
          </div>

          {/* Filtrar por Categoría */}
          <div>
            <label className="block text-[10px] font-mono uppercase tracking-widest text-stone-500 mb-1.5">
              Categoría
            </label>
            <select
              value={filtros.categoria || "todas"}
              onChange={(e) => handleInputChange("categoria", e.target.value)}
              className="w-full bg-stone-50 border border-stone-200 px-4 py-2.5 text-stone-900 text-sm focus:outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-900 transition-colors rounded-full cursor-pointer"
            >
              <option value="todas">Todas las Categorías</option>
              <option value="Arte">Arte</option>
              <option value="Escultura">Escultura</option>
              <option value="Joyería">Joyería</option>
              <option value="Relojería">Relojería</option>
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
                className="w-full bg-stone-50 border border-stone-200 px-4 py-2.5 text-stone-900 text-sm focus:outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-900 transition-colors rounded-full"
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
                className="w-full bg-stone-50 border border-stone-200 px-4 py-2.5 text-stone-900 text-sm focus:outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-900 transition-colors rounded-full"
              />
            </div>
          </div>

          {/* Botones de Acción de Filtro */}
          <div className="flex items-center gap-2">
            <button
              onClick={limpiarFiltros}
              className="w-full py-2.5 border border-stone-300 text-stone-700 hover:border-stone-900 hover:text-stone-900 text-[11px] uppercase tracking-widest font-mono transition-colors cursor-pointer rounded-full"
            >
              Limpiar Filtros
            </button>
          </div>
        </div>
      </section>

      {/* Grid de Subastas Filtradas con Infinite Scroll */}
      <main className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex items-center justify-between mb-10">
          <span className="text-xs font-mono uppercase tracking-widest text-stone-500">
            Lotes Encontrados ({data?.pages?.[0]?.length || 0})
          </span>
          {accessToken && (
            <Link
              href="/subastas/crear"
              className="text-xs font-mono uppercase tracking-widest text-stone-900 border-b border-stone-900 pb-0.5 hover:text-stone-600 hover:border-stone-600 transition-colors"
            >
              + Publicar Lote
            </Link>
          )}
        </div>

        {isLoading ? (
          <div className="py-32 flex flex-col items-center justify-center gap-3 text-stone-500">
            <div className="w-6 h-6 border-2 border-stone-800 border-t-transparent rounded-full animate-spin"></div>
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
              show: {
                opacity: 1,
                transition: { staggerChildren: 0.05 },
              },
            }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12"
          >
            {data?.pages.map((page, i) =>
              page.map((auction: any, index: number) => (
                <motion.div
                  key={auction.idSubasta || `${i}-${index}`}
                  variants={{
                    hidden: { opacity: 0, y: 15 },
                    show: {
                      opacity: 1,
                      y: 0,
                      transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
                    },
                  }}
                >
                  <AuctionCard auction={auction} />
                </motion.div>
              )),
            )}

            {data?.pages?.[0]?.length === 0 && (
              <div className="col-span-full text-center py-24 border border-dashed border-stone-300">
                <p className="text-stone-600 font-serif text-lg">
                  No se encontraron subastas con los criterios especificados.
                </p>
                <button
                  onClick={limpiarFiltros}
                  className="mt-4 text-xs font-mono uppercase tracking-widest text-stone-900 underline underline-offset-4 cursor-pointer"
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
            <div className="w-8 h-8 border-2 border-stone-300 border-t-stone-900 rounded-full animate-spin"></div>
          )}
        </div>
      </main>
    </div>
  );
}

