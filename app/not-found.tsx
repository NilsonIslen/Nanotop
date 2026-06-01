import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#f6f8fb] px-4 py-10 text-slate-950">
      <div className="mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-white p-5">
        <p className="text-sm font-bold uppercase text-[#0b75bb]">404</p>
        <h1 className="mt-2 text-3xl font-black">Página no encontrada</h1>
        <Link
          href="/manizales"
          className="mt-5 inline-block rounded-md bg-[#209ce9] px-4 py-3 text-sm font-bold text-white"
        >
          Ir a Manizales
        </Link>
      </div>
    </main>
  );
}
