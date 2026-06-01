import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isNanoAddress } from "@/lib/nano";

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

export async function GET(request: NextRequest) {
  const wallet = request.nextUrl.searchParams.get("wallet")?.trim();

  if (!wallet) {
    return NextResponse.json({ error: "Wallet requerida" }, { status: 400 });
  }

  if (!isNanoAddress(wallet)) {
    return NextResponse.json(
      { error: "Ingresa una dirección Nano válida" },
      { status: 400 },
    );
  }

  const profile = await prisma.profile.findUnique({
    where: { walletAddress: wallet },
    select: {
      ...profileSelect,
      cityId: true,
    },
  });

  if (!profile) {
    return NextResponse.json({ exists: false });
  }

  const upperProfiles = await prisma.profile.findMany({
    where: {
      cityId: profile.cityId,
      points: {
        gt: profile.points,
      },
    },
    orderBy: [{ points: "desc" }, { createdAt: "asc" }],
    select: profileSelect,
  });

  return NextResponse.json({
    exists: true,
    profile,
    upperProfiles,
  });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const walletAddress = String(body.walletAddress ?? "").trim();
  const fullName = String(body.fullName ?? "").trim();
  const barrio = String(body.barrio ?? "").trim();
  const phoneNumber = String(body.phoneNumber ?? "").trim();
  const socialUrl = String(body.socialUrl ?? "").trim();

  if (!walletAddress || !fullName || !barrio || !phoneNumber) {
    return NextResponse.json(
      { error: "Nombre, wallet, barrio y celular son obligatorios" },
      { status: 400 },
    );
  }

  if (!isNanoAddress(walletAddress)) {
    return NextResponse.json(
      { error: "Ingresa una dirección Nano válida" },
      { status: 400 },
    );
  }

  const city = await prisma.city.upsert({
    where: { slug: "manizales" },
    update: {},
    create: {
      slug: "manizales",
      name: "Manizales",
      country: "Colombia",
    },
  });

  const profile = await prisma.profile.create({
    data: {
      fullName,
      walletAddress,
      barrio,
      phoneNumber,
      cityId: city.id,
      country: "Colombia",
      socialUrl: socialUrl || null,
    },
    select: profileSelect,
  });

  return NextResponse.json({ profile }, { status: 201 });
}
