"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { axiosClient } from "@/api/config/axiosClient";
import { ConfirmacionModal } from "@/components/ui/ConfirmacionModal";
import { obtenerMensajeError } from "@/utils/helpers/error-messages";
import { formatearFecha } from "@/utils/formatters";

interface UsuarioAdmin {
  id: string;
  nombre: string;
  correo: string;
  estado: string;
  fechaRegistro: string;
  roles: string[];
}

const COLOR_ROL: Record<string, string> = {
  Admin: "bg-stone-900 text-white",
  Subastador: "bg-blue-100 text-blue-700",
  Comprador: "bg-green-100 text-green-700",
  Usuario: "bg-amber-100 text-amber-700",
};

export default function AdminUsuariosPage() {
  const queryClient = useQueryClient();
  const [busqueda, setBusqueda] = useState("");
  const [usuarioAEliminar, setUsuarioAEliminar] = useState<UsuarioAdmin | null>(
    null,
  );

  const { data, isPending } = useQuery({
    queryKey: ["admin", "usuarios"],
    queryFn: async () => {
      const { data } =
        await axiosClient.get<UsuarioAdmin[]>("/usuarios");
      return data;
    },
  });

  const eliminar = useMutation({
    mutationFn: (id: string) => axiosClient.delete(`/usuarios/${id}`),
    onSuccess: () => {
      toast.success("Usuario eliminado");
      void queryClient.invalidateQueries({ queryKey: ["admin", "usuarios"] });
    },
    onError: (e) => toast.error(obtenerMensajeError(e)),
  });

  const filtrados = (data ?? []).filter(
    (u) =>
      u.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      u.correo.toLowerCase().includes(busqueda.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <h1 className="text-3xl font-serif text-stone-900">Usuarios</h1>
        <input
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Buscar por nombre o correo…"
          className="w-full sm:max-w-xs bg-stone-50 border border-stone-200 px-4 py-2.5 text-sm
                     focus:outline-none focus:border-stone-900 rounded-full"
        />
      </div>

      <div className="bg-white border border-stone-200 rounded-3xl shadow-sm divide-y divide-stone-100 overflow-x-auto">
        {isPending && <p className="p-6 text-stone-400">Cargando…</p>}

        {filtrados.map((u) => (
          <div
            key={u.id}
            className="p-4 flex flex-wrap items-center gap-x-6 gap-y-2"
          >
            <div className="min-w-0 flex-1">
              <p className="font-serif text-lg text-stone-900 truncate">
                {u.nombre}
              </p>
              <p className="text-xs font-mono text-stone-400 truncate">
                {u.correo} · desde {formatearFecha(u.fechaRegistro)}
              </p>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {u.roles.map((r) => (
                <span
                  key={r}
                  className={`text-[9px] font-mono uppercase tracking-widest px-2.5 py-1 rounded-full ${
                    COLOR_ROL[r] ?? "bg-stone-100 text-stone-500"
                  }`}
                >
                  {r}
                </span>
              ))}
            </div>

            <span className="text-[10px] font-mono uppercase tracking-widest text-green-700 shrink-0">
              {u.estado}
            </span>

            <button
              onClick={() => setUsuarioAEliminar(u)}
              disabled={eliminar.isPending}
              className="px-4 py-2 border border-stone-300 text-stone-700 font-mono
                         text-[9px] uppercase tracking-widest rounded-full
                         hover:border-red-700 hover:text-red-700 transition-colors
                         disabled:opacity-50 shrink-0"
            >
              Eliminar
            </button>
          </div>
        ))}

        {!isPending && filtrados.length === 0 && (
          <p className="p-6 text-stone-400">Sin resultados.</p>
        )}
      </div>

      {/* confirmacion modal*/}
      <ConfirmacionModal
        abierto={usuarioAEliminar !== null}
        titulo="¿Eliminar usuario?"
        mensaje={`Se eliminará la cuenta de ${usuarioAEliminar?.nombre ?? ""} y perderá el acceso a la plataforma. Esta acción no se puede deshacer.`}
        confirmarTexto="Eliminar cuenta"
        cancelarTexto="Conservar"
        peligro
        cargando={eliminar.isPending}
        cargandoTexto="Eliminando…"
        onCancelar={() => setUsuarioAEliminar(null)}
        onConfirmar={() => {
          if (usuarioAEliminar) {
            eliminar.mutate(usuarioAEliminar.id, {
              onSettled: () => setUsuarioAEliminar(null),
            });
          }
        }}
      />
    </div>
  );
}
