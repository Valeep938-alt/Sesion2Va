"use client";

import { motion, AnimatePresence } from "motion/react";

interface PropsConfirmacion {
  abierto: boolean;
  titulo: string;
  mensaje: string;
  confirmarTexto?: string;
  cancelarTexto?: string;
  peligro?: boolean;
  cargando?: boolean;
  cargandoTexto?: string;
  onConfirmar: () => void;
  onCancelar: () => void;
}

export function ConfirmacionModal({
  abierto,
  titulo,
  mensaje,
  confirmarTexto = "Confirmar",
  cancelarTexto = "Cancelar",
  peligro = false,
  cargando = false,
  cargandoTexto = "Procesando…",
  onConfirmar,
  onCancelar,
}: PropsConfirmacion) {
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
            onClick={() => !cargando && onCancelar()}
            className="fixed inset-0 bg-stone-900/50 z-40"
          />

          {/* Modal */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.98 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-x-4 top-[22vh] sm:inset-x-0 sm:mx-auto max-w-sm
                       bg-white border border-stone-200 shadow-2xl z-50 p-8 text-center
                       selection:bg-stone-900 selection:text-white"
          >
            <span
              className={`w-14 h-14 mx-auto rounded-full grid place-items-center ${
                peligro
                  ? "bg-red-50 border border-red-200"
                  : "bg-stone-50 border border-stone-200"
              }`}
            >
              <span
                className={`font-serif text-2xl ${
                  peligro ? "text-red-700" : "text-stone-700"
                }`}
              >
                !
              </span>
            </span>

            <h2 className="text-2xl font-serif font-light text-stone-900 mt-5">
              {titulo}
            </h2>

            <p className="text-sm text-stone-500 font-light mt-2 leading-relaxed">
              {mensaje}
            </p>

            <div className="flex flex-col-reverse sm:flex-row gap-2 mt-7">
              <button
                onClick={onCancelar}
                disabled={cargando}
                className="flex-1 py-3 border border-stone-300 text-stone-700 font-mono
                           text-[10px] uppercase tracking-widest rounded-full
                           hover:border-stone-900 hover:text-stone-900 transition-colors
                           disabled:opacity-50 cursor-pointer"
              >
                {cancelarTexto}
              </button>
              <button
                onClick={onConfirmar}
                disabled={cargando}
                className={`flex-1 py-3 text-white font-mono
                            text-[10px] uppercase tracking-widest rounded-full
                            transition-colors disabled:opacity-60 cursor-pointer
                            ${
                              peligro
                                ? "bg-red-700 hover:bg-red-800"
                                : "bg-stone-900 hover:bg-stone-800"
                            }`}
              >
                {cargando ? (
                  <span className="flex items-center justify-center gap-2">
                    <span
                      className={`w-3.5 h-3.5 border-2 rounded-full animate-spin
                                  border-white/30 border-t-white`}
                    />
                    {cargandoTexto}
                  </span>
                ) : (
                  confirmarTexto
                )}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
