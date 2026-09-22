"use client";

interface PropsSubastaPrivada {
  titulo: string;
  onSolicitar: () => void;
  solicitando: boolean;
  yaSolicitada: boolean;
}

export function SubastaPrivada({
  titulo,
  onSolicitar,
  solicitando,
  yaSolicitada,
}: PropsSubastaPrivada) {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6">
      <div className="w-full max-w-md bg-white border border-stone-200 shadow-xl p-10 md:p-12 text-center">
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-stone-400 block mb-6">
          Acceso Restringido
        </span>
        <h2 className="text-3xl font-serif font-light text-stone-900">
          Subasta Privada
        </h2>
        <p className="text-stone-500 text-sm font-light mt-4 leading-relaxed">
          «{titulo}» solo es visible para participantes invitados por el
          subastador. Solicita acceso para ser evaluado.
        </p>

        <div className="mt-10">
          {yaSolicitada ? (
            <p
              className="font-mono text-[10px] uppercase tracking-widest
                          text-amber-700 bg-amber-50 p-4"
            >
              Solicitud enviada — esperando respuesta
            </p>
          ) : (
            <button
              onClick={onSolicitar}
              disabled={solicitando}
              className="w-full py-4 bg-stone-900 hover:bg-stone-800 text-white
                         font-mono text-[11px] uppercase tracking-widest
                         transition-colors disabled:opacity-50"
            >
              {solicitando ? "Enviando..." : "Solicitar Acceso"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
