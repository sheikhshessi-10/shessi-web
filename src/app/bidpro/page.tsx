import { Nav } from "./_components/Nav";
import { Hero } from "./_components/Hero";
import { Sources } from "./_components/Sources";
import { Problem } from "./_components/Problem";
import { Features } from "./_components/Features";
import { HowItWorks } from "./_components/HowItWorks";
import { Personalize } from "./_components/Personalize";
import { Stats } from "./_components/Stats";
import { Market } from "./_components/Market";
import { Mission } from "./_components/Mission";
import { CTA } from "./_components/CTA";
import { Footer } from "./_components/Footer";

export default function BidProPage() {
  return (
    <main className="relative">
      <Nav />
      <Hero />
      <Sources />
      <Problem />
      <Features />
      <HowItWorks />
      <Personalize />
      <Stats />
      <Market />
      <Mission />
      <CTA />
      <Footer />
    </main>
  );
}
