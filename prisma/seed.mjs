import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const city = {
  slug: "manizales",
  name: "Manizales",
  country: "Colombia",
};

const profiles = [
  {
    fullName: "Laura Mejía",
    country: "Colombia",
    walletAddress: "nano_1laura8s9jk4m11111111111111111111111111111111111111111f7kq",
    barrio: "Centro",
    phoneNumber: "+57 300 000 0001",
    socialUrl: "@lauramejia",
    points: 18,
  },
  {
    fullName: "Andrés Pérez",
    country: "Colombia",
    walletAddress: "nano_1andres7hj2m111111111111111111111111111111111111111p9xz",
    barrio: "Chipre",
    phoneNumber: "+57 300 000 0002",
    socialUrl: "andresperez.co",
    points: 15,
  },
  {
    fullName: "Sofía Restrepo",
    country: "Colombia",
    walletAddress: "nano_1sofia6mq8d111111111111111111111111111111111111111k4ta",
    barrio: "Palermo",
    phoneNumber: "+57 300 000 0003",
    socialUrl: "@sofiarestrepo",
    points: 12,
  },
  {
    fullName: "Carlos Gómez",
    country: "Colombia",
    walletAddress: "nano_1carlos4na2x111111111111111111111111111111111111111h8pm",
    barrio: "La Enea",
    phoneNumber: "+57 300 000 0004",
    socialUrl: "@carlosg",
    points: 8,
  },
];

async function main() {
  const manizales = await prisma.city.upsert({
    where: { slug: city.slug },
    update: city,
    create: city,
  });

  for (const profile of profiles) {
    await prisma.profile.upsert({
      where: { walletAddress: profile.walletAddress },
      update: {
        ...profile,
        cityId: manizales.id,
      },
      create: {
        ...profile,
        cityId: manizales.id,
      },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
