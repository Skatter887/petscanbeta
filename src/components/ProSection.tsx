import { Crown, Zap, Shield, Clock, Sparkles, Target, Trophy, FileText, Utensils, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import ProEmailModal from './ProEmailModal';

const ProSection = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const proFeatures = [
    {
      icon: FileText,
      title: "Profilo Privato Completo",
      description: "Cartella clinica digitale personale per il tuo pet con storico completo e dati veterinari sempre a portata di mano",
      color: "from-blue-400 via-indigo-500 to-purple-600",
      highlight: "Cartella clinica"
    },
    {
      icon: Utensils,
      title: "Cibo Consigliato Su Misura",
      description: "Raccomandazioni alimentari personalizzate basate su età, peso, allergie e condizioni specifiche del tuo animale",
      color: "from-green-400 via-teal-500 to-cyan-600",
      highlight: "Personalizzato"
    },
    {
      icon: Zap,
      title: "Scan Illimitati",
      description: "Analizza tutti i prodotti che vuoi senza limiti, con accesso completo al database di oltre 100.000 alimenti",
      color: "from-yellow-400 via-orange-500 to-red-500",
      highlight: "Illimitati"
    },
    {
      icon: Bell,
      title: "Notifiche Intelligenti",
      description: "Avvisi personalizzati su app per eventi importanti: richiami prodotti, scadenze, controlli veterinari e molto altro",
      color: "from-purple-400 via-violet-500 to-indigo-600",
      highlight: "Su app"
    }
  ];

  return (
    <>
      <section id="pro" className="py-12 sm:py-16 lg:py-24 px-4 bg-gradient-to-br from-purple-50 via-blue-50 to-green-50 relative overflow-hidden">
        {/* Decorative elements - ottimizzati per mobile */}
        <div className="absolute top-0 left-0 w-48 h-48 sm:w-72 sm:h-72 lg:w-96 lg:h-96 bg-gradient-to-br from-purple-200/30 to-blue-200/30 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-48 h-48 sm:w-72 sm:h-72 lg:w-96 lg:h-96 bg-gradient-to-br from-green-200/30 to-teal-200/30 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
        
        <div className="container mx-auto max-w-7xl relative z-10">
          <div className="text-center mb-12 sm:mb-16 lg:mb-20">
            <div className="inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-100 via-blue-100 to-green-100 text-purple-700 px-4 sm:px-6 py-2 sm:py-3 rounded-full text-xs sm:text-sm font-semibold mb-6 sm:mb-8 shadow-lg border border-purple-200/50">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 animate-pulse" />
              <span>Prossimamente disponibile</span>
              <Crown className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            
            <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-6 sm:mb-8 leading-tight">
              <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-green-600 bg-clip-text text-transparent">
                PetScan Pro
              </span>
            </h2>
            <p className="text-base sm:text-lg lg:text-xl xl:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed px-2">
              La versione completa di PetScan: un'esperienza rivoluzionaria 
              che trasformerà il modo in cui ti prendi cura dell'alimentazione e della salute del tuo amico a 4 zampe.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6 sm:gap-8 lg:gap-6 mb-12 sm:mb-16">
            {proFeatures.map((feature, index) => (
              <div key={index} className="group bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xl hover:shadow-2xl transition-all duration-500 border border-white/50 hover:scale-105 hover:bg-white/90">
                <div className={`w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-4 sm:mb-6 shadow-2xl mx-auto group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
                
                <div className="text-center mb-3">
                  <span className="inline-block bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs font-bold mb-3 sm:mb-4">
                    {feature.highlight}
                  </span>
                </div>
                
                <h3 className="text-base sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3 text-center group-hover:text-purple-700 transition-colors duration-300 leading-tight">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed text-center text-xs sm:text-sm">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

          <div className="relative">
            {/* Enhanced CTA section - ottimizzata per mobile */}
            <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-green-600 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 xl:p-12 text-center text-white shadow-2xl relative overflow-hidden">
              {/* Decorative elements */}
              <div className="absolute top-0 left-0 w-full h-full">
                <div className="absolute top-4 left-4 w-2 h-2 sm:w-3 sm:h-3 bg-white/30 rounded-full animate-pulse"></div>
                <div className="absolute top-6 sm:top-8 right-6 sm:right-8 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white/40 rounded-full animate-pulse delay-300"></div>
                <div className="absolute bottom-4 sm:bottom-6 left-8 sm:left-12 w-3 h-3 sm:w-4 sm:h-4 bg-white/20 rounded-full animate-pulse delay-700"></div>
                <div className="absolute bottom-3 sm:bottom-4 right-3 sm:right-4 w-2 h-2 sm:w-3 sm:h-3 bg-white/30 rounded-full animate-pulse delay-500"></div>
              </div>
              
              <div className="relative z-10">
                <div className="flex items-center justify-center mb-4 sm:mb-6">
                  <Trophy className="w-6 h-6 sm:w-8 sm:h-8 mr-2 sm:mr-3 text-yellow-300" />
                  <span className="text-lg sm:text-2xl font-bold">Accesso Esclusivo</span>
                  <Trophy className="w-6 h-6 sm:w-8 sm:h-8 ml-2 sm:ml-3 text-yellow-300" />
                </div>
                
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6 leading-tight">
                  Vuoi essere tra i primi a provare 
                  <br className="hidden sm:block" />
                  <span className="text-yellow-300">PetScan Pro?</span>
                </h3>
                
                <p className="text-base sm:text-lg lg:text-xl xl:text-2xl mb-6 sm:mb-8 opacity-95 max-w-3xl mx-auto leading-relaxed px-2">
                  Iscrivendoti alla mailing list sarai tra i primi a scoprire e provare gratuitamente 
                  PetScan Pro, con <strong className="text-yellow-300">sconti esclusivi</strong> e contenuti riservati.
                </p>
                
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mb-6 text-sm sm:text-base lg:text-lg">
                  <div className="flex items-center">
                    <Zap className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-yellow-300" />
                    <span>Accesso anticipato</span>
                  </div>
                  <div className="flex items-center">
                    <Crown className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-yellow-300" />
                    <span>Sconti esclusivi</span>
                  </div>
                  <div className="flex items-center">
                    <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-yellow-300" />
                    <span>Contenuti premium</span>
                  </div>
                </div>
                
                <Button 
                  size="lg"
                  onClick={() => setIsModalOpen(true)}
                  className="bg-white text-purple-600 hover:bg-gray-50 px-6 sm:px-8 lg:px-10 py-4 sm:py-5 lg:py-6 rounded-full font-bold text-base sm:text-lg lg:text-xl shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 border-2 border-transparent hover:border-yellow-300"
                >
                  <Crown className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3" />
                  <span className="hidden sm:inline">Iscriviti alla mailing list</span>
                  <span className="sm:hidden">Iscriviti ora</span>
                  <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 ml-2 sm:ml-3" />
                </Button>
                
                <p className="text-xs sm:text-sm opacity-75 mt-3 sm:mt-4">
                  ✨ Gratis e senza impegno • Cancellati quando vuoi
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ProEmailModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
};

export default ProSection;
