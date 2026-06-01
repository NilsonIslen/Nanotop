const links = [
  { href: "#ranking", label: "Ranking" },
  { href: "#votos", label: "Votos" },
  { href: "#plan", label: "Plan" },
  { href: "#donaciones", label: "Donaciones" },
];

export default function Navigation() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <nav className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between px-4 sm:h-16 sm:px-6">
        <a href="#" className="flex items-center gap-3 font-semibold text-slate-950">
          <span className="grid size-8 place-items-center rounded-md bg-[#209ce9] text-sm font-bold text-white">
            N
          </span>
          <span>NanoTop</span>
        </a>

        <div className="hidden items-center gap-7 text-sm font-medium text-slate-600 sm:flex">
          {links.map((link) => (
            <a key={link.href} href={link.href} className="transition hover:text-slate-950">
              {link.label}
            </a>
          ))}
        </div>

        <a
          href="/manizales"
          className="rounded-md bg-slate-950 px-3 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 sm:px-4"
        >
          Manizales
        </a>
      </nav>
    </header>
  );
}
