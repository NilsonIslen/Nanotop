export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-[#f6f8fb]">
      <div className="mx-auto flex max-w-5xl flex-col gap-4 px-4 py-8 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p>(c) 2026 NanoTop. Apoya, Vota y Asciende.</p>
        <div className="flex gap-5">
          <a href="#ranking" className="hover:text-slate-950">
            Ranking
          </a>
          <a href="#votos" className="hover:text-slate-950">
            Votos
          </a>
          <a href="#donaciones" className="hover:text-slate-950">
            Donaciones
          </a>
        </div>
      </div>
    </footer>
  );
}
