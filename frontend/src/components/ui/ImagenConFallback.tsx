import PLACEHOLDER_IMAGEN from "./../../../public/placeholder.svg";

export const FALLBACK_IMAGEN = "/placeholder.svg";

export function ImagenConFallback({
  src,
  alt,
  className,
}: {
  src?: string | null;
  alt: string;
  className?: string;
}) {
  return <img src={src ?? FALLBACK_IMAGEN} alt={alt} className={className} />;
}
