import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ProblemSection from "@/components/ProblemSection";
import FrameworkSection from "@/components/FrameworkSection";
import DiagnosticSection from "@/components/DiagnosticSection";
import PhilosophySection from "@/components/PhilosophySection";
import ServicesSection from "@/components/ServicesSection";
import SocialProofSection from "@/components/SocialProofSection";
import FooterSection from "@/components/FooterSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <ProblemSection />
      <FrameworkSection />
      <DiagnosticSection />
      <PhilosophySection />
      <ServicesSection />
      <SocialProofSection />
      <FooterSection />
    </div>
  );
};

export default Index;
