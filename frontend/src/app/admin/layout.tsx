"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";

const SECCIONES = [
  { href: "/admin", label: "Resumen", icono: "📊" },
  { href: "/admin/moderacion", label: "Moderación", icono: "🛡️" },
  { href: "/admin/usuarios", label: "Usuarios", icono: "👥" },
  { href: "/admin/pagos", label: "Pagos", icono: "💳" },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);
  const [menuAbierto, setMenuAbierto] = useState(false);

  useEffect(() => {
    if (!user) router.replace("/auth?mode=login");
    else if (!user.roles?.includes("Administrador")) router.replace("/");
  }, [user, router]);

  if (!user?.roles?.includes("Administrador")) return null;

  return (
    <div className="min-h-screen bg-[#F9F8F6] flex flex-col lg:flex-row">
      <aside className="hidden lg:flex lg:w-64 flex-col bg-stone-900 text-white p-6 gap-2 sticky top-20 h-[calc(100vh-5rem)]">
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-stone-400 block mb-6">
          Panel Admin
        </span>
        {SECCIONES.map((s) => (
          <Link
            key={s.href}
            href={s.href}
            className={`flex items-center gap-3 px-4 py-3 font-mono text-[11px] uppercase tracking-widest transition-colors ${
              pathname === s.href
                ? "bg-white text-stone-900"
                : "text-stone-300 hover:bg-stone-800"
            }`}
          >
            <span>{s.icono}</span> {s.label}
          </Link>
        ))}
      </aside>

      <div className="lg:hidden sticky top-20 z-30 bg-stone-900 text-white px-6 py-3 flex items-center justify-between">
        <span className="font-mono text-[10px] uppercase tracking-[0.3em]">
          Panel Admin
        </span>
        <button
          onClick={() => setMenuAbierto((v) => !v)}
          className="font-mono text-xs uppercase tracking-widest cursor-pointer"
        >
          {menuAbierto ? "Cerrar ✕" : "Secciones ☰"}
        </button>
      </div>
      {menuAbierto && (
        <nav className="lg:hidden bg-stone-900 text-white px-6 pb-4 flex flex-col gap-1">
          {SECCIONES.map((s) => (
            <Link
              key={s.href}
              href={s.href}
              onClick={() => setMenuAbierto(false)}
              className={`px-4 py-3 font-mono text-[11px] uppercase tracking-widest ${
                pathname === s.href
                  ? "bg-white text-stone-900"
                  : "text-stone-300"
              }`}
            >
              {s.icono} {s.label}
            </Link>
          ))}
        </nav>
      )}

      <main className="flex-1 p-4 sm:p-6 lg:p-10 max-w-6xl w-full">
        {children}
      </main>
    </div>
  );
}

