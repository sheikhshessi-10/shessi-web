import { SpaceBackground } from "./_components/SpaceBackground";
import { Nav } from "./_components/Nav";
import { Hero } from "./_components/Hero";
import { TechStrip } from "./_components/TechStrip";
import { Problem } from "./_components/Problem";
import { HowItWorks } from "./_components/HowItWorks";
import { Features } from "./_components/Features";
import { Stats } from "./_components/Stats";
import { Mission } from "./_components/Mission";
import { CTA } from "./_components/CTA";
import { Footer } from "./_components/Footer";

export default function VeilPage() {
  return (
    <>
      <SpaceBackground />
      <main className="relative z-10">
        <Nav />
        <Hero />
        <TechStrip />
        <Problem />
        <HowItWorks />
        <Features />
        <Stats />
        <Mission />
        <CTA />
        <Footer />
      </main>
    </>
  );
}
