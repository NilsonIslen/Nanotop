export default function CTASection() {
  return (
    <section id="participar" className="bg-white py-12 sm:py-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="flex flex-col items-start justify-between gap-6 border-y border-slate-200 py-10 md:flex-row md:items-center">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold text-slate-950 sm:text-4xl">
              Manizales será el primer NanoTop
            </h2>
            <p className="mt-4 leading-7 text-slate-600">
              El objetivo es validar el modelo local y construir comunidades Nano conectadas
              entre sí, hasta que comercios y servicios lo adopten como opción de pago real.
            </p>
          </div>
          <a
            href="/manizales"
            className="w-full rounded-md bg-[#209ce9] px-5 py-3 text-center text-sm font-semibold text-white transition hover:bg-[#167fc2] sm:w-auto"
          >
            Ver ranking
          </a>
        </div>
      </div>
    </section>
  );
}
