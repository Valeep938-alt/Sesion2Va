export type EstadoSubasta =
  | "Pendiente"
  | "Aprobada"
  | "Activa"
  | "Finalizada"
  | "Rechazada";

export interface ImagenSubasta {
  idImagen: string;
  url: string;
  esPrincipal: boolean;
  orden: number;
}

export interface Categoria {
  idCategoria: string;
  nombre: string;
}

export interface SubastaResumen {
  idSubasta: string;
  titulo: string;
  estado: EstadoSubasta;
  precioBase: string;
  motivoRechazo?: string | null;
  esPrivada: boolean;
  requiereReserva: boolean;
  fechaInicio: string;
  fechaFin: string;
  idCategoria2?: { idCategoria: string; nombre: string } | null;
  imagenes?: ImagenSubasta[];
}

export interface SubastaDetalle {
  idSubasta: string;
  titulo: string;
  descripcion: string | null;
  politicaEnvio: string;
  precioBase: string;
  incrementoMinimoPct: string;
  requiereReserva: boolean;
  esPrivada: boolean;
  estado: EstadoSubasta;
  motivoRechazo: string | null;
  fechaInicio: string;
  fechaFin: string;
  categoria: { id: string; nombre: string } | null;
  imagenes: { idImagen: string; url: string; esPrincipal: boolean }[];
  subastador: { id: string | null; nombre: string; correo: string };
  esGanador?: boolean;
}

export interface RespuestaDetalle {
  bloqueada: boolean;
  titulo?: string;
  subasta?: SubastaDetalle;
}

export interface PayloadCrearSubasta {
  titulo: string;
  descripcion?: string;
  politicaEnvio: string;
  precioBase: number;
  incrementoMinimoPct?: number;
  idCategoria: string;
  fechaInicio: string;
  fechaFin: string;
  limiteUsuariosConcurrentes?: number;
  esPrivada?: boolean;
  requiereReserva?: boolean;
  imagenes?: string[];
}

export interface ResultadoVerificacionImagen {
  url: string;
  origen: "link" | "upload";
}

export interface PujaEnVivo {
  idPuja: string;
  monto: string;
  pujador: string;
  precioActual: string;
  fechaFin?: string;
  extendida?: boolean;
  participantes: number;
  timestamp: number;
}

export const CONFIG_ESTADOS: Record<
  EstadoSubasta,
  { etiqueta: string; clasesBadge: string }
> = {
  Pendiente: {
    etiqueta: "En revisión",
    clasesBadge: "bg-amber-100 text-amber-700",
  },
  Aprobada: {
    etiqueta: "Aprobada · programada",
    clasesBadge: "bg-blue-100 text-blue-700",
  },
  Activa: { etiqueta: "● En vivo", clasesBadge: "bg-green-100 text-green-700" },
  Finalizada: {
    etiqueta: "Finalizada",
    clasesBadge: "bg-gray-100 text-gray-500",
  },
  Rechazada: { etiqueta: "Rechazada", clasesBadge: "bg-red-100 text-red-700" },
};

export interface AuctionCerrada {
  idSubasta: string;
  conGanador: boolean;
  montoFinal: string | null;
  timestamp: number;
}
