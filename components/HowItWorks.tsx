const steps = [
  {
    title: "Envía 0,1 NANO",
    text: "El usuario envía 0,1 NANO a otro perfil que esté por encima en el ranking de su ciudad.",
  },
  {
    title: "Recibe 1 voto",
    text: "Cuando la transacción se confirma, el receptor recibe los 0,1 NANO completos y el remitente obtiene 1 voto.",
  },
  {
    title: "Usa el voto",
    text: "El voto debe usarse inmediatamente para sumar 1 punto a tu perfil o quemar 1 punto del receptor sin bajarlo de cero.",
  },
];

export default function HowItWorks() {
  return (
    <section id="votos" className="bg-white py-12 sm:py-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div>
          <p className="text-sm font-semibold uppercase tracking-normal text-[#0b75bb]">Sistema de votos</p>
          <h2 className="mt-3 text-3xl font-bold text-slate-950 sm:text-4xl">
            La competencia nace de transacciones reales
          </h2>
        </div>

        <div className="mt-7 grid gap-4 sm:grid-cols-3">
          {steps.map((step, index) => (
            <article key={step.title} className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
              <div className="grid size-9 place-items-center rounded-md bg-sky-100 text-sm font-bold text-[#0b75bb]">
                {index + 1}
              </div>
              <h3 className="mt-5 text-lg font-bold text-slate-950">{step.title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">{step.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
