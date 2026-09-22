import Link from "next/link";

export default function NoEncontrado() {
  return (
    <div className="min-h-screen bg-[#F9F8F6] flex items-center justify-center px-6 selection:bg-stone-900 selection:text-white">
      <div className="text-center max-w-md">
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-stone-400 block">
          LiveBid &middot; Studio — Error 404
        </span>

        <p className="font-serif text-8xl text-stone-900 mt-6 leading-none tabular-nums">
          4<span className="italic font-light">0</span>4
        </p>

        <h1 className="text-2xl font-serif font-light text-stone-900 mt-6">
          No encontramos esta <span className="italic">página</span>.
        </h1>

        <p className="text-stone-500 text-sm font-light mt-3 leading-relaxed">
          El lote que buscas puede haber finalizado, cambiado de sala o nunca
          haber existido. Vuelve al catálogo y descubre piezas únicas en pujas
          abiertas.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="px-8 py-3.5 bg-stone-900 hover:bg-stone-800 text-white
                       font-mono text-[11px] uppercase tracking-widest
                       transition-colors"
          >
            Volver al catálogo
          </Link>
        </div>

        <span className="block mt-10 font-mono text-[9px] uppercase tracking-[0.3em] text-stone-300">
          Colección Privada &middot; 2026
        </span>
      </div>
    </div>
  );
}
