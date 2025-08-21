
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import HowItWorks from '@/components/HowItWorks';
import ProductExamples from '@/components/ProductExamples';
import FAQ from '@/components/FAQ';
import Footer from '@/components/Footer';
import ScrollToTop from '@/components/ScrollToTop';
import SEOHead from '@/components/SEOHead';

const Index = () => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "PetScan",
    "url": "https://mypetscan.it",
    "description": "Il primo servizio in Italia per analizzare l'alimentazione di cani e gatti con intelligenza artificiale",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://mypetscan.it/#analisi-form",
      "query-input": "required name=search_term_string"
    },
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "EUR",
      "description": "Analisi gratuita dell'alimentazione per cani e gatti"
    }
  };

  return (
    <div className="min-h-screen pb-16 md:pb-0">
      <SEOHead
        title="PetScan - Analisi alimentazione cani e gatti | Come Yuka per animali"
        description="PetScan è il primo servizio in Italia per analizzare l'alimentazione di cani e gatti. Scopri se il cibo che dai è sano, sicuro e adatto al tuo animale. Come Yuka, ma per i tuoi amici a quattro zampe. Analisi gratuita con intelligenza artificiale avanzata."
        keywords="alimentazione cani, alimentazione gatti, analisi cibo animali, Yuka animali, pet food, cibo sano cani gatti, valutazione ingredienti, PetScan Pro, intelligenza artificiale"
        canonicalUrl="https://mypetscan.it"
        structuredData={structuredData}
      />
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
