
import { Search, Heart, Calendar, Brain, BookOpen, Sparkles, Zap, Shield } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';

// Componente per le connessioni dinamiche al scroll
const DynamicConnection = ({ index, isActive }: { index: number; isActive: boolean }) => (
  <div className="hidden md:block absolute top-1/2 left-full w-full h-0.5 z-0 transform -translate-y-1/2">
    <div className="relative w-full h-full">
      {/* Linea base */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-200 to-transparent opacity-30"></div>
      
      {/* Linea animata */}
      <div 
        className={`absolute inset-0 bg-gradient-to-r from-green-400 via-emerald-500 to-orange-400 transition-all duration-1000 ease-out ${
          isActive ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'
        }`}
        style={{ 
          transformOrigin: 'left',
          boxShadow: isActive ? '0 0 20px rgba(34, 197, 94, 0.5)' : 'none'
        }}
      >
        {/* Particles flowing */}
        <div className={`absolute inset-0 ${isActive ? 'animate-pulse' : ''}`}>
          <div className="absolute top-1/2 left-1/4 w-1 h-1 bg-white rounded-full transform -translate-y-1/2 animate-ping" style={{ animationDelay: '0s' }}></div>
          <div className="absolute top-1/2 left-1/2 w-0.5 h-0.5 bg-white rounded-full transform -translate-y-1/2 animate-ping" style={{ animationDelay: '0.5s' }}></div>
          <div className="absolute top-1/2 left-3/4 w-1 h-1 bg-white rounded-full transform -translate-y-1/2 animate-ping" style={{ animationDelay: '1s' }}></div>
        </div>
      </div>
      
      {/* Endpoint circle */}
      <div 
        className={`absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-1/2 w-3 h-3 rounded-full transition-all duration-500 ${
          isActive ? 'bg-gradient-to-r from-green-400 to-orange-400 scale-100 opacity-100' : 'bg-gray-300 scale-75 opacity-50'
        }`}
        style={{ 
          boxShadow: isActive ? '0 0 15px rgba(34, 197, 94, 0.6)' : 'none'
        }}
      >
        <div className={`absolute inset-0 bg-white rounded-full transition-all duration-300 ${isActive ? 'scale-50 opacity-80 animate-pulse' : 'scale-0 opacity-0'}`}></div>
      </div>
    </div>
  </div>
);

const HowItWorks = () => {
  const [activeConnections, setActiveConnections] = useState<boolean[]>([false, false]);
  const [visibleCards, setVisibleCards] = useState<boolean[]>([false, false, false]);
  const [animatedCards, setAnimatedCards] = useState<boolean[]>([false, false, false]);
  const [fadeInCards, setFadeInCards] = useState<boolean[]>([false, false, false]);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([null, null, null]);

  const steps = [
    {
      icon: Search,
      title: "Scansiona il cibo del tuo pet",
      description: "Usa la fotocamera per scansionare il codice a barre o scrivi il nome del prodotto. Il tuo amico peloso merita solo il meglio!",
      color: "from-green-400 via-green-500 to-emerald-600",
      bgColor: "from-green-50 to-emerald-50",
      emoji: "🐕",
      petIcon: "🔍"
    },
    {
      icon: Brain,
      title: "I nostri esperti analizzano",
      description: "La nostra IA veterinaria esamina ogni ingrediente per la salute del tuo cucciolo o gattino, basandosi su ricerca scientifica certificata.",
      color: "from-blue-400 via-purple-500 to-indigo-600",
      bgColor: "from-blue-50 to-purple-50",
      emoji: "🐱",
      petIcon: "🧠"
    },
    {
      icon: Heart,
      title: "Ricevi consigli per il tuo pet",
      description: "Ottieni un punteggio dettagliato e consigli personalizzati per mantenere il tuo amico a quattro zampe sano e felice.",
      color: "from-orange-400 via-orange-500 to-red-500",
      bgColor: "from-orange-50 to-red-50",
      emoji: "🐾",
      petIcon: "❤️"
    }
  ];

  // Scroll tracking per attivare fade-in, connessioni e animazioni delle card
  useEffect(() => {
    const handleScroll = () => {
      const connections = [false, false];
      const visible = [false, false, false];
      const newFadeIn = [...fadeInCards];
      const windowHeight = window.innerHeight;
      
      // Check visibility and connections for each card
      for (let index = 0; index < 3; index++) {
        const card = cardRefs.current[index];
        if (!card) continue;
        
        const rect = card.getBoundingClientRect();
        // More generous visibility threshold for fade-in
        const cardVisible = rect.top < windowHeight * 0.85 && rect.bottom > windowHeight * 0.15;
        visible[index] = cardVisible;
        
        // Immediate fade-in trigger when card becomes visible
        if (cardVisible && !fadeInCards[index]) {
          newFadeIn[index] = true;
        }
        
        // Check connections (only for first 2 cards)
        if (index < 2) {
          const nextCard = cardRefs.current[index + 1];
          if (nextCard) {
            const nextRect = nextCard.getBoundingClientRect();
            const nextVisible = nextRect.top < windowHeight * 0.8;
            connections[index] = cardVisible && nextVisible;
          }
        }
      }
      
      setVisibleCards(visible);
      setActiveConnections(connections);
      setFadeInCards(newFadeIn);
    };

    // Throttle scroll events for better performance
    let ticking = false;
    const throttledScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', throttledScroll);
    handleScroll(); // Check initial state
    
    return () => window.removeEventListener('scroll', throttledScroll);
  }, [fadeInCards]);

  // Separate effect for enhanced animations
  useEffect(() => {
    fadeInCards.forEach((hasFadedIn, index) => {
      if (hasFadedIn && visibleCards[index] && !animatedCards[index]) {
        const timer = setTimeout(() => {
          setAnimatedCards(prev => {
            const newAnimated = [...prev];
            newAnimated[index] = true;
            return newAnimated;
          });
        }, 300 + index * 100); // Staggered enhanced animations
        
        return () => clearTimeout(timer);
      }
    });
  }, [fadeInCards, visibleCards, animatedCards]);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <section id="come-funziona" className="py-24 px-4 bg-gradient-to-br from-gray-50 via-white to-green-50/30 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-br from-green-200/20 to-emerald-300/20 rounded-full blur-2xl animate-pulse"></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-br from-orange-200/20 to-red-300/20 rounded-full blur-xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-gradient-to-br from-blue-200/20 to-purple-300/20 rounded-full blur-2xl animate-pulse delay-2000"></div>
        </div>

        <div className="container mx-auto max-w-7xl relative z-10">
          <div className="text-center mb-20">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-100 to-orange-100 text-gray-800 px-6 py-3 rounded-full text-sm font-semibold mb-8 shadow-sm backdrop-blur-sm border border-green-200/50">
              <Sparkles className="w-4 h-4 text-green-600" />
              Tecnologia all'avanguardia
              <Zap className="w-4 h-4 text-orange-600" />
            </div>

            <h2 className="text-5xl lg:text-7xl font-extrabold text-gray-900 mb-8 leading-[0.9] tracking-tight">
              Come funziona
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 via-emerald-600 to-orange-500">
                PetScan
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto mb-12 leading-relaxed font-medium">
              Analizzare il cibo del tuo animale non è mai stato così semplice e preciso.
              <br className="hidden sm:block" />
              Bastano <span className="font-bold text-green-600">3 passaggi</span> per sapere se stai facendo la <span className="font-bold text-orange-600">scelta giusta</span>.
            </p>
            
            {/* AI & Scientific Sources Information Box - Enhanced */}
            <div className="bg-gradient-to-r from-blue-50/80 via-purple-50/80 to-green-50/80 rounded-3xl p-6 sm:p-8 mx-auto max-w-5xl border border-blue-200/40 shadow-xl backdrop-blur-sm mb-16 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-100/20 via-purple-100/20 to-green-100/20"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-center mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 rounded-xl">
                      <Brain className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="w-8 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400"></div>
                    <div className="p-2 bg-purple-100 rounded-xl">
                      <BookOpen className="w-6 h-6 text-purple-600" />
                    </div>
                    <div className="w-8 h-0.5 bg-gradient-to-r from-purple-400 to-green-400"></div>
                    <div className="p-2 bg-green-100 rounded-xl">
                      <Shield className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                </div>
                <p className="text-lg lg:text-xl text-gray-700 leading-relaxed font-medium">
                  Le valutazioni PetScan combinano il potenziale dell'<strong className="text-blue-700">intelligenza artificiale più avanzata</strong> con <strong className="text-purple-700">fonti scientifiche peer-reviewed</strong>, per fornire un'analisi <strong className="text-green-700">oggettiva e aggiornata</strong> sulla qualità nutrizionale degli alimenti per cani e gatti.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 lg:gap-20 relative">
            {steps.map((step, index) => (
              <div 
                key={index} 
                className="relative group"
                ref={(el) => {
                  cardRefs.current[index] = el;
                }}
              >
                {/* Dynamic Connection */}
                {index < steps.length - 1 && (
                  <DynamicConnection index={index} isActive={activeConnections[index]} />
                )}

                <div className="relative z-10 text-center">
                  {/* Glass Morphism Card - Reactive fade-in on scroll */}
                  <div className={`
                    relative backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 md:p-10 shadow-2xl overflow-hidden
                    transition-all duration-1000 ease-out
                    ${fadeInCards[index] 
                      ? 'opacity-100 transform translate-y-0 scale-100' 
                      : 'opacity-0 transform translate-y-8 scale-95'
                    }
                    ${animatedCards[index] 
                      ? 'shadow-3xl scale-[1.02] -translate-y-2 bg-white/15 border-white/30' 
                      : 'shadow-2xl'
                    }
                    group-hover:shadow-4xl group-hover:scale-[1.05] group-hover:-translate-y-4
                  `}>
                    {/* Gradient overlay background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-white/5 to-transparent opacity-50"></div>
                    
                    {/* Animated border glow - Dynamic on scroll */}
                    <div className={`
                      absolute inset-0 rounded-3xl bg-gradient-to-r from-green-400/20 via-emerald-400/20 to-orange-400/20 blur-sm
                      transition-opacity duration-1000
                      ${animatedCards[index] ? 'opacity-60' : 'opacity-0'}
                      group-hover:opacity-100
                    `}></div>
                    
                    {/* Inner glow - Dynamic on scroll */}
                    <div className={`
                      absolute inset-0 rounded-3xl bg-gradient-to-br from-green-50/30 via-transparent to-orange-50/30
                      transition-opacity duration-800
                      ${animatedCards[index] ? 'opacity-40' : 'opacity-0'}
                      group-hover:opacity-70
                    `}></div>
                    
                    {/* Floating particles - Reactive fade-in */}
                    <div className={`
                      absolute inset-0 overflow-hidden rounded-3xl
                      transition-opacity duration-1000
                      ${fadeInCards[index] ? 'opacity-100' : 'opacity-0'}
                    `}>
                      <div className={`
                        absolute top-4 left-6 w-1 h-1 bg-green-400 rounded-full transition-all duration-800
                        ${fadeInCards[index] ? 'opacity-30' : 'opacity-0 scale-0'}
                        ${animatedCards[index] ? 'animate-ping opacity-40' : ''}
                      `} style={{ animationDelay: `${index * 0.15}s` }}></div>
                      <div className={`
                        absolute top-8 right-8 w-0.5 h-0.5 bg-orange-400 rounded-full transition-all duration-900
                        ${fadeInCards[index] ? 'opacity-40' : 'opacity-0 scale-0'}
                        ${animatedCards[index] ? 'animate-ping opacity-60' : ''}
                      `} style={{ animationDelay: `${index * 0.15 + 0.2}s` }}></div>
                      <div className={`
                        absolute bottom-6 left-8 w-1 h-1 bg-emerald-400 rounded-full transition-all duration-700
                        ${fadeInCards[index] ? 'opacity-25' : 'opacity-0 scale-0'}
                        ${animatedCards[index] ? 'animate-ping opacity-30' : ''}
                      `} style={{ animationDelay: `${index * 0.15 + 0.4}s` }}></div>
                      <div className={`
                        absolute bottom-4 right-6 w-0.5 h-0.5 bg-green-400 rounded-full transition-all duration-1000
                        ${fadeInCards[index] ? 'opacity-35' : 'opacity-0 scale-0'}
                        ${animatedCards[index] ? 'animate-ping opacity-50' : ''}
                      `} style={{ animationDelay: `${index * 0.15 + 0.6}s` }}></div>
                    </div>

                    {/* Icon container con effetto glass - Dynamic on scroll */}
                    <div className="relative z-10 flex flex-col items-center">
                      <div className={`
                        w-24 h-24 md:w-28 md:h-28 
                        backdrop-blur-xl bg-gradient-to-br ${step.color} 
                        rounded-2xl flex items-center justify-center 
                        mb-8 shadow-2xl border border-white/30
                        relative overflow-hidden
                        transition-all duration-1200 ease-out
                        ${fadeInCards[index] 
                          ? 'opacity-100 transform translate-y-0 scale-100 rotate-0' 
                          : 'opacity-0 transform translate-y-4 scale-75 -rotate-12'
                        }
                        ${animatedCards[index] 
                          ? 'scale-110 rotate-3 shadow-3xl border-white/50' 
                          : 'shadow-2xl'
                        }
                        group-hover:scale-125 group-hover:rotate-6 group-hover:shadow-4xl
                      `}>
                        {/* Glass effect overlay */}
                        <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-white/10 to-transparent"></div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-white/20"></div>
                        
                        {/* Main icon - Reactive fade-in */}
                        <step.icon className={`
                          w-12 h-12 md:w-14 md:h-14 text-white relative z-10 drop-shadow-lg
                          transition-all duration-1000 ease-out
                          ${fadeInCards[index] 
                            ? 'opacity-100 transform scale-100 rotate-0' 
                            : 'opacity-0 transform scale-50 rotate-45'
                          }
                          ${animatedCards[index] 
                            ? 'filter drop-shadow-2xl' 
                            : 'filter drop-shadow-lg'
                          }
                        `} />
                        
                        {/* Rim light effect - Dynamic on scroll */}
                        <div className={`
                          absolute inset-0 rounded-2xl border border-white/50
                          transition-opacity duration-1000
                          ${animatedCards[index] ? 'opacity-60' : 'opacity-0'}
                          group-hover:opacity-100
                        `}></div>
                        
                        {/* Pulsing core effect - Only when animated */}
                        <div className={`
                          absolute inset-2 rounded-xl bg-white/20
                          transition-all duration-1000 ease-out
                          ${animatedCards[index] ? 'opacity-40 animate-pulse' : 'opacity-0 scale-0'}
                        `}></div>
                      </div>

                      {/* Content con effetto glass - Reactive fade-in */}
                      <div className={`
                        relative z-10 backdrop-blur-sm bg-white/5 rounded-2xl p-6 border border-white/10
                        transition-all duration-1400 ease-out
                        ${fadeInCards[index] 
                          ? 'opacity-100 transform translate-y-0' 
                          : 'opacity-0 transform translate-y-6'
                        }
                        ${animatedCards[index] 
                          ? 'bg-white/10 border-white/20 shadow-lg' 
                          : 'bg-white/5 border-white/10'
                        }
                      `}>
                        <h3 className={`
                          text-xl md:text-2xl lg:text-3xl font-bold mb-4 leading-tight
                          transition-all duration-1100 ease-out
                          ${fadeInCards[index] 
                            ? 'opacity-100 transform translate-y-0 text-gray-800' 
                            : 'opacity-0 transform translate-y-4 text-gray-600'
                          }
                          ${animatedCards[index] 
                            ? 'text-gray-900' 
                            : 'text-gray-800'
                          }
                          group-hover:text-gray-900
                        `}>
                          {step.title}
                        </h3>
                        <p className={`
                          leading-relaxed text-base md:text-lg
                          transition-all duration-1200 ease-out
                          ${fadeInCards[index] 
                            ? 'opacity-100 transform translate-y-0 text-gray-600' 
                            : 'opacity-0 transform translate-y-4 text-gray-500'
                          }
                          ${animatedCards[index] 
                            ? 'text-gray-700' 
                            : 'text-gray-600'
                          }
                          group-hover:text-gray-700
                        `}>
                          {step.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* CTA - Ottimizzato per mobile e desktop */}
          <div className="text-center mt-16 md:mt-20 px-4">
            <button
              onClick={() => scrollToSection("scannerizza-form")}
              className="group relative bg-white hover:bg-gray-50 text-gray-700 font-bold py-4 md:py-6 px-6 md:px-8 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-[1.05] hover:-translate-y-2 backdrop-blur-sm w-full max-w-sm md:max-w-md lg:max-w-lg mx-auto"
              style={{
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1), 0 8px 32px rgba(0, 0, 0, 0.05)',
                minHeight: '70px',
                maxWidth: '90vw'
              }}
            >
              {/* Animated PetScan border - always active */}
              <div className="absolute -inset-0.5 rounded-full opacity-100 animate-border-pulse">
                <div className="w-full h-full rounded-full bg-gradient-to-r from-green-400 via-orange-400 to-green-400 animate-gradient-shift p-0.5">
                  <div className="w-full h-full bg-white rounded-full"></div>
                </div>
              </div>
              
              {/* Enhanced glow effect */}
              <div className="absolute -inset-2 bg-gradient-to-r from-green-400/30 via-orange-400/30 to-green-400/30 rounded-full blur-xl opacity-60 group-hover:opacity-100 animate-pulse transition-all duration-500 -z-10"></div>
              
              {/* Shimmer effect - always active */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/40 to-transparent -skew-x-12 animate-shimmer"></div>
              
              {/* Additional sparkle effects */}
              <div className="absolute inset-0 rounded-full overflow-hidden">
                <div className="absolute top-4 left-8 w-1 h-1 bg-green-400 rounded-full animate-ping opacity-60" style={{ animationDelay: '0s' }}></div>
                <div className="absolute top-6 right-12 w-1 h-1 bg-orange-400 rounded-full animate-ping opacity-60" style={{ animationDelay: '1s' }}></div>
                <div className="absolute bottom-6 left-12 w-0.5 h-0.5 bg-green-400 rounded-full animate-ping opacity-40" style={{ animationDelay: '2s' }}></div>
                <div className="absolute bottom-4 right-8 w-0.5 h-0.5 bg-orange-400 rounded-full animate-ping opacity-40" style={{ animationDelay: '1.5s' }}></div>
              </div>
              
              <div className="relative flex flex-col md:flex-row items-center justify-center space-y-2 md:space-y-0 md:space-x-4 h-full">
                {/* Scanner icon - Responsive */}
                <div className="relative flex-shrink-0">
                  <svg width="32" height="24" viewBox="0 0 48 36" className="text-gray-600 group-hover:text-gray-800 transition-colors duration-300 md:w-10 md:h-8">
                    <rect x="2" y="2" width="44" height="32" rx="4" ry="4" fill="none" stroke="currentColor" strokeWidth="2.5"/>
                    <path d="M8 8L8 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M8 8L14 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M40 8L40 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M40 8L34 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M8 28L8 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M8 28L14 28" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M40 28L40 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M40 28L34 28" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <rect x="12" y="14" width="1.5" height="8" fill="currentColor"/>
                    <rect x="15" y="14" width="1" height="8" fill="currentColor"/>
                    <rect x="17.5" y="14" width="2" height="8" fill="currentColor"/>
                    <rect x="21" y="14" width="1" height="8" fill="currentColor"/>
                    <rect x="23.5" y="14" width="1.5" height="8" fill="currentColor"/>
                    <rect x="26.5" y="14" width="1" height="8" fill="currentColor"/>
                    <rect x="29" y="14" width="2" height="8" fill="currentColor"/>
                    <rect x="32.5" y="14" width="1" height="8" fill="currentColor"/>
                    <rect x="35" y="14" width="1.5" height="8" fill="currentColor"/>
                    <rect x="10" y="18" width="28" height="1" fill="#22c55e" className="opacity-0 group-hover:opacity-100 group-hover:animate-pulse">
                      <animate attributeName="opacity" values="0;1;0" dur="2s" repeatCount="indefinite" begin="0s"/>
                    </rect>
                  </svg>
                  <div className="absolute -top-1 -right-1 w-2 h-2 md:w-3 md:h-3 bg-green-500 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-opacity duration-300"></div>
                </div>
                
                {/* Text - Responsive */}
                <div className="text-center md:text-left flex-1">
                  <div className="text-lg md:text-xl lg:text-2xl font-bold text-gray-700 group-hover:text-gray-900 transition-colors duration-300 leading-tight">
                    Inizia l'analisi gratuita
                  </div>
                  <div className="text-xs md:text-sm font-medium text-gray-500 group-hover:text-gray-600 transition-colors duration-300 mt-0.5">
                    Il tuo pet merita il meglio 🐾
                  </div>
                </div>
              </div>
            </button>
          </div>
        </div>
      </section>

      {/* Custom CSS for animations */}
      <style>{`
        @keyframes gradient-shift {
          0% {
            background: linear-gradient(45deg, #22c55e, #fb923c, #22c55e);
          }
          25% {
            background: linear-gradient(45deg, #fb923c, #22c55e, #fb923c);
          }
          50% {
            background: linear-gradient(45deg, #22c55e, #fb923c, #22c55e);
          }
          75% {
            background: linear-gradient(45deg, #fb923c, #22c55e, #fb923c);
          }
          100% {
            background: linear-gradient(45deg, #22c55e, #fb923c, #22c55e);
          }
        }

        .animate-gradient-shift {
          animation: gradient-shift 3s ease-in-out infinite;
        }

        @keyframes border-pulse {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.02);
            opacity: 0.8;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        .animate-border-pulse {
          animation: border-pulse 2s ease-in-out infinite;
        }

        @keyframes shimmer {
          0% {
            transform: translateX(-100%) skewX(-12deg);
          }
          100% {
            transform: translateX(200%) skewX(-12deg);
          }
        }

        .animate-shimmer {
          animation: shimmer 3s ease-in-out infinite;
        }

        @keyframes cardSlideIn {
          0% {
            opacity: 0;
            transform: translateY(30px) scale(0.9);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes iconSpin {
          0% {
            transform: rotate(0deg) scale(1);
          }
          50% {
            transform: rotate(180deg) scale(1.1);
          }
          100% {
            transform: rotate(360deg) scale(1);
          }
        }

        @keyframes pulseGlow {
          0%, 100% {
            box-shadow: 0 0 5px rgba(34, 197, 94, 0.3);
          }
          50% {
            box-shadow: 0 0 20px rgba(34, 197, 94, 0.6), 0 0 30px rgba(251, 146, 60, 0.4);
          }
        }

        .animate-card-slide-in {
          animation: cardSlideIn 0.8s ease-out forwards;
        }

        .animate-icon-spin {
          animation: iconSpin 2s ease-in-out infinite;
        }

        .animate-pulse-glow {
          animation: pulseGlow 3s ease-in-out infinite;
        }

        @keyframes fade-in {
          0% {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes icon-entrance {
          0% {
            opacity: 0;
            transform: translateY(10px) scale(0.8) rotate(-10deg);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1) rotate(0deg);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.8s ease-out forwards;
        }

        .animate-icon-entrance {
          animation: icon-entrance 1s ease-out forwards;
        }
      `}</style>
    </>
  );
};

export default HowItWorks;
