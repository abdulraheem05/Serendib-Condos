import AnnouncementBar from "@/components/AnnouncementBar";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ConceptSection from "@/components/ConceptSection";
import ImageStorySection from "@/components/ImageStorySection";
import EditorialSection from "@/components/EditorialSection";
import PropertyExplorer from "@/components/PropertyExplorer";
import HowItWorks from "@/components/HowItWorks";
import ConsultationSection from "@/components/ConsultationSection";
import Footer from "@/components/Footer";

export default function HomePage() {
  return (
    <>
      <AnnouncementBar />
      <Header />
      <main>
        <HeroSection />
        <ConceptSection />
        <ImageStorySection />
        <EditorialSection />
        <PropertyExplorer />
        <HowItWorks />
        <ConsultationSection />
      </main>
      <Footer />
    </>
  );
}
