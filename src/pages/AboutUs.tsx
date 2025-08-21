
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Heart, Mail, ArrowUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useLayoutEffect, useState } from 'react';
import SEOHead from '@/components/SEOHead';

const AboutUs = () => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "PetScan",
    "description": "Servizio di analisi dell'alimentazione per cani e gatti con intelligenza artificiale",
    "url": "https://mypetscan.it",
    "founder": {
      "@type": "Person",
      "name": "Alessandro Rizzola",
      "email": "alessandro@mypetscan.it"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "email": "alessandro@mypetscan.it",
      "contactType": "customer service"
    }
  };

  const navigate = useNavigate();
  const location = useLocation();
  const [showScrollTop, setShowScrollTop] = useState(false);
  
  // Use useLayoutEffect for immediate execution before paint
  useLayoutEffect(() => {
    // Force scroll to top immediately
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, []);
  
  // Ensure page scrolls to top when component mounts
  useEffect(() => {
    const forceScrollToTop = () => {
      // Multiple scroll methods
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      
      // Try to scroll any scrollable containers
      const scrollableElements = document.querySelectorAll('[data-scrollable], main, .scrollable');
      scrollableElements.forEach(element => {
        if (element instanceof HTMLElement) {
          element.scrollTop = 0;
        }
      });
    };
    
    // Execute immediately
    forceScrollToTop();
    
    // Execute multiple times with different delays
    setTimeout(forceScrollToTop, 10);
    setTimeout(forceScrollToTop, 50);
    setTimeout(forceScrollToTop, 100);
    setTimeout(forceScrollToTop, 200);
    setTimeout(forceScrollToTop, 500);
    
    // Final attempts
    setTimeout(forceScrollToTop, 1000);
    setTimeout(forceScrollToTop, 2000);
    
    // Show scroll to top button if needed
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 100);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const handleContactClick = () => {
    window.location.href = 'mailto:alessandro@mypetscan.it';
  };

  const scrollToSection = (sectionId: string) => {
    // Navigate to home page first, then scroll to section
    navigate('/');
    setTimeout(() => {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-orange-50">
      <SEOHead
        title="Chi siamo - PetScan"
        description="Scopri chi siamo dietro PetScan, il servizio di analisi dell'alimentazione per cani e gatti con intelligenza artificiale."
        keywords="chi siamo, petscan, analisi alimentare, intelligenza artificiale, cani, gatti"
        structuredData={structuredData}
      />
      <Header />
      
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section with Title */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4 flex items-center justify-center gap-3">
              Chi c'è dietro 
              <Heart className="w-8 h-8 md:w-10 md:h-10 text-red-500" fill="currentColor" />
            </h1>
          </div>

          {/* Main Content */}
          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            {/* Image Section */}
            <div className="order-2 md:order-1">
              <div className="rounded-2xl overflow-hidden shadow-xl bg-white p-4">
                <img 
                  src="/lovable-uploads/a66b2805-b1e2-4e18-bd6a-0c6c662aa8a0.png" 
                  alt="Alessandro con il suo cane e gatto mentre scannerizza cibo al supermercato" 
                  className="w-full h-auto rounded-xl object-cover"
                />
              </div>
            </div>

            {/* Text Content */}
            <div className="order-1 md:order-2 space-y-6">
              <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-green-100">
                <p className="text-xl md:text-2xl font-semibold text-gray-800 mb-4">
                  🥣 <strong>PetScan nasce da una semplice domanda:</strong>
                </p>
                <p className="text-lg text-gray-700 italic mb-6">
                  "Il cibo che sto dando al mio gatto è davvero sano?"
                </p>
                
                <div className="space-y-4 text-gray-700">
                  <p>
                    Io sono <strong className="text-green-600">Alessandro</strong>, appassionato di benessere animale e tecnologia.
                  </p>
                  <p>
                    Dopo aver affrontato dubbi, letture di etichette e consulti per il mio gatto, ho deciso di costruire uno strumento che potesse aiutare altri pet parent come me.
                  </p>
                  <p>
                    Con PetScan vogliamo rendere <strong className="text-green-600">più facile, veloce e chiaro</strong> capire cosa stiamo davvero dando da mangiare ai nostri amici a quattro zampe.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Mission Section */}
          <div className="bg-gradient-to-r from-green-100/50 to-orange-100/50 backdrop-blur-sm rounded-2xl p-8 mb-12 border border-green-200/50">
            <div className="space-y-6 text-gray-700">
              <p className="text-lg">
                🔍 Analizziamo gli ingredienti, il profilo dell'animale e offriamo una valutazione semplice, trasparente e imparziale.
              </p>
              <p className="text-lg">
                Nessuna pubblicità, nessuna sponsorizzazione. Solo <strong className="text-green-600">informazione di valore</strong>.
              </p>
              <p className="text-lg">
                📈 Siamo ancora all'inizio, ma ogni giorno lavoriamo per migliorare.
              </p>
              <p className="text-lg">
                Perché se loro dipendono da noi, noi possiamo dipendere dalla buona informazione.
              </p>
            </div>
          </div>

          {/* Navigation Section */}
          <div className="text-center mb-8">
            <p className="text-gray-600 mb-6">
              Vuoi vedere come analizziamo i prodotti? Scopri i nostri esempi!
            </p>
            <button 
              onClick={() => scrollToSection('prodotti')}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-200 mr-4"
            >
              Vedi Esempi
            </button>
          </div>

          {/* Signature Section */}
          <div className="text-center bg-white/80 backdrop-blur-sm rounded-xl p-8 shadow-lg border border-orange-200">
            <p className="text-xl mb-4">
              🐾 Grazie per la fiducia.
            </p>
            <p className="text-lg font-semibold text-gray-800 mb-2">
              <strong>Alessandro – Fondatore PetScan</strong>
            </p>
            <p className="text-lg text-green-600 font-medium mb-6">
              <strong>PetScan – Come Yuka, ma per i tuoi animali</strong>
            </p>
            
            <Button 
              onClick={handleContactClick}
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Mail className="w-5 h-5 mr-2" />
              Contattaci direttamente
            </Button>
          </div>
        </div>
      </main>

      <Footer />
      
      {/* Floating Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={handleScrollToTop}
          className="fixed bottom-24 right-6 z-50 bg-green-500 hover:bg-green-600 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 md:hidden"
          aria-label="Torna in cima"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};

export default AboutUs;
