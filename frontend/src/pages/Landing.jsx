import React from "react";
import Navbar from "@/components/landing/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import HowItWorks from "@/components/landing/HowItWorks";
import DashboardPreviewSection from "@/components/landing/DashboardPreviewSection";
import DarkPanel from "@/components/landing/DarkPanel";
import BenefitsSection from "@/components/landing/BenefitsSection";
import TestimonialsSection from "@/components/landing/TestimonialsSection";
import CTASection from "@/components/landing/CTASection";
import Footer from "@/components/landing/Footer";

export function Landing() {
  return (
    <div className="min-h-screen bg-bg text-ink flex flex-col font-sans overflow-x-hidden selection:bg-accent-soft selection:text-accent-strong">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <FeaturesSection />
        <HowItWorks />
        <DashboardPreviewSection />
        <DarkPanel />
        <BenefitsSection />
        <TestimonialsSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}

export default Landing;
