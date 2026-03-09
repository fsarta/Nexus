import Link from "next/link";
import { HeroSection } from "@/components/landing/HeroSection";
import { FeaturesGrid } from "@/components/landing/FeaturesGrid";
import { StatsBar } from "@/components/landing/StatsBar";
import { CTASection } from "@/components/landing/CTASection";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        <HeroSection />
        <StatsBar />
        <FeaturesGrid />
        <CTASection />
      </main>

      <Footer />
    </div>
  );
}
