"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { CampanaNotificaciones } from "@/components/layout/CampanaNotificaciones";

const ACTIVO = "text-stone-900 border-b border-stone-900 pb-0.5";
const INACTIVO = "text-stone-500 hover:text-stone-900 transition-colors";

function clases(activo: boolean) {
  return `text-xs uppercase tracking-widest font-mono transition-colors ${
    activo ? ACTIVO : INACTIVO
  }`;
}

export function Navbar() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const pathname = usePathname();
  const router = useRouter();
  const [menuAbierto, setMenuAbierto] = useState(false);

  const roles: string[] = user?.roles ?? [];
  const esSubastador = roles.some((r) =>
    ["Subastador", "Usuario", "Admin"].includes(r),
  );
  const esAdmin = roles.includes("Admin");

  const links = [
    { href: "/", label: "Catálogo", visible: true, prefijo: false },
    {
      href: "/mis-subastas",
      label: "Mis Lotes",
      visible: esSubastador,
      prefijo: true,
    },
    { href: "/admin", label: "Admin", visible: esAdmin, prefijo: true },
    {
      href: "/moderacion",
      label: "Moderación",
      visible: esAdmin,
      prefijo: false,
    },
  ].filter((l) => l.visible);

  const cerrar = () => setMenuAbierto(false);
  const activo = (l: { href: string; prefijo: boolean }) =>
    l.prefijo ? pathname.startsWith(l.href) : pathname === l.href;

  function salir() {
    cerrar();
    logout();
    router.push("/");
  }

  return (
    <header className="sticky top-0 z-50 bg-[#F9F8F6]/90 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between gap-4">
        <Link href="/" className="group flex items-center gap-3 shrink-0">
          <span className="w-2.5 h-2.5 bg-stone-900 rounded-full group-hover:scale-125 transition-transform" />
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-stone-900 font-medium">
            LiveBid &middot; Studio
          </span>
        </Link>

        {/* Desktop */}
        <nav className="hidden md:flex items-center gap-5 lg:gap-7">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className={clases(activo(l))}>
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-4">
          {/* Campana de notificaciones */}
          <CampanaNotificaciones />

          {accessToken ? (
            <div className="hidden md:flex items-center gap-4">
              <span className="text-xs font-mono uppercase tracking-wider text-stone-600 hidden lg:inline truncate max-w-[160px]">
                {user?.nombre || user?.email || "Sesión Activa"}
              </span>
              <button
                onClick={salir}
                className="text-xs uppercase tracking-widest font-mono text-stone-900 border border-stone-300 hover:border-stone-900 px-4 py-2 transition-all cursor-pointer whitespace-nowrap"
              >
                Salir
              </button>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-3">
              <Link
                href="/auth?mode=login"
                className="text-xs uppercase tracking-widest font-mono text-stone-700 hover:text-stone-900 px-2"
              >
                Acceder
              </Link>
              <Link
                href="/auth?mode=register"
                className="text-xs uppercase tracking-widest font-mono bg-stone-900 hover:bg-stone-800 text-white px-4 py-2.5 transition-all whitespace-nowrap"
              >
                Registrarse
              </Link>
            </div>
          )}

          {/* Hamburguesa móvil */}
          <button
            onClick={() => setMenuAbierto((v) => !v)}
            aria-label="Menú"
            className="md:hidden flex flex-col justify-center gap-1.5 p-2 w-10 h-10"
          >
            <span
              className={`w-6 h-0.5 bg-stone-900 transition-transform ${
                menuAbierto ? "translate-y-2 rotate-45" : ""
              }`}
            />
            <span
              className={`w-6 h-0.5 bg-stone-900 transition-opacity ${
                menuAbierto ? "opacity-0" : ""
              }`}
            />
            <span
              className={`w-6 h-0.5 bg-stone-900 transition-transform ${
                menuAbierto ? "-translate-y-2 -rotate-45" : ""
              }`}
            />
          </button>
        </div>
      </div>

      {/* Panel móvil */}
      {menuAbierto && (
        <nav className="md:hidden border-t border-stone-200 bg-white px-6 py-4 flex flex-col gap-1">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={cerrar}
              className={`px-3 py-3 font-mono text-[11px] uppercase tracking-widest transition-colors ${
                activo(l)
                  ? "bg-stone-900 text-white"
                  : "text-stone-600 hover:bg-stone-50"
              }`}
            >
              {l.label}
            </Link>
          ))}
          <div className="pt-3 mt-2 border-t border-stone-100">
            {accessToken ? (
              <button
                onClick={salir}
                className="w-full py-3 border border-stone-300 font-mono text-[11px] uppercase tracking-widest text-stone-700"
              >
                Cerrar Sesión
              </button>
            ) : (
              <div className="flex gap-3">
                <Link
                  href="/auth?mode=login"
                  onClick={cerrar}
                  className="flex-1 text-center py-3 border border-stone-300 font-mono text-[11px] uppercase tracking-widest"
                >
                  Acceder
                </Link>
                <Link
                  href="/auth?mode=register"
                  onClick={cerrar}
                  className="flex-1 text-center py-3 bg-stone-900 text-white font-mono text-[11px] uppercase tracking-widest"
                >
                  Registro
                </Link>
              </div>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}
