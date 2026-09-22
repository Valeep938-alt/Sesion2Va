import Link from "next/link";
export default function AdminHome() {
  const items = [
    ["🛡️", "Revisar lotes pendientes", "/admin/moderacion"],
  ];
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-serif text-stone-900">
        Panel de Administración
      </h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map(([icono, label, href]) => (
          <Link
            key={href}
            href={href}
            className="bg-white border border-stone-200 p-6 rounded-3xl shadow-sm hover:border-stone-900 transition-colors"
          >
            <span className="text-3xl">{icono}</span>
            <p className="font-serif text-lg text-stone-900 mt-3">{label}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
