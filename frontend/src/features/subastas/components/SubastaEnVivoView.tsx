"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import { useAuthStore } from "@/store/authStore";
import { ImagenConFallback } from "@/components/ui/ImagenConFallback";
import { Countdown } from "@/components/ui/Countdown";
import { useSubastaEnVivo } from "../hooks/useSubastaEnVivo";
import { useSubastaDetalle } from "../hooks/useSubastaDetalle";
import { obtenerMensajeError } from "@/utils/helpers/error-messages";
import { formatearMoneda, formatearHora } from "@/utils/formatters";
import { CatalogoDrawer } from "./CatalogoDrawer";

export function SubastaEnVivoView() {
  const params = useParams<{ id: string }>();
  const id = params.id as string;
  const [montoPuja, setMontoPuja] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [catalogoAbierto, setCatalogoAbierto] = useState(false);

  const {
    precioActual,
    pujas,
    participantes,
    conectado,
    fechaFin: fechaFinViva,
    extendida,
    cerrada,
    montoFinal,
    salaLlena,
    esDueño,
    enviarPuja,
  } = useSubastaEnVivo(id);
  const { data } = useSubastaDetalle(id);
  const s = data?.subasta;

  const user = useAuthStore((state) => state.user);

  if (data?.bloqueada) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4 px-6 text-center">
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-stone-400">
          Acceso Restringido
        </span>
        <p className="text-2xl font-serif font-light text-stone-900">
          Subasta privada
        </p>
        <p className="text-sm text-stone-500 font-light max-w-md">
          Necesitas una invitación del subastador o acceso aprobado para entrar
          a esta sala.
        </p>
        <Link
          href={`/subastas/${id}`}
          className="text-xs font-mono uppercase tracking-widest text-stone-900 underline underline-offset-4"
        >
          Solicitar acceso en el detalle →
        </Link>
      </div>
    );
  }

  const puedePujar =
    Boolean(user) &&
    !esDueño &&
    !salaLlena &&
    !cerrada &&
    s?.estado === "Activa";

  const handlePujar = async () => {
    const monto = parseFloat(montoPuja);
    if (!monto || Number.isNaN(monto)) {
      toast.error("Ingresa un monto válido para pujar.");
      return;
    }
    setEnviando(true);
    try {
      const r = await enviarPuja(monto);
      if (r.ok) {
        toast.success("¡Puja registrada con éxito!");
        setMontoPuja("");
      } else {
        toast.error(r.message ?? "No se pudo registrar la puja.");
      }
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="bg-[#F9F8F6] min-h-[70vh] py-12 px-6">
      <div className="max-w-5xl mx-auto space-y-8">
        <header className="flex flex-wrap items-center justify-between gap-3">
          <Link
            href={`/subastas/${id}`}
            className="text-xs font-mono uppercase tracking-widest text-stone-500 hover:text-stone-900 transition-colors"
          >
            ← Volver al detalle
          </Link>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCatalogoAbierto(true)}
              className="text-xs font-mono uppercase tracking-widest text-stone-500
                         border border-stone-300 hover:border-stone-900 hover:text-stone-900
                         px-4 py-1.5 transition-colors"
            >
              Catálogo
            </button>
            <span
              className={`flex items-center gap-2 font-mono text-[10px] uppercase
                          tracking-widest px-3 py-1.5 rounded-full ${
                            conectado
                              ? "bg-green-100 text-green-700"
                              : "bg-stone-100 text-stone-500"
                          }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  conectado ? "bg-green-500" : "bg-stone-400"
                }`}
              />
              {conectado ? "En tiempo real" : "Reconectando..."}
            </span>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-stone-900 text-white p-8 md:p-10 rounded-3xl shadow-xl">
              <span className="text-xs font-mono uppercase tracking-widest text-stone-400 block">
                Puja Actual
              </span>
              <motion.p
                key={String(precioActual ?? "base")}
                initial={{ opacity: 0.5, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="text-5xl font-serif font-semibold text-white tabular-nums mt-2"
              >
                {precioActual
                  ? formatearMoneda(precioActual)
                  : s
                    ? formatearMoneda(s.precioBase)
                    : "—"}
              </motion.p>
              <div className="flex flex-wrap gap-6 mt-6 text-xs font-mono uppercase tracking-widest text-stone-400">
                <span>👤 {participantes} conectados</span>
                {fechaFinViva && !cerrada && (
                  <span>
                    Cierra en <Countdown fechaFin={fechaFinViva} />
                  </span>
                )}
              </div>
            </div>

            {salaLlena && (
              <p className="text-sm text-amber-700 bg-amber-50 border-l-2 border-amber-600 p-4 font-light">
                Esta sala alcanzó su límite de usuarios. Intenta más tarde.
              </p>
            )}

            {extendida && !cerrada && (
              <p className="text-xs font-mono uppercase tracking-widest text-amber-700 bg-amber-50 border-l-2 border-amber-600 px-4 py-3 rounded-xl">
                ⏱ Tiempo extendido +30s — una puja llegó en los últimos segundos
                (anti-sniping)
              </p>
            )}

            {cerrada && (
              <div className="bg-stone-900 text-white p-8 rounded-3xl text-center">
                <p className="font-mono text-xs uppercase tracking-widest text-stone-400">
                  Subasta Finalizada
                </p>
                <p className="text-3xl font-serif font-semibold mt-2">
                  {montoFinal
                    ? `Precio final: ${formatearMoneda(montoFinal)}`
                    : "Sin pujas ganadoras"}
                </p>
              </div>
            )}
            
            {puedePujar && (
              <div className="bg-white border border-stone-200 p-6 rounded-3xl shadow-sm flex flex-col sm:flex-row items-end gap-4">
                <div className="flex-1 w-full">
                  <label className="block text-xs font-mono uppercase tracking-widest text-stone-600 mb-2">
                    Tu monto ($)
                  </label>
                  <input
                    type="number"
                    value={montoPuja}
                    onChange={(e) => setMontoPuja(e.target.value)}
                    placeholder="50000"
                    className="w-full bg-stone-50 border border-stone-200 px-4 py-3 text-stone-900 text-sm focus:outline-none focus:border-stone-900 transition-colors rounded-none"
                  />
                </div>
                <button
                  onClick={handlePujar}
                  disabled={enviando}
                  className="px-8 py-3.5 bg-stone-900 hover:bg-stone-800 text-white font-mono text-[11px] uppercase tracking-widest transition-colors disabled:opacity-50"
                >
                  {enviando ? "Procesando..." : "Realizar Puja"}
                </button>
              </div>
            )}

            {esDueño && !cerrada && (
              <div className="bg-white border border-stone-200 p-6 rounded-3xl shadow-sm text-center">
                <p className="text-xs font-mono uppercase tracking-widest text-stone-500">
                  Modo Supervisión — eres el subastador de este lote
                </p>
                <p className="text-stone-700 font-light text-sm mt-2">
                  Puedes seguir la puja en vivo y explorar el catálogo para
                  inscribirte en otras subastas.
                </p>
                <button
                  onClick={() => setCatalogoAbierto(true)}
                  className="mt-4 px-6 py-2.5 bg-stone-900 text-white font-mono
                             text-[10px] uppercase tracking-widest
                             hover:bg-stone-800 transition-colors"
                >
                  Explorar catálogo e inscribirme
                </button>
              </div>
            )}

            <div className="bg-white border border-stone-200 rounded-3xl shadow-sm divide-y divide-stone-100">
              <p className="p-5 font-mono text-[11px] uppercase tracking-widest text-stone-500">
                Actividad Reciente
              </p>
              <AnimatePresence initial={false}>
                {pujas.map((p) => (
                  <motion.div
                    key={p.idPuja}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="flex justify-between items-center px-5 py-4"
                  >
                    <span
                      className="text-sm text-stone-600"
                      title="Identidad protegida"
                    >
                      {p.pujador}
                    </span>
                    <div className="flex items-center gap-4">
                      <span className="font-mono text-[10px] text-stone-400 uppercase tracking-wider">
                        {formatearHora(p.timestamp)}
                      </span>
                      <b className="font-serif text-lg text-green-700 tabular-nums">
                        {formatearMoneda(p.monto)}
                      </b>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              {pujas.length === 0 && (
                <p className="px-5 py-6 text-sm text-stone-400 font-light">
                  Aún no hay pujas… sé el primero en participar.
                </p>
              )}
            </div>
          </div>

          <aside className="space-y-6 h-fit">
            <div className="bg-white border border-stone-200 p-6 rounded-3xl shadow-sm">
              <ImagenConFallback
                src={s?.imagenes[0]?.url}
                alt={s?.titulo ?? "Subasta"}
                className="w-full h-40 object-cover bg-stone-100"
              />
              <h2 className="font-serif text-xl text-stone-900 line-clamp-2 mt-5">
                {s?.titulo ?? "Subasta"}
              </h2>
              <dl className="mt-5 space-y-3 text-sm">
                <div className="flex justify-between items-baseline gap-2">
                  <dt className="font-mono text-[10px] uppercase tracking-widest text-stone-400 shrink-0">
                    Subastador
                  </dt>
                  <dd className="text-stone-700 text-right truncate">
                    {s?.subastador?.nombre ?? "—"}
                  </dd>
                </div>
                <div className="flex justify-between items-baseline">
                  <dt className="font-mono text-[10px] uppercase tracking-widest text-stone-400">
                    Precio base
                  </dt>
                  <dd className="font-medium text-stone-700">
                    {s ? formatearMoneda(s.precioBase) : "—"}
                  </dd>
                </div>
                <div className="flex justify-between items-baseline">
                  <dt className="font-mono text-[10px] uppercase tracking-widest text-stone-400">
                    Incremento
                  </dt>
                  <dd className="text-stone-700">
                    {s?.incrementoMinimoPct ?? "—"}%
                  </dd>
                </div>
                <div className="flex justify-between items-baseline">
                  <dt className="font-mono text-[10px] uppercase tracking-widest text-stone-400">
                    Pujas
                  </dt>
                  <dd className="text-stone-700">{pujas.length}</dd>
                </div>
              </dl>
            </div>
          </aside>
        </div>
      </div>

      <CatalogoDrawer
        abierto={catalogoAbierto}
        onCerrar={() => setCatalogoAbierto(false)}
      />
    </div>
  );
}
