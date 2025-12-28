import Navbar from "../components/public/Navbar";
import HeroSlider from "../components/public/HeroSlider";
import HowItWorks from "../components/public/HowItWorks";
import AssetsPreview from "../components/public/AssetPreview";
import ShariahSection from "../components/public/ShariahSection";
import About from "../components/public/About";
import Footer from "../components/public/Footer";
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
