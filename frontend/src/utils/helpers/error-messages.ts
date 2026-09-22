import type { ApiErrorBody } from "@/types/api.types";

const MENSAJES_POR_CODIGO: Record<string, string> = {
  ERROR_INESPERADO: "Algo salió inesperado. Intenta de nuevo en unos momentos.",
  DATOS_INVALIDOS: "Revisa los datos del formulario.",
  CORREO_REGISTRADO: "Este correo ya tiene una cuenta. Intenta iniciar sesión.",
  CREDENCIALES_INVALIDAS:
    "Correo o contraseña incorrectos. Verifica e intenta de nuevo.",
  ERROR_REGISTRO: "No pudimos crear tu cuenta. Intenta de nuevo.",
  ROL_REQUERIDO: "Tu cuenta no tiene permiso para realizar esta acción.",
  COMPORTAMIENTO_SOSPECHOSO:
    "Detectamos actividad inusual. Inicia sesión nuevamente.",
  SUBASTA_NO_ENCONTRADA: "Esta subasta ya no está disponible.",
  SUBASTA_NO_PROPIA:
    "Solo el dueño de esta subasta puede realizar esta acción.",
  SUBASTA_NO_EDITABLE: "Solo puedes editarla mientras esté en revisión.",
  SUBASTA_NO_ELIMINABLE: "Solo puedes eliminarla mientras esté en revisión.",
  SUBASTA_PRIVADA: "Esta subasta es privada y requiere invitación.",
  ESTADO_INVALIDO: "La subasta no está en un estado que permita esta acción.",
  MOTIVO_REQUERIDO: "Indica el motivo del rechazo.",
  FECHAS_INVALIDAS: "Revisa las fechas de inicio y fin de la subasta.",
  CATEGORIA_NO_ENCONTRADA: "La categoría seleccionada no existe.",
  IMAGEN_INVALIDA: "El archivo no es una imagen válida (JPG, PNG o WebP).",
  IMAGEN_MUY_GRANDE: "La imagen supera el máximo de 5 MB.",
  IMAGEN_NO_ACCESIBLE: "No pudimos acceder al enlace de la imagen. Revísalo.",
  IMAGEN_REQUERIDA: "Envía un enlace o selecciona un archivo de imagen.",
  IMAGEN_MODERACION_RECHAZADA:
    "La imagen fue rechazada: contenido no permitido (nudidad, violencia o fraude).",
  MODERACION_NO_DISPONIBLE:
    "El verificador de imágenes no está disponible. Intenta en unos minutos.",
  IMAGEN_NO_MODERABLE:
    "No pudimos analizar la imagen. Revísalo e intenta de nuevo.",
  ERROR_SUBIDA: "No pudimos guardar la imagen. Intenta de nuevo.",
  SALA_LLENA: "La sala alcanzó su límite de usuarios. Intenta más tarde.",
  PAGO_NO_ENCONTRADO: "Este pago no existe.",
  PAGO_NO_PROPIO: "Este pago pertenece a otro usuario.",
  PAGO_YA_PROCESADO: "Este pago ya fue procesado exitosamente.",
  PAGO_VENCIDO:
    "El plazo de 48 horas expiró. El lote pasa al siguiente postor.",
  DATOS_TARJETA_INVALIDOS: "Revisa los datos de tu tarjeta.",
  YA_INSCRITO: "Ya estás inscrito en esta subasta.",
  NO_INSCRITO: "No tienes una inscripción en esta subasta.",
  YA_CALIFICADO: "Ya calificaste esta subasta.",
  NO_GANADOR: "Solo el ganador puede calificar al subastador.",
  RESERVA_NO_ENCONTRADA: "La solicitud no existe.",
  RESERVA_YA_RESPONDIDA: "Esta solicitud ya fue respondida.",
  RESERVA_REQUERIDA: "Esta subasta requiere reserva aprobada para pujar.",
  USUARIO_NO_ENCONTRADO: "Ese correo no tiene cuenta en LiveBid.",
};

const MENSAJES_POR_STATUS: Record<number, string> = {
  400: "Revisa los datos que enviaste.",
  401: "Tu sesión expiró. Inicia sesión de nuevo.",
  403: "No tienes permiso para esta acción.",
  404: "No encontramos lo que buscabas.",
  409: "Hubo un conflicto con los datos. Refresca e intenta otra vez.",
  413: "El archivo es demasiado grande.",
  500: "El servidor tuvo un problema. Intenta en unos momentos.",
};

export function traducirError(error: unknown): string {
  const e = error as {
    response?: { data?: ApiErrorBody; status?: number };
    code?: string;
  };
  const data = e.response?.data;

  if (data?.code && MENSAJES_POR_CODIGO[data.code])
    return MENSAJES_POR_CODIGO[data.code];
  if (typeof data?.message === "string" && data.message) return data.message;
  if (e.response?.status && MENSAJES_POR_STATUS[e.response.status]) {
    return MENSAJES_POR_STATUS[e.response.status];
  }
  if (e.code === "ERR_NETWORK" || e.code === "ECONNABORTED") {
    return "Sin conexión con el servidor. Revisa tu internet.";
  }
  return MENSAJES_POR_CODIGO.ERROR_INESPERADO;
}

export function obtenerMensajeError(error: unknown): string {
  return (
    (error as { mensajeUsuario?: string })?.mensajeUsuario ??
    traducirError(error)
  );
}
