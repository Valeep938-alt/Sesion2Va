"use client";

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-stone-900 text-stone-300">
      <div className="max-w-7xl mx-auto px-6 py-14 grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Columna 1: Información */}
        <div>
          <h3 className="text-white font-serif text-xl font-light leading-snug mb-6">
            Más información
            <br />
            sobre LiveBid
          </h3>
          <div className="flex gap-10">
            <ul className="space-y-2 text-sm font-light">
              {["Subastas", "Vender", "Acerca de", "Blog", "Contacto"].map(
                (x) => (
                  <li key={x}>
                    <a href="#" className="hover:text-white transition-colors">
                      {x}
                    </a>
                  </li>
                ),
              )}
            </ul>
            <ul className="space-y-2 text-sm font-light mt-auto">
              <li>
                <a
                  href="#"
                  className="underline hover:text-white transition-colors"
                >
                  Visita nuestras tiendas
                </a>
              </li>
              <li className="font-mono text-xs text-stone-500">
                Servicio al cliente: 123-456-7890
              </li>
            </ul>
          </div>
        </div>

        {/* Columna 2: Ayuda y Newsletter */}
        <div>
          <h3 className="text-white font-mono text-xs uppercase tracking-widest mb-6">
            Ayuda
          </h3>
          <ul className="space-y-2 text-sm font-light">
            {[
              "Centro de ayuda",
              "Envíos y devoluciones",
              "Políticas de la tienda",
              "Métodos de pago",
            ].map((x) => (
              <li key={x}>
                <a href="#" className="hover:text-white transition-colors">
                  {x}
                </a>
              </li>
            ))}
          </ul>

          <div className="mt-8">
            <label className="text-[10px] font-mono uppercase tracking-widest text-stone-500 block mb-2">
              Ingresa tu email aquí *
            </label>
            <form className="flex" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                required
                placeholder="tu@correo.com"
                className="flex-1 bg-white/10 border border-white/20 px-3 py-2.5 text-sm
                           text-white placeholder:text-stone-500 focus:outline-none
                           focus:border-white/60 transition-colors"
              />
              <button
                type="submit"
                className="bg-white text-stone-900 text-xs font-mono uppercase
                           tracking-widest px-5 hover:bg-stone-200 transition-colors cursor-pointer"
              >
                Unirse
              </button>
            </form>
          </div>
        </div>

        {/* Columna 3: Redes Sociales */}
        <div>
          <h3 className="text-white font-mono text-xs uppercase tracking-widest mb-6">
            Síguenos
          </h3>
          <ul className="space-y-2 text-sm font-light">
            {["Facebook", "Instagram", "Twitter / X"].map((x) => (
              <li key={x}>
                <a href="#" className="hover:text-white transition-colors">
                  {x}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-wrap gap-4 items-center justify-between text-xs font-mono text-stone-500">
          <p>©2026 Creado por LiveBid. Todos los derechos reservados.</p>
          <button
            onClick={scrollToTop}
            className="uppercase tracking-widest hover:text-white transition-colors cursor-pointer"
          >
            ↑ Subir arriba
          </button>
        </div>
      </div>
    </footer>
  );
}
