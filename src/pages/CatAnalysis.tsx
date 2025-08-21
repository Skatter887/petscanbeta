import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Instagram, Home, User, Award, Lightbulb, Mail, CheckSquare, Cat, Share2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import SEOHead from '@/components/SEOHead';

const CatAnalysis = () => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "AnalysisPage",
    "name": "Analisi Cibo per Gatti - PetScan",
    "description": "Analisi completa e personalizzata del cibo per gatti con PetScan. Scopri se l'alimentazione del tuo gatto è sana e bilanciata.",
    "mainEntity": {
      "@type": "Service",
      "name": "Analisi Alimentare per Gatti",
      "description": "Servizio di analisi dell'alimentazione per gatti con intelligenza artificiale",
      "provider": {
        "@type": "Organization",
        "name": "PetScan"
      }
    }
  };

  const [activeSection, setActiveSection] = useState('');
  const [showShareMenu, setShowShareMenu] = useState(false);

  const shareOnWhatsApp = () => {
    const url = window.location.href;
    const text = "Guarda l'analisi PetScan del cibo del mio gatto!";
    window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`, '_blank');
    setShowShareMenu(false);
  };

  const shareOnInstagram = () => {
    // Copy link to clipboard for Instagram sharing
    navigator.clipboard.writeText(window.location.href);
    alert('Link copiato! Incollalo nella tua storia Instagram');
    setShowShareMenu(false);
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      setActiveSection(sectionId);
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      
      // Add animation class to the section
      setTimeout(() => {
        element.classList.add('animate-section-appear');
      }, 100);
    }
  };

  const navigateToHome = () => {
    window.location.href = '/';
  };

  const navigateToFAQ = () => {
    window.location.href = '/#faq';
  };

  const navigateToHowItWorks = () => {
    window.location.href = '/#come-funziona';
  };

  const openContactModal = () => {
    // This would trigger the same contact modal as homepage
    window.location.href = '/#contatti';
  };

  useEffect(() => {
    // Add fade-in animation on load
    const cards = document.querySelectorAll('.analysis-card');
    cards.forEach((card, index) => {
      setTimeout(() => {
        card.classList.add('animate-fade-in');
      }, index * 200);
    });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-orange-50 pb-24">
      <SEOHead
        title="Analisi Cibo per Gatti - PetScan"
        description="Analisi completa e personalizzata del cibo per gatti con PetScan. Scopri se l'alimentazione del tuo gatto è sana e bilanciata."
        structuredData={structuredData}
      />
      <Header />
      
      {/* HERO SECTION */}
      <section className="pt-8 pb-12 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Analisi Completa del Cibo per <span style={{ color: '#1FC77C' }}>Gatti</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Risultato personalizzato dell'analisi PetScan
          </p>
          
          {/* Sharing Icons */}
          <div className="flex justify-center gap-4 mb-8">
            <button 
              onClick={shareOnWhatsApp}
              className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-full font-semibold transition-all transform hover:scale-105 active:scale-95"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.531 3.542"/>
              </svg>
              Condividi su WhatsApp
            </button>
            <button 
              onClick={() => window.open('https://instagram.com', '_blank')}
              className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-3 rounded-full font-semibold transition-all transform hover:scale-105 active:scale-95"
            >
              <Instagram className="w-5 h-5" />
              Instagram
            </button>
          </div>
        </div>
      </section>

      {/* SEZIONE VALUTAZIONE PRODOTTO */}
      <section id="evaluation" className="py-8 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="analysis-card bg-white rounded-3xl shadow-lg p-6 border border-gray-100 opacity-0 transition-all duration-500">
            {/* Sezione valutazione */}
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              🥫 Valutazione del Prodotto
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8 items-center">
              {/* Product Image and Info */}
              <div className="text-center">
                {/* Food Emoji - Replaces score square */}
                <div className="text-6xl mb-4">🍽️</div>
                
                <div className="w-32 h-32 mx-auto bg-gradient-to-br from-orange-400 to-orange-600 rounded-3xl flex items-center justify-center mb-4">
                  <img 
                    src="/lovable-uploads/a09fc66a-01b1-4abb-997a-e4e2650e9048.png" 
                    alt="Prodotto per gatti" 
                    className="w-24 h-24 object-cover rounded-2xl"
                  />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Royal Canin Indoor</h3>
                <p className="text-gray-600 mb-4">Gatti d'appartamento, 2kg</p>
                <div className="inline-block bg-orange-100 border border-orange-300 px-4 py-2 rounded-full">
                  <span className="text-orange-700 font-semibold">🐱 Specifico per gatti</span>
                </div>
              </div>

              {/* Score and Details */}
              <div>
                <div className="text-center mb-6">
                  <div className="w-24 h-24 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl flex flex-col items-center justify-center text-white font-bold mx-auto mb-4">
                    <span className="text-3xl">75</span>
                    <span className="text-sm">/100</span>
                  </div>
                  <div className="bg-orange-100 border border-orange-300 px-4 py-2 rounded-full inline-block">
                    <span className="text-orange-700 font-semibold">Moderato</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl border border-green-200">
                    <span className="font-semibold text-gray-900">✅ Proteine</span>
                    <span className="text-green-600 font-semibold">Ottimo</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-orange-50 rounded-xl border border-orange-200">
                    <span className="font-semibold text-gray-900">⚠️ Conservanti</span>
                    <span className="text-orange-600 font-semibold">Moderato</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl border border-green-200">
                    <span className="font-semibold text-gray-900">🌾 Cereali</span>
                    <span className="text-green-600 font-semibold">Adatto</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 p-6 bg-orange-50 rounded-2xl border border-orange-200">
              <h4 className="font-bold text-gray-900 mb-3">📋 Punti chiave dell'analisi:</h4>
              <ul className="space-y-2 text-gray-700">
                <li>✅ Buon contenuto proteico per gatti d'appartamento</li>
                <li>⚠️ Presenza di conservanti artificiali</li>
                <li>✅ Formula specifica per il controllo dei boli di pelo</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* SEZIONE PROFILO ANIMALE */}
      <section id="profile" className="py-8 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="analysis-card bg-white rounded-3xl shadow-lg p-6 border border-gray-100 opacity-0 transition-all duration-500">
            {/* Sezione profilo animale */}
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              🐱 Profilo del Gatto
            </h2>
            
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4">
                🐱
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Micia</h3>
              <p className="text-gray-600">Gatta domestica adorabile</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">📅</span>
                    <div>
                      <div className="font-semibold text-gray-900">Età</div>
                      <div className="text-gray-600">3 anni</div>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🏠</span>
                    <div>
                      <div className="font-semibold text-gray-900">Stile di vita</div>
                      <div className="text-gray-600">Gatta d'appartamento</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">⚕️</span>
                    <div>
                      <div className="font-semibold text-gray-900">Condizioni</div>
                      <div className="text-gray-600">Sterilizzata, boli di pelo</div>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">⚖️</span>
                    <div>
                      <div className="font-semibold text-gray-900">Peso</div>
                      <div className="text-gray-600">4.2 kg</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3 justify-center">
              <span className="bg-green-100 border border-green-300 text-green-700 px-4 py-2 rounded-full font-semibold">🏠 Indoor</span>
              <span className="bg-blue-100 border border-blue-300 text-blue-700 px-4 py-2 rounded-full font-semibold">♀ Sterilizzata</span>
              <span className="bg-orange-100 border border-orange-300 text-orange-700 px-4 py-2 rounded-full font-semibold">🧶 Boli di pelo</span>
            </div>
          </div>
        </div>
      </section>

      {/* SEZIONE RACCOMANDAZIONI */}
      <section id="recommendations" className="py-8 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="analysis-card bg-white rounded-3xl shadow-lg p-6 border border-gray-100 opacity-0 transition-all duration-500">
            {/* Sezione raccomandazioni */}
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              💡 Raccomandazioni PetScan
            </h2>
            
            <div className="space-y-6">
              {/* Suggerimenti nutrizionali */}
              <div className="p-6 bg-green-50 rounded-2xl border border-green-200">
                <h3 className="text-xl font-bold text-gray-900 mb-4">🍽️ Suggerimenti Nutrizionali</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>✅ Il prodotto è adatto per gatti d'appartamento sterilizzati</li>
                  <li>💡 Considera l'integrazione con cibo umido per l'idratazione</li>
                  <li>⚠️ Monitora il peso per evitare sovrappeso post-sterilizzazione</li>
                  <li>🧶 La formula aiuta con i boli di pelo, ottimo per Micia</li>
                </ul>
              </div>

              {/* Prodotti alternativi */}
              <div id="products">
                <h3 className="text-xl font-bold text-gray-900 mb-4">🔄 Prodotti Alternativi Consigliati</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 border border-gray-200 rounded-xl hover:shadow-lg transition-shadow">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex flex-col items-center justify-center text-white font-bold text-sm">
                        <span>88</span>
                        <span className="text-xs">/100</span>
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">Hill's Indoor Cat</div>
                        <div className="text-sm text-gray-600">Punteggio: 88/100</div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">Formula naturale senza conservanti artificiali</p>
                  </div>
                  
                  <div className="p-4 border border-gray-200 rounded-xl hover:shadow-lg transition-shadow">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex flex-col items-center justify-center text-white font-bold text-sm">
                        <span>85</span>
                        <span className="text-xs">/100</span>
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">Purina Pro Plan Indoor</div>
                        <div className="text-sm text-gray-600">Punteggio: 85/100</div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">Eccellente controllo boli di pelo</p>
                  </div>
                </div>
              </div>

              {/* CTA finale */}
              <div id="contact" className="text-center p-6 bg-gradient-to-r from-green-50 to-orange-50 rounded-2xl border border-green-200">
                <h3 className="text-xl font-bold text-gray-900 mb-3">🎯 Vuoi una guida personalizzata?</h3>
                <p className="text-gray-600 mb-4">
                  I nostri esperti possono fornirti consigli specifici per Micia
                </p>
                <button 
                  onClick={openContactModal}
                  className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all transform hover:scale-105 active:scale-95"
                >
                  Contattaci per una consulenza
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SHARE MENU OVERLAY */}
      {showShareMenu && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-60 flex items-end">
          <div className="bg-white w-full rounded-t-3xl p-6 transform transition-transform duration-300 ease-out">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-1 bg-gray-300 rounded-full"></div>
            </div>
            <h3 className="text-xl font-bold text-center mb-6">Condividi Analisi</h3>
            <div className="space-y-4">
              <button 
                onClick={shareOnWhatsApp}
                className="w-full flex items-center gap-4 p-4 bg-green-50 hover:bg-green-100 rounded-2xl transition-colors"
              >
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.531 3.542"/>
                  </svg>
                </div>
                <span className="font-semibold text-gray-900">Condividi su WhatsApp</span>
              </button>
              <button 
                onClick={shareOnInstagram}
                className="w-full flex items-center gap-4 p-4 bg-purple-50 hover:bg-purple-100 rounded-2xl transition-colors"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <Instagram className="w-6 h-6 text-white" />
                </div>
                <span className="font-semibold text-gray-900">Condividi su Instagram</span>
              </button>
            </div>
            <button 
              onClick={() => setShowShareMenu(false)}
              className="w-full mt-6 p-4 bg-gray-100 hover:bg-gray-200 rounded-2xl font-semibold text-gray-700 transition-colors"
            >
              Annulla
            </button>
          </div>
        </div>
      )}

      {/* NUOVO FOOTER DINAMICO CON 4 ICONE */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3 z-50">
        <div className="flex justify-center items-center gap-8 max-w-md mx-auto">
          {/* 1. Checklist/Valutazione */}
          <button 
            onClick={() => scrollToSection('evaluation')}
            className={`flex flex-col items-center justify-center w-14 h-14 rounded-full transition-all transform hover:scale-110 active:scale-95 ${
              activeSection === 'evaluation' 
                ? 'bg-green-500 shadow-lg' 
                : 'bg-green-100 hover:bg-green-200'
            }`}
            aria-label="Valutazione"
          >
            <CheckSquare className={`w-7 h-7 ${
              activeSection === 'evaluation' ? 'text-white' : 'text-green-600'
            }`} />
          </button>
          
          {/* 2. Profilo Gatto */}
          <button 
            onClick={() => scrollToSection('profile')}
            className={`flex flex-col items-center justify-center w-14 h-14 rounded-full transition-all transform hover:scale-110 active:scale-95 ${
              activeSection === 'profile' 
                ? 'bg-orange-500 shadow-lg' 
                : 'bg-orange-100 hover:bg-orange-200'
            }`}
            aria-label="Profilo"
          >
            <Cat className={`w-7 h-7 ${
              activeSection === 'profile' ? 'text-white' : 'text-orange-600'
            }`} />
          </button>
          
          {/* 3. Logo PetScan */}
          <button 
            onClick={navigateToHome}
            className="flex flex-col items-center justify-center w-14 h-14 rounded-full bg-blue-100 hover:bg-blue-200 transition-all transform hover:scale-110 active:scale-95"
            aria-label="Homepage"
          >
            <div className="w-8 h-8 rounded-lg flex items-center justify-center">
              <img 
                src="/lovable-uploads/a33f1742-394c-45a9-8f25-eb7357254f92.png" 
                alt="PetScan Logo" 
                className="w-full h-full object-contain"
              />
            </div>
          </button>
          
          {/* 4. Condivisione */}
          <button 
            onClick={() => setShowShareMenu(true)}
            className="flex flex-col items-center justify-center w-14 h-14 rounded-full bg-purple-100 hover:bg-purple-200 transition-all transform hover:scale-110 active:scale-95"
            aria-label="Condividi"
          >
            <Share2 className="w-7 h-7 text-purple-600" />
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CatAnalysis;
