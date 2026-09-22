export function formatearMoneda(
  valor: string | number | null | undefined,
): string {
  const numero = Number(valor ?? 0);
  if (Number.isNaN(numero)) return "$—";
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(numero);
}
