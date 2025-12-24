import Navbar from "@/app/components/Navbar";
import HeroSlider from "@/app/components/HeroSlider";
import HowItWorks from "@/app/components/HowItWorks";
import AssetPreview from "@/app/components/AssetPreview";
import ShariahSection from "@/app/components/ShariahSection";
import About from "@/app/components/About";
import Footer from "@/app/components/Footer";

export default function Home() {
  return (
    <div className="flex flex-col">
      <HeroSlider />
      <HowItWorks />
      <AssetPreview />
      <ShariahSection />
      <About />
    </div>
  );
}
