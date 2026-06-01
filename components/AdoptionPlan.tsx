const phases = [
  {
    phase: "Fase A",
    title: "Lanzar Manizales",
    text: "Activar la primera comunidad NanoTop con perfiles locales, ranking único y transacciones verificables.",
  },
  {
    phase: "Fase B",
    title: "Consolidar uso local",
    text: "Impulsar interacción constante entre participantes para demostrar circulación real de Nano en la ciudad.",
  },
  {
    phase: "Fase C",
    title: "Replicar ciudad por ciudad",
    text: "Extender el modelo a Medellín, Bogotá, Madrid, Buenos Aires y cualquier ciudad con identidad propia.",
  },
];

export default function AdoptionPlan() {
  return (
    <section id="plan" className="bg-[#f6f8fb] py-12 sm:py-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-normal text-[#0b75bb]">
            Ruta de adopción
          </p>
          <h2 className="mt-3 text-3xl font-bold text-slate-950 sm:text-4xl">
            Primero comunidad, luego economía local, después red internacional
          </h2>
          <p className="mt-4 leading-7 text-slate-600">
            NanoTop empieza en Manizales como modelo para futuras expansiones en Colombia
            y el mundo.
          </p>
        </div>

        <div className="mt-7 grid gap-4 sm:grid-cols-3">
          {phases.map((item) => (
            <article key={item.phase} className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm font-bold text-[#0b75bb]">{item.phase}</p>
              <h3 className="mt-3 text-lg font-bold text-slate-950">{item.title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">{item.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
