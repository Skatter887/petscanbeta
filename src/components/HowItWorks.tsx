
import { Search, Heart, Calendar, Brain, BookOpen } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      icon: Search,
      title: "Inserisci il prodotto",
      description: "Scrivi il nome del cibo o scansiona il codice a barre. Aggiungi foto dell'etichetta per un'analisi più precisa.",
      color: "from-blue-400 to-blue-600"
    },
    {
      icon: Heart,
      title: "Descrivi il tuo animale",
      description: "Età, peso, razza, allergie e condizioni di salute. Più dettagli fornisci, più personalizzata sarà l'analisi.",
      color: "from-green-400 to-green-600"
    },
    {
      icon: Calendar,
      title: "Ricevi l'analisi",
      description: "In pochi secondi ottieni un punteggio dettagliato con consigli specifici per la salute del tuo animale.",
      color: "from-orange-400 to-orange-600"
    }
  ];

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="come-funziona" className="py-20 px-4 bg-white">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Come funziona{' '}
            <span style={{ color: '#1FC77C' }}>Pet</span>
            <span style={{ color: '#F5953B' }}>Scan</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Analizzare il cibo del tuo animale non è mai stato così semplice. 
            Bastano 3 passaggi per sapere se stai facendo la scelta giusta.
          </p>
          
          {/* AI & Scientific Sources Information Box */}
          <div className="bg-gradient-to-r from-blue-50 via-purple-50 to-green-50 rounded-2xl p-4 sm:p-6 mx-auto max-w-4xl border border-blue-200/30 shadow-sm mb-12">
            <div className="flex items-center justify-center mb-3">
              <div className="flex items-center space-x-2">
                <Brain className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
              </div>
            </div>
            <p className="text-sm sm:text-base lg:text-lg text-gray-700 leading-relaxed">
              Le valutazioni PetScan combinano il potenziale dell'<strong className="text-blue-700">intelligenza artificiale più avanzata</strong> con <strong className="text-purple-700">fonti scientifiche peer-reviewed</strong>, per fornire un'analisi oggettiva e aggiornata sulla qualità nutrizionale degli alimenti per cani e gatti.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              {/* Connection line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-16 left-full w-full h-0.5 bg-gradient-to-r from-green-200 to-green-300 z-0">
                  <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-green-300 rounded-full animate-pulse"></div>
                </div>
              )}

              <div className="relative z-10 text-center">
                {/* Step number */}
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full text-2xl font-bold text-gray-400 mb-6 animate-fade-in">
                  {index + 1}
                </div>

                {/* Icon */}
                <div className={`w-20 h-20 bg-gradient-to-br ${step.color} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg transform transition-transform duration-300 hover:scale-110`}>
                  <step.icon className="w-10 h-10 text-white animate-pulse" />
                </div>

                {/* Content */}
                <h3 className="text-2xl font-bold text-gray-900 mb-4 animate-fade-in">
                  {step.title}
                </h3>
                <p className="text-gray-600 leading-relaxed animate-fade-in">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <button 
            onClick={() => scrollToSection('analisi-form')}
            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 animate-fade-in"
          >
            Inizia l'analisi gratuita
          </button>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
