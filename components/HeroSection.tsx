type RankingProfile = {
  id: string;
  fullName: string;
  points: number;
};

type HeroSectionProps = {
  ranking: RankingProfile[];
};

export default function HeroSection({ ranking }: HeroSectionProps) {
  return (
    <section className="overflow-hidden bg-[#f6f8fb]">
      <div className="mx-auto grid min-h-[calc(100svh-3.5rem)] w-full max-w-5xl gap-7 px-4 pb-8 pt-8 sm:min-h-[calc(100vh-4rem)] sm:grid-cols-[0.95fr_1.05fr] sm:items-center sm:px-6 sm:py-12">
        <div>
          <p className="mb-4 inline-flex rounded-md border border-sky-200 bg-white px-3 py-1 text-sm font-semibold text-[#0b75bb]">
            Primer lanzamiento: Manizales
          </p>
          <h1 className="text-4xl font-bold leading-tight tracking-normal text-slate-950 sm:text-6xl">
            NanoTop
          </h1>
          <p className="mt-3 text-xl font-semibold text-slate-800 sm:text-2xl">
            Apoya, Vota y Asciende.
          </p>
          <p className="mt-5 max-w-xl text-base leading-7 text-slate-600 sm:text-lg">
            Plataforma de ranking local para usuarios de Nano. Cada ciudad tiene su propia
            comunidad, su propio ranking y actividad económica verificable basada en transacciones reales.
          </p>

          <div className="mt-7 grid gap-3 sm:flex sm:flex-row">
            <a
              href="/manizales"
              className="rounded-md bg-[#209ce9] px-5 py-3 text-center text-sm font-semibold text-white shadow-sm transition hover:bg-[#167fc2]"
            >
              Entrar a Manizales
            </a>
            <a
              href="#plan"
              className="rounded-md border border-slate-300 bg-white px-5 py-3 text-center text-sm font-semibold text-slate-950 transition hover:border-slate-500"
            >
              Ver plan
            </a>
          </div>

          <dl className="mt-8 grid grid-cols-3 gap-3">
            {[
              ["0,1", "NANO por voto"],
              ["100%", "recibe el usuario"],
              ["0", "comisiones"],
            ].map(([value, label]) => (
              <div key={label} className="rounded-md border border-slate-200 bg-white p-3">
                <dt className="text-xl font-bold text-slate-950">{value}</dt>
                <dd className="mt-1 text-xs font-medium text-slate-500">{label}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div id="ranking" className="rounded-[2rem] border border-slate-200 bg-slate-950 p-3 shadow-2xl shadow-slate-300/60">
          <div className="rounded-[1.5rem] bg-white p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase text-slate-500">Ranking local</p>
                <h2 className="mt-1 text-2xl font-bold">Manizales</h2>
              </div>
              <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-bold text-[#0b75bb]">
                Beta
              </span>
            </div>

            <div className="mt-5 space-y-3">
              {ranking.length === 0 && (
                <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                  <p className="text-sm font-semibold text-slate-600">
                    Aún no hay perfiles en Manizales.
                  </p>
                </div>
              )}

              {ranking.map((user, index) => (
                <div key={user.id} className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3">
                  <span className="grid size-9 shrink-0 place-items-center rounded-full bg-slate-950 text-sm font-bold text-white">
                    {index + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-slate-950">{user.fullName}</p>
                    <p className="text-sm text-slate-500">{user.points} puntos</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 rounded-xl bg-[#209ce9] p-4 text-white">
              <p className="text-sm font-semibold">Última acción</p>
              <p className="mt-1 text-sm leading-6">
                Cada pago confirmado genera un voto inmediato para posicionarte o quemar
                un punto del receptor.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
