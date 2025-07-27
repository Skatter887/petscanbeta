
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import HowItWorks from '@/components/HowItWorks';
import ProductExamples from '@/components/ProductExamples';
import AnalysisForm from '@/components/AnalysisForm';
import ProSection from '@/components/ProSection';
import FAQ from '@/components/FAQ';
import Footer from '@/components/Footer';
import ScrollToTop from '@/components/ScrollToTop';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <HeroSection />
      <HowItWorks />
      <ProductExamples />
      <AnalysisForm />
      <ProSection />
      <FAQ />
      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default Index;
