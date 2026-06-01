const donationItems = [
  "Infraestructura y operación de la plataforma",
  "Desarrollo de nuevas comunidades locales",
  "Herramientas públicas de auditoría y verificación",
];

export default function Donations() {
  return (
    <section id="donaciones" className="border-y border-slate-200 bg-[#f6f8fb] py-12 sm:py-20">
      <div className="mx-auto grid max-w-5xl gap-7 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <div>
          <p className="text-sm font-semibold uppercase tracking-normal text-[#0b75bb]">
            Donaciones
          </p>
          <h2 className="mt-3 text-3xl font-bold text-slate-950 sm:text-4xl">
            Apoyo voluntario, sin ventaja en el ranking
          </h2>
          <p className="mt-4 leading-7 text-slate-600">
            NanoTop acepta donaciones para sostener y desarrollar la plataforma. Las donaciones
            no generan votos, puntos ni beneficios de posición.
          </p>
        </div>

        <div className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-lg font-bold text-slate-950">Uso previsto</h3>
          <ul className="mt-4 grid gap-3">
            {donationItems.map((item) => (
              <li key={item} className="rounded-md bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700">
                {item}
              </li>
            ))}
          </ul>
          <p className="mt-5 text-sm leading-6 text-slate-600">
            Todas las donaciones recibidas serán públicas y verificables mediante la blockchain
            de Nano.
          </p>
        </div>
      </div>
    </section>
  );
}
