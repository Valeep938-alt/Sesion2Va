"use client";

import { Suspense, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { axiosClient as apiClient } from "@/api/config/axiosClient";
import { useAuthStore } from "@/store/authStore";
import { toast } from "sonner";
import { obtenerMensajeError } from "@/utils/helpers/error-messages";
import { authService } from "@/api/services/authService";

function AuthForm() {
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode");
  const [isLogin, setIsLogin] = useState(mode !== "register");
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setIsLogin(mode !== "register");
  }, [mode]);

  const [form, setForm] = useState({
    email: "",
    password: "",
    name: "",
    rol: "Comprador",
    phone: "",
  });

  const rolesDisponibles = [
    {
      id: "Comprador",
      label: "Comprador",
      desc: "Participa y puja en lotes activos",
    },
    {
      id: "Subastador",
      label: "Subastador",
      desc: "Publica y gestiona colecciones",
    },
    { id: "Usuario", label: "Híbrido", desc: "Acceso total a ambos perfiles" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        const data = await authService.login(form.email, form.password);

        const { user } = await authService.me(data.access_token);

        login(user, data.access_token, data.refresh_token);
        toast.success("Sesión iniciada");
      } else {
        await authService.register({
          nombre_completo: form.name,
          correo: form.email,
          contraseña: form.password,
          telefono: form.phone,
          rol: form.rol,
        });
        toast.success("Cuenta creada. Inicia sesión.");
        setIsLogin(true);
      }
      router.push("/");
    } catch (err) {
      toast.error(obtenerMensajeError(err));
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    const nuevoEstado = !isLogin;
    setIsLogin(nuevoEstado);
    router.replace(`/auth?mode=${nuevoEstado ? "login" : "register"}`, {
      scroll: false,
    });
  };

  return (
    <div className="min-h-screen bg-[#F9F8F6] text-stone-900 flex items-center justify-center p-6 selection:bg-stone-900 selection:text-white">
      <div className="w-full max-w-5xl bg-white border border-stone-200 shadow-xl grid grid-cols-1 md:grid-cols-2 overflow-hidden relative">
        <div className="p-10 md:p-14 flex flex-col justify-between bg-stone-900 text-white relative overflow-hidden min-h-[480px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={isLogin ? "left-login" : "left-register"}
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 15 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col justify-between h-full"
            >
              <div>
                <Link
                  href="/"
                  className="font-mono text-xs uppercase tracking-[0.3em] text-stone-400 block mb-12"
                >
                  LIVEBID STUDIO
                </Link>
                <h2 className="text-3xl md:text-4xl font-serif font-light leading-tight">
                  {isLogin
                    ? "Acceso exclusivo a salas de puja."
                    : "Configura tu perfil híbrido en la plataforma."}
                </h2>
                <p className="mt-4 text-stone-400 text-sm font-light leading-relaxed">
                  {isLogin
                    ? "Introduce tus credenciales para gestionar tus pujas en curso y supervisar lotes en tiempo real."
                    : "Selecciona tu perfil principal de participación para adaptar tu experiencia y herramientas operativas."}
                </p>
              </div>
              <div className="mt-12 pt-8 border-t border-stone-800 flex items-center justify-between">
                <span className="text-xs font-mono text-stone-400">
                  {isLogin ? "¿No tienes cuenta?" : "¿Ya estás registrado?"}
                </span>
                <button
                  onClick={toggleMode}
                  className="text-xs font-mono uppercase tracking-widest text-white hover:text-stone-300 underline underline-offset-4 cursor-pointer transition-colors"
                >
                  {isLogin ? "Registrarse" : "Iniciar Sesión"}
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="p-10 md:p-14 flex flex-col justify-center bg-white relative min-h-[520px]">
          <AnimatePresence mode="wait">
            {isLogin ? (
              <motion.form
                key="form-login"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                onSubmit={handleSubmit}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-2xl font-serif font-normal text-stone-900">
                    Iniciar Sesión
                  </h3>
                  <p className="text-xs font-mono text-stone-500 mt-1 uppercase tracking-wider">
                    Ingresa tus datos de acceso
                  </p>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-widest text-stone-600 mb-2">
                      Correo electrónico
                    </label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) =>
                        setForm({ ...form, email: e.target.value })
                      }
                      placeholder="usuario@dominio.com"
                      className="w-full bg-stone-50 border border-stone-200 px-4 py-3 text-stone-900 text-sm focus:outline-none focus:border-stone-900 transition-colors rounded-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-widest text-stone-600 mb-2">
                      Contraseña
                    </label>
                    <input
                      type="password"
                      required
                      value={form.password}
                      onChange={(e) =>
                        setForm({ ...form, password: e.target.value })
                      }
                      placeholder="••••••••"
                      className="w-full bg-stone-50 border border-stone-200 px-4 py-3 text-stone-900 text-sm focus:outline-none focus:border-stone-900 transition-colors rounded-none"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-stone-900 hover:bg-stone-800 text-white text-xs uppercase tracking-widest font-mono transition-colors rounded-none cursor-pointer disabled:opacity-50"
                >
                  {loading ? "Conectando..." : "Entrar a la Sala"}
                </button>
              </motion.form>
            ) : (
              <motion.form
                key="form-register"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                onSubmit={handleSubmit}
                className="space-y-4"
              >
                <div>
                  <h3 className="text-2xl font-serif font-normal text-stone-900">
                    Crear Cuenta
                  </h3>
                  <p className="text-xs font-mono text-stone-500 mt-1 uppercase tracking-wider">
                    Registro de usuario híbrido
                  </p>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-widest text-stone-600 mb-1">
                      Nombre completo
                    </label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                      }
                      placeholder="Tu Nombre"
                      className="w-full bg-stone-50 border border-stone-200 px-3.5 py-2 text-stone-900 text-sm focus:outline-none focus:border-stone-900 transition-colors rounded-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-widest text-stone-600 mb-1">
                      Correo electrónico
                    </label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) =>
                        setForm({ ...form, email: e.target.value })
                      }
                      placeholder="usuario@dominio.com"
                      className="w-full bg-stone-50 border border-stone-200 px-3.5 py-2 text-stone-900 text-sm focus:outline-none focus:border-stone-900 transition-colors rounded-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase tracking-widest text-stone-600 mb-1">
                      Telefono
                    </label>
                    <input
                      type="tel"
                      required
                      value={form.phone}
                      onChange={(e) =>
                        setForm({ ...form, phone: e.target.value })
                      }
                      placeholder="1234567890"
                      className="w-full bg-stone-50 border border-stone-200 px-3.5 py-2 text-stone-900 text-sm focus:outline-none focus:border-stone-900 transition-colors rounded-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase tracking-widest text-stone-600 mb-1">
                      Contraseña
                    </label>
                    <input
                      type="password"
                      required
                      value={form.password}
                      onChange={(e) =>
                        setForm({ ...form, password: e.target.value })
                      }
                      placeholder="••••••••"
                      className="w-full bg-stone-50 border border-stone-200 px-3.5 py-2 text-stone-900 text-sm focus:outline-none focus:border-stone-900 transition-colors rounded-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-widest text-stone-600 mb-2">
                      Selecciona tu Rol Principal
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {rolesDisponibles.map((r) => {
                        const activo = form.rol === r.id;
                        return (
                          <button
                            type="button"
                            key={r.id}
                            onClick={() => setForm({ ...form, rol: r.id })}
                            className={`p-3 text-left border transition-all cursor-pointer flex flex-col justify-between ${activo
                                ? "border-stone-900 bg-stone-900 text-white shadow-sm"
                                : "border-stone-200 bg-stone-50 text-stone-800 hover:border-stone-400"
                              }`}
                          >
                            <span className="font-mono text-[11px] uppercase tracking-wider font-semibold block">
                              {r.label}
                            </span>
                            <span
                              className={`text-[9px] font-light mt-1 line-clamp-1 ${activo ? "text-stone-300" : "text-stone-500"
                                }`}
                            >
                              {r.desc}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-stone-900 hover:bg-stone-800 text-white text-xs uppercase tracking-widest font-mono transition-colors rounded-none cursor-pointer mt-1 disabled:opacity-50"
                >
                  {loading ? "Registrando..." : "Completar Registro"}
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-stone-100 text-stone-400">
          Cargando...
        </div>
      }
    >
      <AuthForm />
    </Suspense>
  );
}

