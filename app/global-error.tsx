"use client";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="es">
      <body>
        <main className="min-h-screen bg-[#f6f8fb] px-4 py-10 text-slate-950">
          <div className="mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-white p-5">
            <p className="text-sm font-bold uppercase text-[#0b75bb]">Error</p>
            <h1 className="mt-2 text-3xl font-black">NanoTop no pudo cargar</h1>
            <button
              onClick={reset}
              className="mt-5 rounded-md bg-[#209ce9] px-4 py-3 text-sm font-bold text-white"
            >
              Reintentar
            </button>
          </div>
        </main>
      </body>
    </html>
  );
}
