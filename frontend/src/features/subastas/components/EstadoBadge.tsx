import { CONFIG_ESTADOS, type EstadoSubasta } from "../types";

export function EstadoBadge({ estado }: { estado: EstadoSubasta }) {
  const config = CONFIG_ESTADOS[estado] ?? CONFIG_ESTADOS.Pendiente;
  return (
    <span
      className={`shrink-0 text-[10px] font-mono uppercase tracking-widest
                  px-3 py-1 rounded-full ${config.clasesBadge}`}
    >
      {config.etiqueta}
    </span>
  );
}
