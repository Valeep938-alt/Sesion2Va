export function Estrellas({
  promedio,
  className,
}: {
  promedio: number;
  className?: string;
}) {
  const llenas = Math.min(5, Math.max(0, Math.round(promedio)));
  return (
    <span
      className={`text-amber-500 ${className ?? ""}`}
      aria-label={`${promedio} de 5`}
    >
      {"★".repeat(llenas)}
      <span className="text-stone-300">{"☆".repeat(5 - llenas)}</span>
    </span>
  );
}
