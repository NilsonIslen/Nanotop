import { NextResponse } from "next/server";
import { VoteType } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import {
  findVotePaymentBlock,
  getVotePaymentIssue,
  getNanoBlockInfo,
  isNanoHash,
  normalizeNanoHash,
  voteAmountNano,
} from "@/lib/nano-rpc";

const profileSelect = {
  id: true,
  fullName: true,
  country: true,
  walletAddress: true,
  socialUrl: true,
  points: true,
  city: {
    select: {
      name: true,
      country: true,
    },
  },
};

export async function POST(request: Request) {
  const body = await request.json();
  const senderId = String(body.senderId ?? "").trim();
  const receiverId = String(body.receiverId ?? "").trim();
  const transactionHash = normalizeNanoHash(String(body.transactionHash ?? ""));
  const voteType = String(body.voteType ?? "") as VoteType;

  if (!senderId || !receiverId || !voteType) {
    return NextResponse.json(
      { error: "Perfil, receptor y tipo de voto son obligatorios" },
      { status: 400 },
    );
  }

  if (voteType !== VoteType.SELF_PROMOTION && voteType !== VoteType.BURN) {
    return NextResponse.json({ error: "Tipo de voto inválido" }, { status: 400 });
  }

  if (transactionHash && !isNanoHash(transactionHash)) {
    return NextResponse.json(
      { error: "Ingresa un hash de transacción Nano válido" },
      { status: 400 },
    );
  }

  const [sender, receiver] = await Promise.all([
    prisma.profile.findUnique({
      where: { id: senderId },
      select: { id: true, cityId: true, walletAddress: true, points: true },
    }),
    prisma.profile.findUnique({
      where: { id: receiverId },
      select: { id: true, cityId: true, walletAddress: true, points: true },
    }),
  ]);

  if (!sender || !receiver || sender.cityId !== receiver.cityId || sender.id === receiver.id) {
    return NextResponse.json(
      { error: "Perfiles inválidos para esta votación" },
      { status: 400 },
    );
  }

  if (receiver.points < sender.points) {
    return NextResponse.json(
      { error: "Solo puedes votar por perfiles con los mismos puntos o más que el tuyo" },
      { status: 400 },
    );
  }

  let blockInfo;
  let paymentHash = transactionHash;

  try {
    if (paymentHash) {
      blockInfo = await getNanoBlockInfo(paymentHash);
    } else {
      const payment = await findVotePaymentBlock(sender.walletAddress, receiver.walletAddress);
      paymentHash = payment.hash;
      blockInfo = payment.block;
    }
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? `No se pudo validar el pago: ${error.message}`
            : "No se pudo validar el pago",
      },
      { status: 502 },
    );
  }

  const existingTransfer = await prisma.transfer.findFirst({
    where: { transactionHash: paymentHash },
    select: { id: true },
  });

  if (existingTransfer) {
    return NextResponse.json(
      { error: "Este pago ya fue usado para un voto" },
      { status: 409 },
    );
  }

  const paymentIssue = getVotePaymentIssue(blockInfo, sender.walletAddress, receiver.walletAddress);

  if (paymentIssue) {
    return NextResponse.json(
      { error: paymentIssue },
      { status: 400 },
    );
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
      const freshSender = await tx.profile.findUniqueOrThrow({
        where: { id: senderId },
        select: { id: true, points: true, cityId: true },
      });
      const freshReceiver = await tx.profile.findUniqueOrThrow({
        where: { id: receiverId },
        select: { id: true, points: true, cityId: true },
      });

      if (
        freshSender.id === freshReceiver.id ||
        freshSender.cityId !== freshReceiver.cityId ||
        freshReceiver.points < freshSender.points
      ) {
        throw new Error("El receptor ya no tiene los mismos puntos o más que tu perfil");
      }

      const targetProfileId =
        voteType === VoteType.SELF_PROMOTION ? freshSender.id : freshReceiver.id;
      const before =
        voteType === VoteType.SELF_PROMOTION ? freshSender.points : freshReceiver.points;
      const delta = voteType === VoteType.SELF_PROMOTION ? 1 : before > 0 ? -1 : 0;
      const after = before + delta;

      const transfer = await tx.transfer.create({
        data: {
          senderId,
          receiverId,
          amountNano: voteAmountNano,
          receiverAmount: voteAmountNano,
          transactionHash: paymentHash,
        },
      });

      const vote = await tx.vote.create({
        data: {
          type: voteType,
          voterId: senderId,
          receiverId,
          transferId: transfer.id,
        },
      });

      await tx.pointEvent.create({
        data: {
          profileId: targetProfileId,
          voteId: vote.id,
          delta,
          before,
          after,
        },
      });

      await tx.profile.update({
        where: { id: targetProfileId },
        data: { points: after },
      });

      const profile = await tx.profile.findUniqueOrThrow({
        where: { id: senderId },
        select: {
          ...profileSelect,
          cityId: true,
        },
      });

      const upperProfiles = await tx.profile.findMany({
        where: {
          cityId: profile.cityId,
          id: {
            not: profile.id,
          },
          points: {
            gte: profile.points,
          },
        },
        orderBy: [{ points: "desc" }, { createdAt: "asc" }],
        select: profileSelect,
      });

      return { profile, upperProfiles };
    });

    return NextResponse.json({
      message: "Pago validado y voto aplicado",
      profile: result.profile,
      upperProfiles: result.upperProfiles,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "No se pudo aplicar el voto después de validar el pago",
      },
      { status: 409 },
    );
  }
}
