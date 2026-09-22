"use client";

import { useEffect, useState } from "react";

export function useDebounce<T>(valor: T, delayMs = 400): T {
  const [valorDebounced, setValorDebounced] = useState(valor);

  useEffect(() => {
    const timer = setTimeout(() => setValorDebounced(valor), delayMs);
    return () => clearTimeout(timer);
  }, [valor, delayMs]);

  return valorDebounced;
}
