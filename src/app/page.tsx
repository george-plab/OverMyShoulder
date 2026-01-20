import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ProblemSection from "@/components/ProblemSection";
import AboutSection from "@/components/AboutSection";
import PrivacySection from "@/components/PrivacySection";
import HowItWorksSection from "@/components/HowItWorksSection";
import ChatModesSection from "@/components/ChatModesSection";
import DisclaimerSection from "@/components/DisclaimerSection";
import FinalCTASection from "@/components/FinalCTASection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <Header />
      <HeroSection />
      <ProblemSection />
      <AboutSection />
      <PrivacySection />
      <HowItWorksSection />
      <ChatModesSection />
      <DisclaimerSection />
      <FinalCTASection />
      <Footer />
    </main>
  );
}
