import HeroSlider from "./components/HeroSlider";
import HowItWorks from "./components/HowItWorks";
import AssetsPreview from "./components/AssetPreview";
import ShariahSection from "./components/ShariahSection";
import About from "./components//About";

export default function Home() {
  return (
    <div className="flex flex-col">
      <HeroSlider />
      <HowItWorks />
      <AssetsPreview />
      <ShariahSection />
      <About />
    </div>
  );
}
