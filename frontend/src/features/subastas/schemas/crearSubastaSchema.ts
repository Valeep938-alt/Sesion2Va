import { z } from "zod";

export const crearSubastaSchema = z
  .object({
    titulo: z
      .string()
      .min(5, "El título debe tener al menos 5 caracteres")
      .max(150, "Máximo 150 caracteres"),
    descripcion: z.string().max(2000).optional(),
    politicaEnvio: z
      .string()
      .min(10, "Describe la política de envío (mínimo 10 caracteres)")
      .max(2000),
    precioBase: z.coerce.number().positive("El precio base debe ser mayor a 0"),
    incrementoMinimoPct: z.coerce.number().min(1).max(100).default(5),
    idCategoria: z.string().min(1, "Selecciona una categoría"),
    fechaInicio: z.string().min(1, "Define la fecha de inicio"),
    fechaFin: z.string().min(1, "Define la fecha de fin"),
    limiteUsuariosConcurrentes: z.coerce
      .number()
      .int()
      .min(2)
      .max(1000)
      .optional(),
    esPrivada: z.boolean().default(false),
  })
  .refine((datos) => new Date(datos.fechaFin) > new Date(datos.fechaInicio), {
    message: "La fecha de fin debe ser posterior a la de inicio",
    path: ["fechaFin"],
  });

export type CrearSubastaForm = z.output<typeof crearSubastaSchema>;
export type CrearSubastaInput = z.input<typeof crearSubastaSchema>;
