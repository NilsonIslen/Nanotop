const NANO_RAW_PER_VOTE = "100000000000000000000000000000";
const RAW_PER_NANO = BigInt(10) ** BigInt(30);
const RPC_TIMEOUT_MS = 8000;
const DEFAULT_NANO_RPC_URL = "http://127.0.0.1:7076";

type NanoBlockInfo = {
  block_account?: string;
  amount?: string;
  confirmed?: string;
  type?: string;
  subtype?: string;
  contents?: string | {
    link_as_account?: string;
    link?: string;
  };
  error?: string;
};

type NanoHistoryEntry = {
  hash?: string;
  type?: string;
  subtype?: string;
  account?: string;
  amount?: string;
  confirmed?: string;
};

type NanoAccountHistory = {
  history?: NanoHistoryEntry[] | "";
  error?: string;
};

export const voteAmountNano = "0.1";
export const voteAmountRaw = NANO_RAW_PER_VOTE;

export async function getNanoBlockInfo(hash: string) {
  const data = await nanoRpc<NanoBlockInfo>({
    action: "block_info",
    hash,
    json_block: "true",
  });

  return normalizeBlockInfo(data);
}

export async function findVotePaymentBlock(senderWallet: string, receiverWallet: string) {
  const data = await nanoRpc<NanoAccountHistory>(
    {
      action: "account_history",
      account: senderWallet,
      count: "50",
      raw: "true",
    },
    {
      shouldRetryWithFallback: (history) =>
        !Array.isArray(history.history) || history.history.length === 0,
    },
  );

  if (!Array.isArray(data.history) || data.history.length === 0) {
    throw new Error(
      "No encontré pagos recientes enviados desde la wallet registrada. Confirma que pagaste desde esa misma cuenta Nano y no desde otra cuenta del monedero.",
    );
  }

  const sendsToReceiver = data.history.filter(
    (entry) =>
      getBlockType(entry) === "send" &&
      entry.confirmed === "true" &&
      entry.account === receiverWallet,
  );

  const exactPayment = sendsToReceiver.find(
    (entry) => entry.amount === voteAmountRaw && entry.hash && isNanoHash(entry.hash),
  );

  if (!exactPayment?.hash) {
    const latestToReceiver = sendsToReceiver.find((entry) => entry.amount);

    if (latestToReceiver?.amount) {
      throw new Error(
        `Encontré un pago al receptor, pero fue de ${formatRawAsNano(latestToReceiver.amount)} NANO. Debe ser exactamente ${voteAmountNano} NANO.`,
      );
    }

    throw new Error(
      "No encontré un pago confirmado de 0,1 NANO desde tu wallet hacia el receptor seleccionado.",
    );
  }

  const hash = normalizeNanoHash(exactPayment.hash);
  const block = await getNanoBlockInfo(hash);
  const issue = getVotePaymentIssue(block, senderWallet, receiverWallet);

  if (issue) {
    throw new Error(issue);
  }

  return { hash, block };
}

async function nanoRpc<T>(
  body: Record<string, string>,
  options: {
    shouldRetryWithFallback?: (data: T) => boolean;
  } = {},
) {
  const rpcUrls = getNanoRpcUrls();
  let lastError: unknown;

  for (let index = 0; index < rpcUrls.length; index += 1) {
    const isLastRpc = index === rpcUrls.length - 1;

    try {
      const data = await requestNanoRpc<T>(rpcUrls[index], body);

      if (!isLastRpc && options.shouldRetryWithFallback?.(data)) {
        continue;
      }

      return data;
    } catch (error) {
      lastError = error;

      if (isLastRpc) {
        break;
      }
    }
  }

  throw lastError instanceof Error ? lastError : new Error("No se pudo conectar con el nodo Nano");
}

async function requestNanoRpc<T>(rpcUrl: string, body: Record<string, string>) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), RPC_TIMEOUT_MS);

  try {
    const response = await fetch(rpcUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      signal: controller.signal,
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error("No se pudo conectar con el nodo Nano");
    }

    const data = (await response.json()) as T & { error?: string };

    if (data.error) {
      throw new Error(data.error);
    }

    return data;
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error("El nodo Nano tardó demasiado en responder");
    }

    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

function getNanoRpcUrls() {
  return [
    process.env.NANO_RPC_URL ?? DEFAULT_NANO_RPC_URL,
    ...(process.env.NANO_RPC_FALLBACK_URLS ?? "")
      .split(",")
      .map((url) => url.trim())
      .filter(Boolean),
  ];
}

export function normalizeNanoHash(value: string) {
  return value.trim().toUpperCase();
}

export function isNanoHash(value: string) {
  return /^[A-F0-9]{64}$/.test(normalizeNanoHash(value));
}

export function getVotePaymentIssue(
  block: NanoBlockInfo,
  senderWallet: string,
  receiverWallet: string,
) {
  if (block.confirmed !== "true") {
    return "La transacción todavía no está confirmada en la red Nano.";
  }

  if (getBlockType(block) !== "send") {
    return "El hash debe ser el bloque de envío desde tu wallet. Parece que pegaste un hash de recepción u otro tipo de bloque.";
  }

  if (block.block_account !== senderWallet) {
    return "El pago no fue enviado desde la wallet registrada en tu perfil.";
  }

  if (block.amount !== voteAmountRaw) {
    return `El monto enviado fue ${formatRawAsNano(block.amount)} NANO. Para generar un voto debe ser exactamente ${voteAmountNano} NANO.`;
  }

  if (getLinkAsAccount(block) !== receiverWallet) {
    return "El pago no fue enviado al perfil receptor seleccionado.";
  }

  return null;
}

export function isVotePaymentBlock(
  block: NanoBlockInfo,
  senderWallet: string,
  receiverWallet: string,
) {
  return getVotePaymentIssue(block, senderWallet, receiverWallet) === null;
}

function normalizeBlockInfo(block: NanoBlockInfo) {
  if (typeof block.contents !== "string") {
    return block;
  }

  try {
    return {
      ...block,
      contents: JSON.parse(block.contents) as NanoBlockInfo["contents"],
    };
  } catch {
    return block;
  }
}

function getLinkAsAccount(block: NanoBlockInfo) {
  if (!block.contents || typeof block.contents === "string") {
    return undefined;
  }

  return block.contents.link_as_account;
}

function getBlockType(block: { subtype?: string; type?: string }) {
  return block.subtype ?? block.type;
}

function formatRawAsNano(raw?: string) {
  if (!raw || !/^\d+$/.test(raw)) {
    return "desconocido";
  }

  const value = BigInt(raw);
  const whole = value / RAW_PER_NANO;
  const fraction = value % RAW_PER_NANO;

  if (fraction === BigInt(0)) {
    return whole.toString();
  }

  return `${whole}.${fraction.toString().padStart(30, "0").replace(/0+$/, "")}`;
}
