"use client";

export default function ErrorGlobal({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="max-w-md mx-auto mt-24 text-center space-y-4 p-8">
      <p className="text-4xl">😵</p>
      <h2 className="text-xl font-bold text-gray-900">Algo salió inesperado</h2>
      <button
        onClick={reset}
        className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-medium
                         hover:bg-indigo-700 transition-colors"
      >
        Intentar de nuevo
      </button>
    </div>
  );
}
