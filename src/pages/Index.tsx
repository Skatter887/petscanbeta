
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import HowItWorks from '@/components/HowItWorks';
import ProductExamples from '@/components/ProductExamples';
import FAQ from '@/components/FAQ';
import Footer from '@/components/Footer';
import ScrollToTop from '@/components/ScrollToTop';

const Index = () => {
  return (
    <div className="min-h-screen pb-16 md:pb-0">
      <Header />
      <HeroSection />
      <HowItWorks />
      <ProductExamples />
      <FAQ />
      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default Index;
