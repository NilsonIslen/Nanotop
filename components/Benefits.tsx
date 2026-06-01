const benefits = [
  ["Posicionarme", "+1 punto para tu perfil y una oportunidad de ascender en tu ranking local."],
  ["Quemar", "-1 punto para el perfil que recibió el pago. Ningún perfil puede quedar por debajo de 0."],
  ["Perfil verificado", "Barrio y celular se usan para validar pertenencia a la ciudad, pero no son públicos."],
  ["Actividad real", "Los puntos dependen de votos generados por transacciones Nano confirmadas."],
];

export default function Benefits() {
  return (
    <section className="border-y border-slate-200 bg-[#eef7ff] py-12 sm:py-20">
      <div className="mx-auto grid max-w-5xl gap-7 px-4 sm:px-6 lg:grid-cols-[0.85fr_1.15fr]">
        <div>
          <p className="text-sm font-semibold uppercase tracking-normal text-[#0b75bb]">Uso del voto</p>
          <h2 className="mt-3 text-3xl font-bold text-slate-950 sm:text-4xl">
            Cada voto cambia el ranking
          </h2>
          <p className="mt-4 leading-7 text-slate-700">
            NanoTop convierte la circulación directa de Nano en una dinámica visible:
            competir, ascender y auditar lo que ocurre dentro de cada comunidad.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {benefits.map(([title, text]) => (
            <article key={title} className="rounded-md bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <h3 className="text-lg font-bold text-slate-950">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">{text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
