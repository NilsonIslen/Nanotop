const metrics = [
  ["Pagos enviados y recibidos", "Cada transacción asociada al sistema puede revisarse públicamente."],
  ["Votos y puntos", "Posicionamientos, quemas e historial de puntos quedan registrados."],
  ["Cambios de posición", "La evolución del ranking muestra quién asciende y por qué."],
  ["Donaciones", "Los aportes voluntarios son públicos y no alteran el ranking."],
];

export default function Transparency() {
  return (
    <section className="bg-white py-12 sm:py-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="grid gap-7 lg:grid-cols-[1fr_1fr] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-normal text-[#0b75bb]">Transparencia total</p>
            <h2 className="mt-3 text-3xl font-bold text-slate-950 sm:text-4xl">
              Todo debe poder verificarse
            </h2>
            <p className="mt-4 leading-7 text-slate-600">
              La confianza del ranking depende de que cualquier usuario pueda auditar pagos,
              votos, puntos y movimientos sin pedir permiso.
            </p>
          </div>

          <div className="grid gap-4">
            {metrics.map(([title, text]) => (
              <article key={title} className="rounded-md border border-slate-200 p-5">
                <h3 className="font-bold text-slate-950">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
