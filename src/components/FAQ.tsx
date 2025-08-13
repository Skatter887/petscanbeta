import { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle, Sparkles, Zap, Shield, Clock, Scale, Heart, Package, Lock, Smartphone } from 'lucide-react';
import ContactModal from './ContactModal';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  const faqs = [
    {
      question: "Come funziona l'analisi di PetScan?",
      answer: "Analizziamo ogni ingrediente del prodotto basandoci su studi veterinari e nutrizionali. Consideriamo l'età, peso, razza e condizioni di salute del tuo animale per fornire un punteggio personalizzato e consigli specifici.",
      category: "funzionamento",
      icon: Zap
    },
    {
      question: "È davvero gratuito?",
      answer: "Sì, durante la fase beta il servizio è completamente gratuito. Non chiediamo carte di credito o abbonamenti. Il nostro obiettivo è aiutare il maggior numero di animali possibile a vivere in salute.",
      category: "prezzo",
      icon: Heart
    },
    {
      question: "Quanto tempo serve per ricevere l'analisi?",
      answer: "Normalmente invii l'analisi entro 24 ore dalla richiesta. Per prodotti molto specifici o casi complessi potremmo impiegare fino a 48 ore per garantire la massima accuratezza.",
      category: "tempistiche",
      icon: Clock
    },
    {
      question: "Che differenza c'è tra PetScan e Yuka?",
      answer: "Mentre Yuka analizza prodotti per umani, PetScan è specializzato esclusivamente nell'alimentazione animale. Consideriamo le specifiche esigenze nutrizionali di cani e gatti, che sono molto diverse da quelle umane.",
      category: "confronto",
      icon: Scale
    },
    {
      question: "Posso fidarmi delle vostre analisi?",
      answer: "Le nostre analisi si basano su database veterinari accreditati e studi scientifici peer-reviewed. Tuttavia, raccomandiamo sempre di consultare il proprio veterinario per decisioni importanti sulla salute del proprio animale.",
      category: "affidabilità",
      icon: Shield
    },
    {
      question: "Analizzate anche snack e premi?",
      answer: "Sì, analizziamo qualsiasi tipo di cibo per animali: crocchette, umido, snack, premi, biscotti e integratori. Ogni categoria ha criteri di valutazione specifici.",
      category: "prodotti",
      icon: Package
    },
    {
      question: "Cosa succede ai miei dati personali?",
      answer: "I tuoi dati vengono utilizzati esclusivamente per fornirti l'analisi richiesta. Non li condividiamo con terze parti e puoi richiederne la cancellazione in qualsiasi momento scrivendo a privacy@petscan.it.",
      category: "privacy",
      icon: Lock
    },
    {
      question: "Avete un'app mobile?",
      answer: "Al momento il servizio è disponibile solo via web, ma stiamo sviluppando un'app mobile che includerà scanner del codice a barre e analisi istantanee. Iscriviti alla newsletter per essere aggiornato!",
      category: "mobile",
      icon: Smartphone
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const getCategoryGradient = (category: string) => {
    // Utilizziamo il gradiente caratteristico verde-arancione del progetto con variazioni
    const gradients = {
      funzionamento: 'from-primary via-green-500 to-secondary',
      prezzo: 'from-green-400 via-green-500 to-orange-400',
      tempistiche: 'from-orange-400 via-orange-500 to-green-400',
      confronto: 'from-secondary via-teal-500 to-primary',
      affidabilità: 'from-primary via-blue-500 to-green-500',
      prodotti: 'from-green-500 via-orange-400 to-orange-500',
      privacy: 'from-orange-500 via-red-400 to-orange-400',
      mobile: 'from-secondary via-green-500 to-primary'
    };
    return gradients[category as keyof typeof gradients] || 'from-primary to-secondary';
  };

  const getCategoryIconColor = (category: string) => {
    // Colori che si integrano con il design system
    const colors = {
      funzionamento: 'text-primary',
      prezzo: 'text-green-600',
      tempistiche: 'text-orange-600',
      confronto: 'text-secondary',
      affidabilità: 'text-primary',
      prodotti: 'text-green-600',
      privacy: 'text-orange-600',
      mobile: 'text-secondary'
    };
    return colors[category as keyof typeof colors] || 'text-primary';
  };

  return (
    <>
      <section id="faq" className="py-16 sm:py-24 px-4 relative overflow-hidden">
        {/* Background con gradiente caratteristico del progetto */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-50/40 via-orange-50/30 to-green-50/40"></div>
        
        {/* Decorative elements con il tema del progetto */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-green-200/20 to-orange-200/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-orange-200/20 to-green-200/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-to-br from-green-200/10 to-orange-200/10 rounded-full blur-2xl -translate-x-1/2 -translate-y-1/2"></div>
        
        {/* Floating paw prints decorations */}
        <div className="absolute top-20 right-20 opacity-10 animate-pulse">
          <div className="w-16 h-16 text-green-300">🐾</div>
        </div>
        <div className="absolute bottom-32 left-16 opacity-10 animate-pulse delay-1000">
          <div className="w-12 h-12 text-orange-300">🐾</div>
        </div>
        <div className="absolute top-1/3 right-1/4 opacity-5 animate-pulse delay-2000">
          <div className="w-20 h-20 text-green-300">🐾</div>
        </div>
        
        <div className="container mx-auto max-w-5xl relative z-10">
          <div className="text-center mb-16 sm:mb-20">
            {/* Badge moderno con il gradiente del progetto */}
            <div className="inline-flex items-center justify-center space-x-2 sm:space-x-3 bg-gradient-to-r from-green-100/80 via-orange-100/60 to-green-100/80 backdrop-blur-sm text-green-800 px-6 sm:px-8 py-3 sm:py-4 rounded-full text-sm sm:text-base font-bold mb-8 sm:mb-10 shadow-xl border border-green-200/50 hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <HelpCircle className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
              <span>Domande frequenti</span>
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600 animate-pulse" />
            </div>
            
            <h2 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-gray-900 mb-6 sm:mb-8 leading-tight tracking-tight">
              Tutto quello che <br />
              <span className="bg-gradient-to-r from-green-500 via-green-600 to-orange-500 bg-clip-text text-transparent">
                vuoi sapere
              </span>
            </h2>
            <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed font-medium">
              Scopri come PetScan può aiutarti a prenderti cura al meglio 
              dell'alimentazione del tuo amico a quattro zampe.
            </p>
          </div>

          <div className="space-y-6 sm:space-y-8">
            {faqs.map((faq, index) => {
              const IconComponent = faq.icon;
              return (
                <div 
                  key={index} 
                  className="group bg-white/90 backdrop-blur-md rounded-2xl sm:rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden border border-white/60 hover:bg-white/95 relative"
                >
                  {/* Gradient border indicator */}
                  <div className={`h-2 bg-gradient-to-r ${getCategoryGradient(faq.category)} relative overflow-hidden`}>
                    {/* Shimmer effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>
                  </div>
                  
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="w-full px-6 sm:px-8 py-6 sm:py-8 text-left flex items-center justify-between hover:bg-gradient-to-r hover:from-green-50/50 hover:to-orange-50/50 transition-all duration-300 group-hover:px-7 sm:group-hover:px-10"
                  >
                    <div className="flex items-center space-x-4 sm:space-x-6 flex-1 min-w-0">
                      {/* Modern icon with gradient background */}
                      <div className={`w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br ${getCategoryGradient(faq.category)} rounded-2xl sm:rounded-3xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 flex-shrink-0 relative overflow-hidden`}>
                        {/* Glow effect */}
                        <div className="absolute -inset-1 bg-gradient-to-br from-white/20 to-white/5 rounded-2xl sm:rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <IconComponent className="w-6 h-6 sm:w-7 sm:h-7 text-white relative z-10" />
                      </div>
                      
                      <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 pr-2 sm:pr-4 group-hover:text-green-700 transition-colors duration-300 leading-snug">
                        {faq.question}
                      </h3>
                    </div>
                    
                    <div className="flex-shrink-0 ml-4 sm:ml-6">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-100 to-orange-100 rounded-xl flex items-center justify-center group-hover:scale-110 group-hover:bg-gradient-to-br group-hover:from-green-200 group-hover:to-orange-200 transition-all duration-300">
                        {openIndex === index ? (
                          <ChevronUp className="w-6 h-6 sm:w-7 sm:h-7 text-green-600 transition-transform duration-300" />
                        ) : (
                          <ChevronDown className="w-6 h-6 sm:w-7 sm:h-7 text-gray-500 group-hover:text-green-600 transition-all duration-300" />
                        )}
                      </div>
                    </div>
                  </button>
                
                  {openIndex === index && (
                    <div className="px-6 sm:px-8 pb-6 sm:pb-8 animate-accordion-down">
                      <div className="border-t border-gradient-to-r from-green-100/50 to-orange-100/50 pt-6 sm:pt-8">
                        {/* Enhanced answer container with modern design */}
                        <div className={`bg-gradient-to-br from-green-50/80 via-white/90 to-orange-50/80 rounded-2xl sm:rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-lg backdrop-blur-sm border border-white/50`}>
                          {/* Decorative gradient accent */}
                          <div className={`absolute top-0 left-0 w-2 h-full bg-gradient-to-b ${getCategoryGradient(faq.category)} rounded-l-2xl sm:rounded-l-3xl`}></div>
                          
                          {/* Subtle floating icon */}
                          <div className="absolute top-4 right-4 opacity-10">
                            <IconComponent className="w-8 h-8 text-green-600" />
                          </div>
                          
                          <div className="relative pl-4">
                            <p className="text-gray-800 leading-relaxed text-base sm:text-lg lg:text-xl font-medium">
                              {faq.answer}
                            </p>
                          </div>
                          
                          {/* Subtle pattern overlay */}
                          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent pointer-events-none"></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Enhanced bottom CTA with project style */}
          <div className="text-center mt-16 sm:mt-20">
            <div className="bg-gradient-to-br from-green-600 via-green-500 to-orange-500 rounded-3xl sm:rounded-[2rem] p-8 sm:p-12 text-white shadow-2xl relative overflow-hidden backdrop-blur-sm">
              {/* Enhanced decorative elements */}
              <div className="absolute top-0 left-0 w-full h-full">
                <div className="absolute top-6 left-6 w-4 h-4 bg-white/20 rounded-full animate-pulse"></div>
                <div className="absolute top-12 right-12 w-3 h-3 bg-orange-300/30 rounded-full animate-pulse delay-300"></div>
                <div className="absolute bottom-8 left-16 w-5 h-5 bg-white/15 rounded-full animate-pulse delay-700"></div>
                <div className="absolute bottom-12 right-8 w-2 h-2 bg-orange-300/40 rounded-full animate-pulse delay-1000"></div>
                
                {/* Floating paw prints */}
                <div className="absolute top-8 right-20 opacity-20 animate-pulse delay-500">
                  <div className="text-2xl">🐾</div>
                </div>
                <div className="absolute bottom-16 left-8 opacity-15 animate-pulse delay-1500">
                  <div className="text-xl">🐾</div>
                </div>
              </div>
              
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent"></div>
              
              <div className="relative z-10">
                <div className="mb-6 sm:mb-8">
                  <div className="text-5xl sm:text-6xl mb-4">💬</div>
                </div>
                
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold mb-4 sm:mb-6 tracking-tight">
                  Non hai trovato la risposta che cercavi?
                </h3>
                <p className="text-lg sm:text-xl lg:text-2xl opacity-95 mb-6 sm:mb-8 font-medium leading-relaxed max-w-2xl mx-auto">
                  Contattaci direttamente e ti risponderemo il prima possibile!
                </p>
                <button 
                  onClick={() => setIsContactModalOpen(true)}
                  className="group relative bg-white text-green-600 hover:bg-gray-50 px-8 sm:px-12 py-4 sm:py-6 rounded-full font-bold text-lg sm:text-xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:-translate-y-1 border border-white/20"
                >
                  {/* Button glow effect */}
                  <div className="absolute -inset-1 bg-white/20 rounded-full blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
                  
                  <div className="flex items-center justify-center space-x-3">
                    <HelpCircle className="w-6 h-6 sm:w-7 sm:h-7 group-hover:rotate-12 transition-transform duration-300" />
                    <span>Contattaci</span>
                    <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 group-hover:animate-pulse" />
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ContactModal 
        isOpen={isContactModalOpen} 
        onClose={() => setIsContactModalOpen(false)} 
      />

      {/* Custom CSS animations for enhanced effects */}
      <style>{`
        @keyframes accordion-down {
          from {
            height: 0;
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            height: auto;
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-accordion-down {
          animation: accordion-down 0.4s ease-out forwards;
        }

        @keyframes shimmer-gradient {
          0% {
            transform: translateX(-100%) skewX(-12deg);
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
          100% {
            transform: translateX(200%) skewX(-12deg);
            opacity: 0;
          }
        }

        .animate-shimmer-gradient {
          animation: shimmer-gradient 2s ease-out infinite;
        }

        @keyframes float-gentle {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-8px) rotate(2deg);
          }
        }

        .animate-float-gentle {
          animation: float-gentle 4s ease-in-out infinite;
        }

        @keyframes pulse-glow {
          0%, 100% {
            box-shadow: 0 0 20px rgba(34, 197, 94, 0.2), 0 0 40px rgba(251, 146, 60, 0.1);
          }
          50% {
            box-shadow: 0 0 30px rgba(34, 197, 94, 0.4), 0 0 60px rgba(251, 146, 60, 0.2);
          }
        }

        .animate-pulse-glow {
          animation: pulse-glow 3s ease-in-out infinite;
        }

        /* Enhanced hover effects */
        .faq-card:hover {
          transform: translateY(-4px) scale(1.01);
        }

        .faq-icon:hover {
          transform: scale(1.15) rotate(5deg);
        }

        /* Glassmorphism effect enhancement */
        .glass-enhanced {
          backdrop-filter: blur(20px);
          background: rgba(255, 255, 255, 0.85);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        /* Custom scrollbar for better UX */
        .faq-container::-webkit-scrollbar {
          width: 6px;
        }

        .faq-container::-webkit-scrollbar-track {
          background: transparent;
        }

        .faq-container::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #22c55e, #fb923c);
          border-radius: 3px;
        }

        .faq-container::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #16a34a, #f97316);
        }
      `}</style>
    </>
  );
};

export default FAQ;
