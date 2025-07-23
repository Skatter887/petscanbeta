
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Heart, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';

const AboutUs = () => {
  const handleContactClick = () => {
    window.location.href = 'mailto:alessandro@mypetscan.it';
  };

  const scrollToSection = (sectionId: string) => {
    // Navigate to home page first, then scroll to section
    window.location.href = '/#' + sectionId;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-orange-50">
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
    </div>
  );
};

export default AboutUs;
