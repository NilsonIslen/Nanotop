import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import HowItWorks from "@/components/HowItWorks";
import AdoptionPlan from "@/components/AdoptionPlan";
import Benefits from "@/components/Benefits";
import Transparency from "@/components/Transparency";
import Donations from "@/components/Donations";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function Home() {
  const ranking = await prisma.profile.findMany({
    where: {
      city: {
        slug: "manizales",
      },
    },
    orderBy: [{ points: "desc" }, { createdAt: "asc" }],
    take: 3,
    select: {
      id: true,
      fullName: true,
      points: true,
    },
  });

  return (
    <div className="flex min-h-screen flex-col bg-[#f6f8fb] text-slate-950">
      <Navigation />
      <main className="flex-1">
        <HeroSection ranking={ranking} />
        <HowItWorks />
        <AdoptionPlan />
        <Benefits />
        <Transparency />
        <Donations />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
