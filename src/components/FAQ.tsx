import { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle, Sparkles } from 'lucide-react';
import ContactModal from './ContactModal';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  const faqs = [
    {
      question: "Come funziona l'analisi di PetScan?",
      answer: "Analizziamo ogni ingrediente del prodotto basandoci su studi veterinari e nutrizionali. Consideriamo l'età, peso, razza e condizioni di salute del tuo animale per fornire un punteggio personalizzato e consigli specifici.",
      category: "funzionamento"
    },
    {
      question: "È davvero gratuito?",
      answer: "Sì, durante la fase beta il servizio è completamente gratuito. Non chiediamo carte di credito o abbonamenti. Il nostro obiettivo è aiutare il maggior numero di animali possibile a vivere in salute.",
      category: "prezzo"
    },
    {
      question: "Quanto tempo serve per ricevere l'analisi?",
      answer: "Normalmente invii l'analisi entro 24 ore dalla richiesta. Per prodotti molto specifici o casi complessi potremmo impiegare fino a 48 ore per garantire la massima accuratezza.",
      category: "tempistiche"
    },
    {
      question: "Che differenza c'è tra PetScan e Yuka?",
      answer: "Mentre Yuka analizza prodotti per umani, PetScan è specializzato esclusivamente nell'alimentazione animale. Consideriamo le specifiche esigenze nutrizionali di cani e gatti, che sono molto diverse da quelle umane.",
      category: "confronto"
    },
    {
      question: "Posso fidarmi delle vostre analisi?",
      answer: "Le nostre analisi si basano su database veterinari accreditati e studi scientifici peer-reviewed. Tuttavia, raccomandiamo sempre di consultare il proprio veterinario per decisioni importanti sulla salute del proprio animale.",
      category: "affidabilità"
    },
    {
      question: "Analizzate anche snack e premi?",
      answer: "Sì, analizziamo qualsiasi tipo di cibo per animali: crocchette, umido, snack, premi, biscotti e integratori. Ogni categoria ha criteri di valutazione specifici.",
      category: "prodotti"
    },
    {
      question: "Cosa succede ai miei dati personali?",
      answer: "I tuoi dati vengono utilizzati esclusivamente per fornirti l'analisi richiesta. Non li condividiamo con terze parti e puoi richiederne la cancellazione in qualsiasi momento scrivendo a privacy@petscan.it.",
      category: "privacy"
    },
    {
      question: "Avete un'app mobile?",
      answer: "Al momento il servizio è disponibile solo via web, ma stiamo sviluppando un'app mobile che includerà scanner del codice a barre e analisi istantanee. Iscriviti alla newsletter per essere aggiornato!",
      category: "mobile"
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      funzionamento: 'from-blue-400 to-blue-600',
      prezzo: 'from-green-400 to-green-600',
      tempistiche: 'from-orange-400 to-orange-600',
      confronto: 'from-purple-400 to-purple-600',
      affidabilità: 'from-teal-400 to-teal-600',
      prodotti: 'from-pink-400 to-pink-600',
      privacy: 'from-red-400 to-red-600',
      mobile: 'from-indigo-400 to-indigo-600'
    };
    return colors[category as keyof typeof colors] || 'from-gray-400 to-gray-600';
  };

  return (
    <>
      <section id="faq" className="py-12 sm:py-24 px-4 bg-gradient-to-br from-blue-50 via-purple-50 to-green-50 relative overflow-hidden">
        {/* Enhanced background decorations */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-200/20 to-purple-200/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-green-200/20 to-teal-200/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-to-br from-purple-200/10 to-blue-200/10 rounded-full blur-2xl -translate-x-1/2 -translate-y-1/2"></div>
        
        <div className="container mx-auto max-w-4xl relative z-10">
          <div className="text-center mb-12 sm:mb-20">
            {/* Enhanced header with icon */}
            <div className="inline-flex items-center justify-center space-x-2 sm:space-x-3 bg-gradient-to-r from-blue-100/80 via-purple-100/80 to-green-100/80 backdrop-blur-sm text-blue-700 px-4 sm:px-6 py-2 sm:py-3 rounded-full text-xs sm:text-sm font-semibold mb-6 sm:mb-8 shadow-lg border border-blue-200/50">
              <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Domande frequenti</span>
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 animate-pulse" />
            </div>
            
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 sm:mb-8 leading-tight">
              Tutto quello che <br />
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 bg-clip-text text-transparent">
                vuoi sapere
              </span>
            </h2>
            <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Scopri come PetScan può aiutarti a prenderti cura al meglio 
              dell'alimentazione del tuo amico a quattro zampe.
            </p>
          </div>

          <div className="space-y-4 sm:space-y-6">
            {faqs.map((faq, index) => (
              <div 
                key={index} 
                className="group bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-white/50 hover:bg-white/90"
              >
                {/* Category indicator */}
                <div className={`h-1 bg-gradient-to-r ${getCategoryColor(faq.category)}`}></div>
                
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-4 sm:px-8 py-4 sm:py-6 text-left flex items-center justify-between hover:bg-gradient-to-r hover:from-gray-50/50 hover:to-blue-50/50 transition-all duration-300 group-hover:px-5 sm:group-hover:px-10"
                >
                  <div className="flex items-center space-x-3 sm:space-x-4 flex-1 min-w-0">
                    {/* Consistent HelpCircle icon for all items */}
                    <div className={`w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r ${getCategoryColor(faq.category)} rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 flex-shrink-0`}>
                      <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    </div>
                    
                    <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-900 pr-2 sm:pr-4 group-hover:text-blue-700 transition-colors duration-300 leading-snug">
                      {faq.question}
                    </h3>
                  </div>
                  
                  <div className="flex-shrink-0 ml-2 sm:ml-4">
                    {openIndex === index ? (
                      <ChevronUp className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 group-hover:scale-110 transition-all duration-300" />
                    ) : (
                      <ChevronDown className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400 group-hover:text-blue-600 group-hover:scale-110 transition-all duration-300" />
                    )}
                  </div>
                </button>
                
                {openIndex === index && (
                  <div className="px-4 sm:px-8 pb-4 sm:pb-6 animate-accordion-down">
                    <div className="border-t border-gradient-to-r from-gray-100 to-blue-100 pt-4 sm:pt-6">
                      {/* Improved mobile centering and spacing */}
                      <div className="bg-gradient-to-r from-blue-50/50 to-purple-50/50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border-l-4 border-blue-300 mx-auto">
                        <p className="text-gray-700 leading-relaxed text-base sm:text-lg text-center sm:text-left">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Enhanced bottom CTA */}
          <div className="text-center mt-12 sm:mt-16">
            <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 rounded-2xl sm:rounded-3xl p-6 sm:p-8 text-white shadow-2xl relative overflow-hidden">
              {/* Decorative elements */}
              <div className="absolute top-0 left-0 w-full h-full">
                <div className="absolute top-4 left-4 w-3 h-3 bg-white/30 rounded-full animate-pulse"></div>
                <div className="absolute top-8 right-8 w-2 h-2 bg-white/40 rounded-full animate-pulse delay-300"></div>
                <div className="absolute bottom-6 left-12 w-4 h-4 bg-white/20 rounded-full animate-pulse delay-700"></div>
              </div>
              
              <div className="relative z-10">
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-3 sm:mb-4">
                  Non hai trovato la risposta che cercavi?
                </h3>
                <p className="text-lg sm:text-xl opacity-95 mb-4 sm:mb-6">
                  Contattaci direttamente e ti risponderemo il prima possibile!
                </p>
                <button 
                  onClick={() => setIsContactModalOpen(true)}
                  className="bg-white text-blue-600 hover:bg-gray-50 px-6 sm:px-8 py-3 sm:py-4 rounded-full font-bold text-base sm:text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2 inline" />
                  Contattaci
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
    </>
  );
};

export default FAQ;
