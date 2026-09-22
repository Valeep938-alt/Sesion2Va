"use client";

import { useState } from "react";
import { toast } from "sonner";
import { subastaService } from "@/api/services/subastaService";
import { obtenerMensajeError } from "@/utils/helpers/error-messages";

export function ImageInput({
  onVerificada,
}: {
  onVerificada: (url: string) => void;
}) {
  const [modo, setModo] = useState<"link" | "archivo">("link");
  const [url, setUrl] = useState("");
  const [cargando, setCargando] = useState(false);
  const [errorLocal, setErrorLocal] = useState("");
  const [preview, setPreview] = useState("");

  async function verificar(payload: {
    url?: string;
    archivo?: File;
  }): Promise<void> {
    setCargando(true);
    setErrorLocal("");
    try {
      const form = new FormData();

      if (payload.url) {
        const urlLimpia = payload.url.trim();
        if (!/^https?:\/\//i.test(urlLimpia)) {
          setErrorLocal("El enlace debe empezar con http:// o https://");
          setCargando(false);
          return;
        }
        form.append("url", urlLimpia);
      }
      if (payload.archivo) form.append("archivo", payload.archivo);

      const data = await subastaService.verificarImagen(form);
      setPreview(data.url);
      onVerificada(data.url);
      toast.success("Imagen verificada ✔");
    } catch (e) {
      setErrorLocal(obtenerMensajeError(e));
      setPreview("");
      onVerificada("");
    } finally {
      setCargando(false);
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex gap-2 p-1 bg-stone-100 w-fit">
        {(["link", "archivo"] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => {
              setModo(m);
              setErrorLocal("");
              setPreview("");
            }}
            className={`px-4 py-2 font-mono text-[10px] uppercase tracking-widest
                        transition-colors ${
                          modo === m
                            ? "bg-white shadow-sm text-stone-900"
                            : "text-stone-500 hover:text-stone-800"
                        }`}
          >
            {m === "link" ? "Enlace" : "Subir archivo"}
          </button>
        ))}
      </div>

      {modo === "link" ? (
        <div className="flex gap-2">
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://ejemplo.com/foto.jpg"
            className="flex-1 bg-stone-50 border border-stone-200 px-4 py-3
                       text-stone-900 text-sm focus:outline-none
                       focus:border-stone-900 transition-colors rounded-none"
          />
          <button
            type="button"
            disabled={cargando || !url.trim()}
            onClick={() => verificar({ url: url.trim() })}
            className="bg-stone-900 hover:bg-stone-800 text-white font-mono
                       text-[10px] uppercase tracking-widest px-5
                       disabled:opacity-40 transition-colors"
          >
            {cargando ? "···" : "Verificar"}
          </button>
        </div>
      ) : (
        <label
          className="block border-2 border-dashed border-stone-300 p-10
                     text-center cursor-pointer hover:border-stone-900
                     hover:bg-stone-50 transition-colors"
        >
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={(e) => {
              const archivo = e.target.files?.[0];
              if (archivo) verificar({ archivo });
              e.target.value = "";
            }}
          />
          <p className="font-serif text-lg text-stone-700">
            Arrastra una imagen o haz clic para elegirla
          </p>
          <p className="font-mono text-[10px] uppercase tracking-widest text-stone-400 mt-2">
            JPG · PNG · WebP — máx. 5 MB
          </p>
        </label>
      )}

      {cargando && (
        <p className="font-mono text-[10px] uppercase tracking-widest text-stone-400">
          Verificando imagen...
        </p>
      )}
      {errorLocal && (
        <p className="text-sm text-red-700 bg-red-50 border-l-2 border-red-700 p-3 font-light">
          {errorLocal}
        </p>
      )}

      {preview && (
        <div className="relative border border-stone-200 overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={preview}
            alt="Vista previa"
            className="h-52 w-full object-cover"
          />
          <span
            className="absolute top-3 right-3 bg-green-600 text-white font-mono
                           text-[9px] uppercase tracking-widest px-2.5 py-1"
          >
            Verificada
          </span>
        </div>
      )}
    </div>
  );
}
