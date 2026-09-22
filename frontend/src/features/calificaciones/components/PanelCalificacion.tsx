"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { toast } from "sonner";
import { useCalificar } from "../hooks/useCalificar";
import { obtenerMensajeError } from "@/utils/helpers/error-messages";

export function PanelCalificacion({ idSubasta }: { idSubasta: string }) {
  const [puntuacion, setPuntuacion] = useState(0);
  const [hover, setHover] = useState(0);
  const [comentario, setComentario] = useState("");
  const [enviado, setEnviado] = useState(false);
  const calificar = useCalificar();

  if (enviado) {
    return (
      <div className="bg-white border border-stone-200 p-6 rounded-3xl shadow-sm text-center">
        <p className="text-3xl">⭐</p>
        <p className="text-stone-600 font-light text-sm mt-2">
          ¡Gracias por calificar al subastador!
        </p>
      </div>
    );
  }

  function enviar() {
    if (puntuacion === 0) {
      toast.error("Selecciona una puntuación de 1 a 5 estrellas.");
      return;
    }
    calificar.mutate(
      { idSubasta, puntuacion, comentario: comentario.trim() || undefined },
      {
        onSuccess: () => {
          setEnviado(true);
          toast.success("Calificación enviada");
        },
        onError: (e) => toast.error(obtenerMensajeError(e)),
      },
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border border-stone-200 p-6 rounded-3xl shadow-sm space-y-4"
    >
      <div>
        <h3 className="font-serif text-xl text-stone-900">
          Califica al subastador
        </h3>
        <p className="text-xs font-mono uppercase tracking-widest text-stone-400 mt-1">
          Tu experiencia como ganador de este lote
        </p>
      </div>

      <div className="flex gap-1" onMouseLeave={() => setHover(0)}>
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            onMouseEnter={() => setHover(n)}
            onClick={() => setPuntuacion(n)}
            aria-label={`${n} estrellas`}
            className="text-3xl leading-none cursor-pointer transition-transform hover:scale-110"
          >
            <span
              className={
                (hover || puntuacion) >= n ? "text-amber-500" : "text-stone-300"
              }
            >
              ★
            </span>
          </button>
        ))}
      </div>

      <textarea
        value={comentario}
        onChange={(e) => setComentario(e.target.value)}
        rows={3}
        maxLength={500}
        placeholder="¿Cómo fue tu experiencia? (opcional)"
        className="w-full bg-stone-50 border border-stone-200 px-4 py-3 text-stone-900 text-sm
                   focus:outline-none focus:border-stone-900 rounded-none resize-none"
      />

      <button
        onClick={enviar}
        disabled={calificar.isPending}
        className="w-full py-3 bg-stone-900 hover:bg-stone-800 text-white font-mono
                   text-[11px] uppercase tracking-widest disabled:opacity-50"
      >
        {calificar.isPending ? "Enviando..." : "Enviar calificación"}
      </button>
    </motion.div>
  );
}
