"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { isNanoAddress, nanoAddressPattern } from "@/lib/nano";

type Profile = {
  id: string;
  fullName: string;
  country: string;
  walletAddress: string;
  socialUrl: string | null;
  points: number;
  city: {
    name: string;
    country: string;
  };
};

type Step = "wallet" | "register" | "transfer";
type VoteType = "SELF_PROMOTION" | "BURN";

const medalStyles = [
  "border-amber-300 bg-amber-100 text-amber-900 shadow-amber-200/70",
  "border-slate-300 bg-slate-100 text-slate-800 shadow-slate-200/80",
  "border-orange-300 bg-orange-100 text-orange-900 shadow-orange-200/70",
];

function getMedalStyle(index: number) {
  return medalStyles[index] ?? "border-sky-200 bg-sky-50 text-[#0b75bb] shadow-sky-100";
}

export default function ParticiparPage() {
  const [wallet, setWallet] = useState("");
  const [fullName, setFullName] = useState("");
  const [barrio, setBarrio] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [socialUrl, setSocialUrl] = useState("");
  const [step, setStep] = useState<Step>("wallet");
  const [currentProfile, setCurrentProfile] = useState<Profile | null>(null);
  const [upperProfiles, setUpperProfiles] = useState<Profile[]>([]);
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [selectedVoteType, setSelectedVoteType] = useState<VoteType | null>(null);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifyingPayment, setIsVerifyingPayment] = useState(false);

  async function handleWalletSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedWallet = wallet.trim();

    if (!isNanoAddress(trimmedWallet)) {
      setMessage("Ingresa una dirección Nano válida.");
      return;
    }

    setIsLoading(true);
    setMessage("");

    try {
      const response = await fetch(
        `/api/manizales/participants?wallet=${encodeURIComponent(trimmedWallet)}`,
      );
      const data = await response.json();

      if (!response.ok) {
        setMessage(data.error ?? "No se pudo revisar la wallet.");
        return;
      }

      if (!data.exists) {
        setCurrentProfile(null);
        setUpperProfiles([]);
        setStep("register");
        return;
      }

      setCurrentProfile(data.profile);
      setUpperProfiles(data.upperProfiles);
      setSelectedProfile(null);
      setSelectedVoteType(null);
      setStep("transfer");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleRegisterSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedWallet = wallet.trim();

    if (!isNanoAddress(trimmedWallet)) {
      setMessage("Ingresa una dirección Nano válida.");
      setStep("wallet");
      return;
    }

    setIsLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/manizales/participants", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          walletAddress: trimmedWallet,
          fullName: fullName.trim(),
          barrio: barrio.trim(),
          phoneNumber: phoneNumber.trim(),
          socialUrl: socialUrl.trim(),
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        setMessage(data.error ?? "No se pudo crear el perfil.");
        return;
      }

      setCurrentProfile(data.profile);
      setUpperProfiles([]);
      setSelectedProfile(null);
      setSelectedVoteType(null);
      setStep("transfer");
      setMessage("Perfil creado. Ya puedes empezar a posicionarte.");
    } finally {
      setIsLoading(false);
    }
  }

  function handleVoteSelection(profile: Profile, voteType: VoteType) {
    setSelectedProfile(profile);
    setSelectedVoteType(voteType);
    setMessage("");
  }

  async function handlePaymentVerification(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!currentProfile || !selectedProfile || !selectedVoteType) {
      setMessage("Selecciona un perfil y una acción antes de validar el pago.");
      return;
    }

    setIsVerifyingPayment(true);
    setMessage("");

    try {
      const response = await fetch("/api/manizales/votes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          senderId: currentProfile.id,
          receiverId: selectedProfile.id,
          voteType: selectedVoteType,
        }),
      });
      const data = await response
        .json()
        .catch(() => ({ error: "El servidor no devolvió una respuesta válida." }));

      if (!response.ok) {
        setMessage(data.error ?? "No se pudo validar el pago.");
        return;
      }

      setCurrentProfile(data.profile);
      setUpperProfiles(data.upperProfiles);
      setSelectedProfile(null);
      setSelectedVoteType(null);
      setMessage(data.message ?? "Pago validado y voto aplicado.");
    } catch (error) {
      setMessage(
        error instanceof Error
          ? `No se pudo validar el pago: ${error.message}`
          : "No se pudo validar el pago.",
      );
    } finally {
      setIsVerifyingPayment(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f6f8fb] text-slate-950">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-4">
          <Link href="/manizales" className="font-bold text-slate-950">
            NanoTop Manizales
          </Link>
          <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-bold text-[#0b75bb]">
            Participar
          </span>
        </div>
      </header>

      <section className="mx-auto max-w-3xl px-4 py-6">
        <p className="text-sm font-bold uppercase text-[#0b75bb]">Primer dato</p>
        <h1 className="mt-1 text-3xl font-black">Participar en NanoTop Manizales</h1>

        <form onSubmit={handleWalletSubmit} className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <label htmlFor="wallet" className="text-sm font-bold text-slate-950">
            Dirección pública (numero de cuenta Nano)
          </label>
          <input
            id="wallet"
            name="wallet"
            type="text"
            value={wallet}
            onChange={(event) => setWallet(event.target.value)}
            placeholder="nano_..."
            pattern={nanoAddressPattern}
            title="Ingresa una dirección Nano válida. Debe empezar por nano_ o xrb_."
            className="mt-2 w-full rounded-md border border-slate-300 px-4 py-3 text-sm outline-none focus:border-[#209ce9]"
            required
          />
          <button
            disabled={isLoading}
            className="mt-5 w-full rounded-md bg-[#209ce9] px-4 py-3 text-sm font-bold text-white disabled:opacity-60"
          >
            {isLoading ? "Revisando..." : "Continuar"}
          </button>
        </form>

        <a
          href="https://nautilus.io/"
          target="_blank"
          rel="noreferrer"
          className="mt-5 block w-full rounded-md bg-[#209ce9] px-4 py-3 text-center text-sm font-bold text-white"
        >
          No tienes monedero? descarga Nautilus
        </a>

        {message && step !== "transfer" && (
          <p className="mt-4 rounded-md bg-sky-50 p-3 text-sm font-bold text-[#0b75bb]">
            {message}
          </p>
        )}

        {step === "register" && (
          <form onSubmit={handleRegisterSubmit} className="mt-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-bold uppercase text-[#0b75bb]">Nuevo perfil</p>
            <h2 className="mt-1 text-2xl font-black">Registra tus datos</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Nombre, ciudad, país y wallet pueden mostrarse en el perfil. Barrio y celular
              se usan para verificar residencia y no serán públicos. Red social o sitio web
              es opcional.
            </p>
            <div className="mt-4 grid gap-3">
              <input
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                className="rounded-md border border-slate-300 px-4 py-3 text-sm"
                placeholder="Nombre completo"
                required
              />
              <input className="rounded-md border border-slate-300 px-4 py-3 text-sm" value="Manizales" readOnly />
              <input className="rounded-md border border-slate-300 px-4 py-3 text-sm" value="Colombia" readOnly />
              <input
                value={barrio}
                onChange={(event) => setBarrio(event.target.value)}
                className="rounded-md border border-slate-300 px-4 py-3 text-sm"
                placeholder="Barrio de residencia en Manizales"
                required
              />
              <input
                value={phoneNumber}
                onChange={(event) => setPhoneNumber(event.target.value)}
                className="rounded-md border border-slate-300 px-4 py-3 text-sm"
                placeholder="Número de celular"
                required
              />
              <input
                value={socialUrl}
                onChange={(event) => setSocialUrl(event.target.value)}
                className="rounded-md border border-slate-300 px-4 py-3 text-sm"
                placeholder="Red social o sitio web opcional"
              />
            </div>
            <button
              disabled={isLoading}
              className="mt-5 w-full rounded-md bg-slate-950 px-4 py-3 text-sm font-bold text-white disabled:opacity-60"
            >
              {isLoading ? "Creando..." : "Crear perfil"}
            </button>
          </form>
        )}

        {step === "transfer" && (
          <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-bold uppercase text-[#0b75bb]">
              {currentProfile ? currentProfile.fullName : "Perfil listo"}
            </p>
            <h2 className="mt-1 text-2xl font-black">Elige a quién enviar 0,1 NANO</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Solo aparecen perfiles que están sobre ti en el ranking. Cuando la transacción
              se confirme, debes usar el voto inmediatamente para posicionarte o quemar 1 punto
              del receptor.
            </p>

            {message && (
              <p className="mt-4 rounded-md bg-sky-50 p-3 text-sm font-bold text-[#0b75bb]">
                {message}
              </p>
            )}

            <div className="mt-4 grid gap-3">
              {upperProfiles.length === 0 && (
                <p className="rounded-xl bg-slate-50 p-4 text-sm font-bold text-slate-600">
                  No hay perfiles con tus mismos puntos o más en este momento.
                </p>
              )}

              {upperProfiles.map((profile, index) => {
                const isSelected = selectedProfile?.id === profile.id;
                const selectedActionLabel =
                  selectedVoteType === "SELF_PROMOTION"
                    ? "Posicionarme +1"
                    : "Quemar -1";

                return (
                  <article
                    key={profile.id}
                    className={`overflow-hidden rounded-2xl border bg-white text-left shadow-sm transition ${
                      isSelected
                        ? "border-[#209ce9] shadow-md"
                        : "border-slate-200 hover:-translate-y-0.5 hover:border-[#209ce9] hover:shadow-md"
                    }`}
                  >
                    <div className="h-1 bg-[#209ce9]" />
                    <div className="p-4">
                      <div className="grid gap-3 sm:flex sm:items-start sm:justify-between">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-3">
                            <div className="relative grid size-11 shrink-0 place-items-center">
                              <span
                                className={`grid size-10 place-items-center rounded-full border-2 text-xs font-black shadow-md ${getMedalStyle(index)}`}
                              >
                                {index + 1}
                              </span>
                              <span className="absolute -bottom-1 left-3 h-3 w-2 rounded-b-sm bg-[#209ce9]" />
                              <span className="absolute -bottom-1 right-3 h-3 w-2 rounded-b-sm bg-slate-950" />
                            </div>
                            <div className="min-w-0">
                              <p className="truncate font-black">{profile.fullName}</p>
                              <p className="text-xs font-bold text-slate-500">
                                {profile.city.name}, {profile.city.country}
                              </p>
                            </div>
                          </div>
                          <p className="mt-3 rounded-md bg-slate-50 px-3 py-2 font-mono text-xs leading-5 text-slate-500 break-all">
                            {profile.walletAddress}
                          </p>
                        </div>
                        <div className="w-fit shrink-0 text-center">
                          <div className="relative size-14">
                            <span className="absolute left-1.5 top-1.5 size-12 rounded-full bg-amber-200" />
                            <span className="absolute left-0.5 top-0.5 size-12 rounded-full bg-amber-300" />
                            <div className="absolute inset-0 grid place-items-center rounded-full border-2 border-amber-400 bg-amber-100 text-amber-950 shadow-inner">
                              <p className="text-xl font-black">{profile.points}</p>
                            </div>
                          </div>
                          <p className="mt-1 text-[11px] font-bold uppercase text-slate-500">puntos</p>
                        </div>
                      </div>
                      <div className="mt-3 grid gap-2 sm:grid-cols-2">
                        <button
                          type="button"
                          onClick={() => handleVoteSelection(profile, "SELF_PROMOTION")}
                          className={`rounded-md border px-3 py-3 text-center text-xs font-bold transition ${
                            isSelected && selectedVoteType === "SELF_PROMOTION"
                              ? "border-[#209ce9] bg-[#209ce9] text-white"
                              : "border-sky-100 bg-sky-50 text-[#0b75bb] hover:border-[#209ce9]"
                          }`}
                        >
                          Posicionarme +1
                        </button>
                        <button
                          type="button"
                          onClick={() => handleVoteSelection(profile, "BURN")}
                          className={`rounded-md border px-3 py-3 text-center text-xs font-bold transition ${
                            isSelected && selectedVoteType === "BURN"
                              ? "border-rose-700 bg-rose-700 text-white"
                              : "border-rose-100 bg-rose-50 text-rose-700 hover:border-rose-700"
                          }`}
                        >
                          Quemar -1
                        </button>
                      </div>

                      {isSelected && selectedVoteType && (
                        <form
                          onSubmit={handlePaymentVerification}
                          className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4"
                        >
                        <p className="text-sm font-black text-slate-950">
                          Paga 0,1 NANO para {selectedActionLabel}
                        </p>
                        <p className="mt-3 text-xs font-bold uppercase text-slate-500">
                          Enviar a
                        </p>
                        <p className="mt-1 rounded-md bg-white px-3 py-2 font-mono text-xs leading-5 text-slate-600 break-all">
                          {profile.walletAddress}
                        </p>
                        <a
                          href={`nano:${profile.walletAddress}?amount=100000000000000000000000000000`}
                          className="mt-3 block rounded-md bg-[#209ce9] px-4 py-3 text-center text-sm font-bold text-white"
                        >
                          Abrir monedero Nano
                        </a>
                        <p className="mt-3 rounded-md bg-white px-3 py-2 text-xs leading-5 text-slate-600">
                          Despues de enviar el pago, NanoTop buscara automaticamente un envio
                          confirmado desde tu wallet hacia este receptor por exactamente 0,1 NANO.
                        </p>
                        <button
                          disabled={isVerifyingPayment}
                          className="mt-3 w-full rounded-md bg-slate-950 px-4 py-3 text-sm font-bold text-white disabled:opacity-60"
                        >
                          {isVerifyingPayment ? "Buscando pago..." : "Buscar pago y aplicar voto"}
                        </button>
                        </form>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        )}





      </section>


      
    </main>
  );
}
