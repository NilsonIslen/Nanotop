import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const donationWallet =
  "nano_1donate1111111111111111111111111111111111111111111111111117353trp";

const medalStyles = [
  "border-amber-300 bg-amber-100 text-amber-900 shadow-amber-200/70",
  "border-slate-300 bg-slate-100 text-slate-800 shadow-slate-200/80",
  "border-orange-300 bg-orange-100 text-orange-900 shadow-orange-200/70",
];

function getMedalStyle(index: number) {
  return medalStyles[index] ?? "border-sky-200 bg-sky-50 text-[#0b75bb] shadow-sky-100";
}

function getSocialHref(socialUrl: string) {
  if (socialUrl.startsWith("@")) {
    return `https://x.com/${socialUrl.slice(1)}`;
  }

  if (socialUrl.startsWith("http://") || socialUrl.startsWith("https://")) {
    return socialUrl;
  }

  return `https://${socialUrl}`;
}

export default async function ManizalesPage() {
  const ranking = await prisma.profile.findMany({
    where: {
      city: {
        slug: "manizales",
      },
    },
    orderBy: [{ points: "desc" }, { createdAt: "asc" }],
    select: {
      id: true,
      fullName: true,
      walletAddress: true,
      socialUrl: true,
      points: true,
      city: {
        select: {
          name: true,
          country: true,
        },
      },
    },
  });

  return (
    <main className="min-h-screen bg-[#f6f8fb] text-slate-950">
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2 font-bold">
            <span className="grid size-8 place-items-center rounded-md bg-[#209ce9] text-sm text-white">
              N
            </span>
            NanoTop
          </Link>
          <div className="min-w-0 rounded-md bg-sky-100 px-3 py-1 text-right text-[#0b75bb]">
            <p className="text-xs font-bold">Donaciones</p>
            <p className="max-w-36 truncate font-mono text-[10px] font-semibold sm:max-w-64">
              {donationWallet}
            </p>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-3xl px-4 py-6">
        <div className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-bold uppercase text-[#0b75bb]">Primer lanzamiento</p>
              <h1 className="mt-2 text-3xl font-black">Ranking NanoTop Manizales</h1>
            </div>
            <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-bold text-[#0b75bb]">
              Beta
            </span>
          </div>
          <p className="mt-4 leading-7 text-slate-600">
            Manizales es la primera comunidad NanoTop. Cada participante empieza con 0 puntos
            y asciende usando votos generados por transacciones de 0,1 NANO hacia usuarios que
            están por encima de su perfil en el ranking local.
          </p>
          <Link
            href="/manizales/participar"
            className="mt-5 block rounded-md bg-[#209ce9] px-4 py-3 text-center text-sm font-bold text-white"
          >
            Participar en Manizales
          </Link>
        </div>
      </section>

      <section id="ranking" className="mx-auto max-w-3xl px-4 pb-8">
        

        <div className="mt-4 grid gap-4">
          {ranking.length === 0 && (
            <p className="rounded-2xl border border-slate-200 bg-white p-5 text-sm font-bold text-slate-600 shadow-sm">
              Todavía no hay perfiles registrados en Manizales.
            </p>
          )}

          {ranking.map((user, index) => (
            <article key={user.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="h-1 bg-[#209ce9]" />
              <div className="p-4">
                <div className="flex items-start gap-3">
                  <div className="relative grid size-12 shrink-0 place-items-center">
                    <span
                      className={`grid size-11 place-items-center rounded-full border-2 text-sm font-black shadow-md ${getMedalStyle(index)}`}
                    >
                      {index + 1}
                    </span>
                    <span className="absolute -bottom-1 left-3 h-3 w-2 rounded-b-sm bg-[#209ce9]" />
                    <span className="absolute -bottom-1 right-3 h-3 w-2 rounded-b-sm bg-slate-950" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="truncate text-lg font-black">{user.fullName}</h3>
                        <p className="text-sm text-slate-600">
                          {user.city.name}, {user.city.country}
                        </p>
                      </div>
                      <div className="shrink-0 text-center">
                        <div className="relative size-14">
                          <span className="absolute left-1.5 top-1.5 size-12 rounded-full bg-amber-200" />
                          <span className="absolute left-0.5 top-0.5 size-12 rounded-full bg-amber-300" />
                          <div className="absolute inset-0 grid place-items-center rounded-full border-2 border-amber-400 bg-amber-100 text-amber-950 shadow-inner">
                            <p className="text-xl font-black">{user.points}</p>
                          </div>
                        </div>
                        <p className="mt-1 text-[11px] font-bold uppercase text-slate-500">puntos</p>
                      </div>
                    </div>

                    <div className="mt-3 space-y-1 text-sm">
                      <p className="text-slate-600 break-all">
                        <span className="font-bold text-slate-950">Wallet:</span>{" "}
                        <span className="font-mono text-xs leading-5">{user.walletAddress}</span>
                      </p>
                      {user.socialUrl && (
                        <p className="truncate text-slate-600">
                          <span className="font-bold text-slate-950">Red:</span>{" "}
                          <a
                            href={getSocialHref(user.socialUrl)}
                            target="_blank"
                            rel="noreferrer"
                            className="font-bold text-[#0b75bb] underline-offset-2 hover:underline"
                          >
                            {user.socialUrl}
                          </a>
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="crear" className="mx-auto grid max-w-3xl gap-4 px-4 pb-10">
        <div className="rounded-md border border-slate-200 bg-white p-5">
          <p className="text-sm font-bold uppercase text-[#0b75bb]">Cómo participar</p>
          <h2 className="mt-1 text-2xl font-black">Vota con transacciones reales</h2>
          <p className="mt-2 leading-7 text-slate-600">
            Para obtener 1 voto debes enviar 0,1 NANO a un usuario que esté por encima de ti
            en el ranking de Manizales. El receptor recibe el pago completo.
          </p>
          <ul className="mt-4 grid gap-2 text-sm font-semibold text-slate-700">
            <li className="rounded-md bg-slate-50 p-3">Posicionarme: +1 punto para tu perfil.</li>
            <li className="rounded-md bg-slate-50 p-3">Quemar: -1 punto al receptor, sin bajar de 0.</li>
          </ul>
        </div>

        <div className="rounded-md border border-slate-200 bg-white p-5">
          <p className="text-sm font-bold uppercase text-[#0b75bb]">Perfil local</p>
          <h2 className="mt-1 text-2xl font-black">Datos públicos y datos privados</h2>
          <p className="mt-2 leading-7 text-slate-600">
            Tu perfil público muestra nombre, ciudad, país, wallet Nano y enlaces opcionales.
            Barrio y celular se usan solo para verificar que perteneces a Manizales y no
            serán visibles para otros usuarios. El enlace a redes sociales es opcional.
          </p>
          <Link
            href="/manizales/participar"
            className="mt-5 block rounded-md bg-slate-950 px-4 py-3 text-center text-sm font-bold text-white"
          >
            Crear o revisar mi perfil
          </Link>
        </div>
      </section>

    </main>
  );
}
