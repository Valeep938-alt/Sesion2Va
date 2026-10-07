"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { motion } from "motion/react";
import { Campo } from "@/components/ui/Campo";
import { ImagenConFallback } from "@/components/ui/ImagenConFallback";
import { formatearMoneda, formatearFechaHora } from "@/utils/formatters";
import { obtenerMensajeError } from "@/utils/helpers/error-messages";
import { useCategorias } from "../hooks/useCategorias";
import { useCrearSubasta } from "../hooks/useCrearSubasta";
import {
  crearSubastaSchema,
  type CrearSubastaForm,
  type CrearSubastaInput,
} from "../schemas/crearSubastaSchema";
import type { Categoria } from "../types";
import { ImageInput } from "./ImageInput";

const MAX_IMAGENES = 5;
const PASOS = ["Datos generales", "Imágenes", "Revisión final"] as const;
const CLASES_INPUT =
  "w-full bg-stone-50 border border-stone-200 px-4 py-3 text-stone-900 text-sm " +
  "focus:outline-none focus:border-stone-900 transition-colors rounded-none";
const CLASES_ERROR = "text-xs text-red-600 block mt-1 font-mono";
const CAMPOS_PASO_DATOS = [
  "titulo",
  "descripcion",
  "politicaEnvio",
  "precioBase",
  "incrementoMinimoPct",
  "idCategoria",
  "fechaInicio",
  "fechaFin",
] as const;

export function CrearSubastaView() {
  const [paso, setPaso] = useState(0);
  const [imagenes, setImagenes] = useState<string[]>([]);
  const router = useRouter();
  const { data: categorias } = useCategorias();
  const crearMutation = useCrearSubasta();

  const {
    register,
    handleSubmit,
    trigger,
    control,
    formState: { errors, isSubmitting },
  } = useForm<CrearSubastaInput, unknown, CrearSubastaForm>({
    resolver: zodResolver(crearSubastaSchema),
    defaultValues: {
      titulo: "",
      descripcion: "",
      politicaEnvio: "",
      precioBase: 0,
      incrementoMinimoPct: 5,
      idCategoria: "",
      fechaInicio: "",
      fechaFin: "",
      limiteUsuariosConcurrentes: 2,
    },
  });

  const valores = useWatch({ control });

  async function avanzar() {
    if (paso === 0) {
      const valido = await trigger([...CAMPOS_PASO_DATOS]);
      if (!valido) return;
    }
    setPaso((p) => Math.min(p + 1, PASOS.length - 1));
  }

  const onSubmit = handleSubmit(async (datos: CrearSubastaForm) => {
    try {
      await crearMutation.mutateAsync({
        ...datos,
        descripcion: datos.descripcion?.trim() || undefined,
        fechaInicio: new Date(datos.fechaInicio).toISOString(),
        fechaFin: new Date(datos.fechaFin).toISOString(),
        limiteUsuariosConcurrentes:
          !datos.limiteUsuariosConcurrentes ||
          datos.limiteUsuariosConcurrentes < 2
            ? 2
            : datos.limiteUsuariosConcurrentes,
        imagenes: imagenes.length ? imagenes : undefined,
      });
      toast.success(
        "Lote enviado. Un administrador lo revisará antes de publicarlo.",
      );
      router.push("/mis-subastas");
    } catch (e) {
      toast.error(obtenerMensajeError(e));
    }
  });

  return (
    <div className="min-h-screen bg-[#14202E] py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <header className="mb-8">
          <Link
            href="/mis-subastas"
            className="font-mono text-[10px] uppercase tracking-widest
                       text-stone-400 hover:text-white transition-colors"
          >
            ← Volver a mis subastas
          </Link>
          <h1 className="text-3xl font-serif font-light text-white mt-4">
            Publicar Nuevo Lote
          </h1>
          <p className="text-stone-400 text-sm font-light mt-2">
            Configura el artículo y su sala de puja en tres pasos.
          </p>
        </header>

        {/* Barra de progreso */}
        <ol className="flex items-center gap-3 mb-8">
          {PASOS.map((nombre, i) => (
            <li
              key={nombre}
              className="flex items-center gap-3 flex-1 last:flex-none"
            >
              <span
                className={`w-7 h-7 grid place-items-center font-mono text-[10px] font-bold
                            rounded-full transition-colors ${
                              i <= paso
                                ? "bg-white text-[#14202E]"
                                : "border border-stone-600 text-stone-500"
                            }`}
              >
                {i + 1}
              </span>
              <span
                className={`font-mono text-[10px] uppercase tracking-widest hidden sm:block ${
                  i <= paso ? "text-white" : "text-stone-500"
                }`}
              >
                {nombre}
              </span>
              {i < PASOS.length - 1 && (
                <span
                  className={`flex-1 h-px ${i < paso ? "bg-white" : "bg-stone-700"}`}
                />
              )}
            </li>
          ))}
        </ol>

        {/* Card blanca sobre fondo oscuro */}
        <motion.div
          key={paso}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="bg-white border border-stone-200 p-8 md:p-10 shadow-xl"
        >
          {paso === 0 && (
            <div className="space-y-5">
              <Campo label="Título del lote *">
                <input
                  {...register("titulo")}
                  className={CLASES_INPUT}
                  maxLength={150}
                  placeholder="Ej: Pintura al óleo original 1920"
                />
                {errors.titulo && (
                  <span className={CLASES_ERROR}>{errors.titulo.message}</span>
                )}
              </Campo>

              <Campo label="Descripción">
                <textarea
                  {...register("descripcion")}
                  className={`${CLASES_INPUT} h-24 resize-none`}
                  maxLength={2000}
                  placeholder="Detalles, estado de conservación, certificados…"
                />
                {errors.descripcion && (
                  <span className={CLASES_ERROR}>
                    {errors.descripcion.message}
                  </span>
                )}
              </Campo>

              <div className="grid grid-cols-2 gap-4">
                <Campo label="Categoría *">
                  <select {...register("idCategoria")} className={CLASES_INPUT}>
                    <option value="">Selecciona…</option>
                    {categorias?.map((c) => (
                      <option key={c.idCategoria} value={c.idCategoria}>
                        {c.nombre}
                      </option>
                    ))}
                  </select>
                  {errors.idCategoria && (
                    <span className={CLASES_ERROR}>
                      {errors.idCategoria.message}
                    </span>
                  )}
                </Campo>
                <Campo label="Precio base (COP) *">
                  <input
                    type="number"
                    min={1}
                    step="0.01"
                    {...register("precioBase")}
                    className={CLASES_INPUT}
                    placeholder="50000"
                  />
                  {errors.precioBase && (
                    <span className={CLASES_ERROR}>
                      {errors.precioBase.message}
                    </span>
                  )}
                </Campo>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Campo label="Inicio *" hint="Momento en que abre la puja">
                  <input
                    type="datetime-local"
                    {...register("fechaInicio")}
                    className={CLASES_INPUT}
                  />
                  {errors.fechaInicio && (
                    <span className={CLASES_ERROR}>
                      {errors.fechaInicio.message}
                    </span>
                  )}
                </Campo>
                <Campo label="Fin *" hint="La puja se cierra en este momento">
                  <input
                    type="datetime-local"
                    {...register("fechaFin")}
                    className={CLASES_INPUT}
                  />
                  {errors.fechaFin && (
                    <span className={CLASES_ERROR}>
                      {errors.fechaFin.message}
                    </span>
                  )}
                </Campo>
              </div>

              <Campo
                label="Límite de usuarios en sala"
                hint="Mínimo 2. Si lo dejas vacío o borras el valor, se usará 2."
              >
                <input
                  type="number"
                  min={2}
                  max={1000}
                  {...register("limiteUsuariosConcurrentes")}
                  className={CLASES_INPUT}
                  placeholder="2"
                />
                {errors.limiteUsuariosConcurrentes && (
                  <span className={CLASES_ERROR}>
                    {errors.limiteUsuariosConcurrentes.message}
                  </span>
                )}
              </Campo>

              <Campo
                label="Incremento mínimo (%)"
                hint="% que debe superar cada nueva puja"
              >
                <input
                  type="number"
                  min={1}
                  max={100}
                  step="0.5"
                  {...register("incrementoMinimoPct")}
                  className={CLASES_INPUT}
                />
                {errors.incrementoMinimoPct && (
                  <span className={CLASES_ERROR}>
                    {errors.incrementoMinimoPct.message}
                  </span>
                )}
              </Campo>

              <Campo label="Política de envío *">
                <textarea
                  {...register("politicaEnvio")}
                  className={`${CLASES_INPUT} h-20 resize-none`}
                  placeholder="Costos, tiempos, alcance de envío…"
                />
                {errors.politicaEnvio && (
                  <span className={CLASES_ERROR}>
                    {errors.politicaEnvio.message}
                  </span>
                )}
              </Campo>

            </div>
          )}

          {paso === 1 && (
            <PasoImagenes imagenes={imagenes} setImagenes={setImagenes} />
          )}
          {paso === 2 && (
            <PasoResumen
              valores={valores}
              imagenes={imagenes}
              categorias={categorias ?? []}
            />
          )}
        </motion.div>

        <footer className="flex justify-between pt-8">
          <button
            type="button"
            onClick={() => setPaso((p) => Math.max(0, p - 1))}
            disabled={paso === 0}
            className="px-6 py-3.5 border border-stone-600 text-stone-300 font-mono
                       text-[11px] uppercase tracking-widest disabled:opacity-30
                       hover:border-stone-400 hover:text-white transition-colors"
          >
            Atrás
          </button>
          {paso < PASOS.length - 1 ? (
            <button
              type="button"
              onClick={() => void avanzar()}
              className="bg-white text-[#14202E] px-8 py-3.5 font-mono
                         text-[11px] uppercase tracking-widest
                         hover:bg-stone-100 transition-colors"
            >
              Continuar
            </button>
          ) : (
            <button
              type="button"
              onClick={() => void onSubmit()}
              disabled={isSubmitting}
              className="bg-white text-[#14202E] px-8 py-3.5 font-mono
                         text-[11px] uppercase tracking-widest
                         hover:bg-stone-100 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? "Publicando…" : "Publicar Lote"}
            </button>
          )}
        </footer>
      </div>
    </div>
  );
}

function PasoImagenes({
  imagenes,
  setImagenes,
}: {
  imagenes: string[];
  setImagenes: (v: string[]) => void;
}) {
  const agregar = (url: string) => {
    if (!url) return;
    if (imagenes.length >= MAX_IMAGENES) {
      toast.error(`Máximo ${MAX_IMAGENES} imágenes por lote.`);
      return;
    }
    setImagenes([...imagenes, url]);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-serif font-normal text-stone-900">
          Imágenes del Lote
        </h2>
        <p className="text-xs font-mono text-stone-500 mt-1 uppercase tracking-wider">
          Verificación automática de contenido ({imagenes.length}/{MAX_IMAGENES}
          )
        </p>
      </div>

      {imagenes.length >= MAX_IMAGENES ? (
        <p className="text-sm text-stone-500 bg-stone-50 border border-stone-200 p-4">
          Alcanzaste el máximo de {MAX_IMAGENES} imágenes.
        </p>
      ) : (
        <ImageInput onVerificada={agregar} />
      )}

      {imagenes.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
          {imagenes.map((url, i) => (
            <div
              key={url}
              className="relative group border border-stone-200 overflow-hidden"
            >
              <ImagenConFallback
                src={url}
                alt={`Imagen ${i + 1}`}
                className="h-24 w-full object-cover"
              />
              {i === 0 && (
                <span
                  className="absolute top-1 left-1 bg-stone-900 text-white
                                 font-mono text-[9px] uppercase tracking-widest
                                 px-1.5 py-0.5"
                >
                  Principal
                </span>
              )}
              <button
                type="button"
                onClick={() => setImagenes(imagenes.filter((u) => u !== url))}
                className="absolute top-1 right-1 bg-stone-900/60 text-white text-xs
                           w-6 h-6 rounded-full opacity-0 group-hover:opacity-100
                           transition-opacity"
                aria-label="Quitar imagen"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function PasoResumen({
  valores,
  imagenes,
  categorias,
}: {
  valores: Partial<CrearSubastaForm>;
  imagenes: string[];
  categorias: Categoria[];
}) {
  const categoria = categorias.find(
    (c) => c.idCategoria === valores.idCategoria,
  );

  const limite = valores.limiteUsuariosConcurrentes ?? 2;

  const filas: [string, string][] = [
    ["Título", valores.titulo ?? "—"],
    ["Categoría", categoria?.nombre ?? "—"],
    ["Precio base", formatearMoneda(valores.precioBase ?? 0)],
    [
      "Incremento mínimo",
      valores.incrementoMinimoPct ? `${valores.incrementoMinimoPct}%` : "—",
    ],
    [
      "Inicia",
      valores.fechaInicio ? formatearFechaHora(valores.fechaInicio) : "—",
    ],
    ["Termina", valores.fechaFin ? formatearFechaHora(valores.fechaFin) : "—"],
    ["Límite en sala", `${limite} usuarios concurrentes`],
    ["Imágenes", `${imagenes.length} verificada(s)`],
    ["Tipo", valores.esPrivada ? "Privada" : "Pública"],
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-serif font-normal text-stone-900">
          Revisión Final
        </h2>
        <p className="text-xs font-mono text-stone-500 mt-1 uppercase tracking-wider">
          Verifica antes de enviar a aprobación
        </p>
      </div>

      {imagenes[0] && (
        <ImagenConFallback
          src={imagenes[0]}
          alt="Imagen principal"
          className="h-48 w-full object-cover border border-stone-200"
        />
      )}

      <dl className="divide-y divide-stone-100">
        {filas.map(([k, v]) => (
          <div key={k} className="flex justify-between items-baseline py-3">
            <dt className="font-mono text-[10px] uppercase tracking-widest text-stone-400">
              {k}
            </dt>
            <dd className="font-serif text-lg text-stone-900 text-right">
              {v}
            </dd>
          </div>
        ))}
      </dl>

      <p
        className="text-xs text-amber-700 bg-amber-50 border-l-2 border-amber-600
                    p-4 font-light leading-relaxed"
      >
        Al publicar, tu lote queda <b>En Revisión</b>: un administrador
        verificará su legitimidad antes de que aparezca en el catálogo público.
        La plataforma retiene una comisión del 5% sobre el precio final.
      </p>
    </div>
  );
}

