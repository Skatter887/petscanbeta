
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Brain, Shield, Heart, Zap, CheckCircle, Star, Users, TrendingUp, Award, ArrowRight, BookOpen, Microscope } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ScrollToTop from '@/components/ScrollToTop';
import { useNavigate } from 'react-router-dom';
import SEOHead from '@/components/SEOHead';

const ScopriPetScanPro = () => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Scopri PetScan - Come Yuka per animali",
    "description": "Scopri come PetScan utilizza l'intelligenza artificiale avanzata e studi scientifici peer-reviewed per analizzare l'alimentazione di cani e gatti, come Yuka ma per i nostri amici a 4 zampe.",
    "mainEntity": {
      "@type": "Service",
      "name": "PetScan - Analisi Alimentare con AI",
      "description": "Servizio di analisi dell'alimentazione per cani e gatti con intelligenza artificiale avanzata e studi scientifici",
      "provider": {
        "@type": "Organization",
        "name": "PetScan"
      }
    }
  };

  const navigate = useNavigate();
  const scrollToAnalysisForm = () => {
    navigate('/');
    setTimeout(() => {
      const element = document.getElementById('analisi-form');
      if (element) {
        element.scrollIntoView({
          behavior: 'smooth'
        });
      }
    }, 100);
  };

  const features = [{
    icon: Brain,
    title: "Intelligenza Artificiale Avanzata",
    description: "Utilizziamo algoritmi di AI di ultima generazione, addestrati su migliaia di formulazioni per animali, per analizzare ogni ingrediente e fornire valutazioni precise e personalizzate."
  }, {
    icon: BookOpen,
    title: "Studi Scientifici Peer-Reviewed",
    description: "Ogni valutazione è supportata da ricerche scientifiche pubblicate e revisionate dalla comunità accademica internazionale di veterinari e nutrizionisti."
  }, {
    icon: Shield,
    title: "Valutazioni Imparziali",
    description: "Nessuna pubblicità, nessun conflitto di interesse. Solo analisi oneste basate su evidenze scientifiche e intelligenza artificiale indipendente."
  }];

  const benefits = ["Analisi ingredienti tramite AI in tempo reale", "Consigli nutrizionali basati su studi peer-reviewed", "Identificazione allergeni supportata da ricerca scientifica", "Confronto tra prodotti con algoritmi avanzati", "Valutazione del rapporto qualità-prezzo basata su dati scientifici"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-orange-50">
      <SEOHead
        title="Scopri PetScan - Come Yuka per animali"
        description="Scopri come PetScan utilizza l'intelligenza artificiale avanzata e studi scientifici peer-reviewed per analizzare l'alimentazione di cani e gatti, come Yuka ma per i nostri amici a 4 zampe."
        structuredData={structuredData}
      />
      <Header />
      
      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="mb-8">
            <div className="inline-flex items-center space-x-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <Star className="w-4 h-4" />
              <span>Come Yuka, ma per i nostri amici a 4 zampe 🐾</span>
            </div>
          </div>
          
          <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
            <span style={{ color: '#1FC77C' }}>Pet</span>
            <span style={{ color: '#F5953B' }}>Scan</span>
            <span className="text-gray-900"> </span>
          </h1>
          
          <p className="text-xl lg:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            L'analisi più avanzata per l'alimentazione del tuo animale, powered by AI e studi scientifici peer-reviewed. 
            Come Yuka, ma specificamente progettato per cani e gatti.
          </p>

          {/* Enhanced AI & Scientific Sources Badge */}
          <div className="bg-gradient-to-r from-blue-50 via-purple-50 to-green-50 rounded-2xl p-4 sm:p-6 mx-auto max-w-4xl border border-blue-200/30 shadow-lg mb-8">
            <div className="flex items-center justify-center mb-3">
              <div className="flex items-center space-x-3">
                <Brain className="w-6 h-6 text-blue-600" />
                <BookOpen className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <p className="text-base sm:text-lg text-gray-700 leading-relaxed font-medium">
              Le valutazioni PetScan combinano il potenziale dell'<strong className="text-blue-700">intelligenza artificiale più avanzata</strong> con <strong className="text-purple-700">fonti scientifiche peer-reviewed</strong>, per fornire un'analisi oggettiva e aggiornata sulla qualità nutrizionale degli alimenti per cani e gatti.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button onClick={scrollToAnalysisForm} className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105">
              <Zap className="w-5 h-5 mr-2" />
              Prova Subito Gratis
            </Button>
          </div>
        </div>
      </section>

      {/* What is PetScan Pro */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">Cos'è PetScan?</h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto">
              La prima piattaforma italiana che combina <strong>intelligenza artificiale avanzata</strong> e <strong>studi scientifici peer-reviewed</strong> per analizzare la qualità nutrizionale degli alimenti per cani e gatti con precisione clinica.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center p-6 rounded-2xl bg-gradient-to-br from-gray-50 to-white border border-gray-100 hover:shadow-lg transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Use It */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">Perché scegliere PetScan?</h2>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <Users className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Per i proprietari di animali</h3>
                    <p className="text-gray-600">
                      Scopri se stai davvero dando il meglio al tuo amico a quattro zampe. 
                      La nostra AI analizza ingredienti e composizioni basandosi su evidenze scientifiche validate.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <TrendingUp className="w-6 h-6 text-orange-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Per i rivenditori</h3>
                    <p className="text-gray-600">
                      Distinguiti dalla concorrenza offrendo solo prodotti con qualità verificata scientificamente. 
                      Aumenta la fiducia dei tuoi clienti con analisi AI trasparenti.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Cosa ottieni con PetScan Pro:</h3>
              <ul className="space-y-3">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span className="text-gray-700">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
              Come funziona PetScan Pro
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Semplice, veloce e incredibilmente preciso grazie all'AI e alla ricerca scientifica
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[{
              step: "01",
              title: "Invia il prodotto",
              description: "Condividi nome del prodotto, foto dell'etichetta o scansiona il codice a barre"
            }, {
              step: "02",
              title: "Descrivi il tuo pet",
              description: "Fornisci dettagli su età, peso, razza e eventuali allergie o condizioni speciali"
            }, {
              step: "03",
              title: "Ricevi l'analisi AI",
              description: "Ottieni un report dettagliato con punteggio, consigli basati su studi peer-reviewed e alternative migliori"
            }].map((item, index) => (
              <div key={index} className="text-center relative">
                {index < 2 && (
                  <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-green-200 to-orange-200 z-0">
                    <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-orange-400 rounded-full"></div>
                  </div>
                )}
                
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-orange-400 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-xl font-bold">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What Makes It Different */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">In cosa è diverso PetScan</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="flex items-start space-x-4">
                <Microscope className="w-8 h-8 text-blue-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Ricerca Scientifica Rigorosa</h3>
                  <p className="text-gray-600">
                    Ogni valutazione è basata su studi peer-reviewed pubblicati su riviste scientifiche veterinarie internazionali. 
                    Zero opinioni, solo scienza verificata.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <Shield className="w-8 h-8 text-green-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Nessuna Pubblicità</h3>
                  <p className="text-gray-600">
                    Le nostre valutazioni AI sono completamente indipendenti. 
                    Non siamo influenzati da brand o sponsor, solo dalla scienza.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <Brain className="w-8 h-8 text-purple-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">AI Evoluta e Specializzata</h3>
                  <p className="text-gray-600">
                    Utilizziamo modelli di machine learning addestrati specificamente sulla nutrizione animale, 
                    con database di migliaia di ingredienti e loro interazioni.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-100 to-orange-100 rounded-2xl p-8">
              <div className="text-center">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Heart className="w-10 h-10 text-red-500" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Scienza + AI = Amore per gli animali
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  Ogni algoritmo è sviluppato pensando al benessere dei nostri amici a quattro zampe. 
                  Perché meritano solo il meglio, scientificamente provato.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 bg-gradient-to-r from-green-500 to-green-600">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            Vuoi scoprire se il tuo prodotto è all'altezza?
          </h2>
          <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
            Inviacelo con PetScan Pro e ricevi un'analisi AI completa, supportata da studi scientifici, in meno di 24 ore.
          </p>
          
          <Button onClick={scrollToAnalysisForm} className="bg-white text-green-600 hover:bg-gray-50 px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105">
            Inizia l'Analisi Gratuita
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
          
          <p className="text-green-100 text-sm mt-4">
            ✅ Completamente gratuito • ✅ Analisi AI + Studi Scientifici • ✅ Risultati in 24h • ✅ Nessuna registrazione richiesta
          </p>
        </div>
      </section>

      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default ScopriPetScanPro;
