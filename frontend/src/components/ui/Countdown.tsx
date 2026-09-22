"use client";

import { useEffect, useState } from "react";

function calcularRestante(fechaFin: string): number {
  return Math.max(0, new Date(fechaFin).getTime() - Date.now());
}

export function Countdown({
  fechaFin,
  onTerminado,
}: {
  fechaFin: string;
  onTerminado?: () => void;
}) {
  const [ms, setMs] = useState(() => calcularRestante(fechaFin));

  useEffect(() => {
    const intervalo = setInterval(() => {
      const restante = calcularRestante(fechaFin);
      setMs(restante);
      if (restante === 0) onTerminado?.();
    }, 1_000);
    return () => clearInterval(intervalo);
  }, [fechaFin, onTerminado]);

  const totalSeg = Math.floor(ms / 1_000);
  const horas = String(Math.floor(totalSeg / 3600)).padStart(2, "0");
  const minutos = String(Math.floor((totalSeg % 3600) / 60)).padStart(2, "0");
  const segundos = String(totalSeg % 60).padStart(2, "0");

  return (
    <span className="font-mono text-sm tabular-nums">
      {horas}:{minutos}:{segundos}
    </span>
  );
}
