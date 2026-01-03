"use client";

import CanvasRoot from "@/components/canvas/CanvasRoot";
import HeroSection from "@/components/sections/HeroSection";
import ProductsSection from "@/components/sections/ProductsSection";
import CustomStudioSection from "@/components/sections/CustomStudioSection";
import QualitySection from "@/components/sections/QualitySection";
import FinalCTASection from "@/components/sections/FinalCTASection";

export default function Home() {
  return (
    <>
      <CanvasRoot />
      <main>
        <HeroSection />
        <ProductsSection />
        <CustomStudioSection />
        <QualitySection />
        <FinalCTASection />
      </main>
    </>
  );
}