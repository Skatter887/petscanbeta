
import HeroContent from './HeroContent';
import HeroStats from './HeroStats';
import ProductEvaluationCard from './ProductAnalysisCard';
import { useState, useEffect, useRef } from 'react';
import { Search, ScanLine, X, Camera } from 'lucide-react';
import { useProductAnalysis } from '@/hooks/useProductAnalysis';
import BarcodeScanner from './BarcodeScanner';
import ProductNotFoundModal from './ProductNotFoundModal';
import AddProductModal from './AddProductModal';

// Animazioni CSS personalizzate per le zampette decorative
const pawAnimations = `
  @keyframes pulse-slow {
    0%, 100% {
      opacity: 0.3;
      transform: translate(-50%, -50%) scale(0.8);
    }
    50% {
      opacity: 0.8;
      transform: translate(-50%, -50%) scale(1.1);
    }
  }
  
  .animate-pulse-slow {
    animation: pulse-slow 3s ease-in-out infinite;
  }

  @keyframes rainbow-border {
    0% {
      background-position: 300% 50%;
    }
    50% {
      background-position: 150% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }

  @keyframes spin-slow {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
  
  .animate-spin-slow {
    animation: spin-slow 2s linear infinite;
  }
`;

const CATEGORIES = [
  'Tutte',
  'Cani',
  'Gatti',
  // ...altre categorie se vuoi
];

// Componente per la singola zampetta animata
const AnimatedPawPrint = ({ 
  position, 
  delay, 
  color, 
  isVisible,
  side 
}: { 
  position: { x: number; y: number }; 
  delay: number; 
  color: string; 
  isVisible: boolean;
  side: 'left' | 'right';
}) => {
  return (
    <div
      className="absolute w-6 h-6 transition-all duration-600 ease-out pointer-events-none select-none"
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        transform: `translate(-50%, -50%) ${side === 'left' ? 'rotate(-10deg)' : 'rotate(10deg)'}`,
        opacity: isVisible ? 1 : 0,
        scale: isVisible ? 1 : 0.3,
        filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
      }}
    >
      {/* Zampetta SVG realistica */}
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className="w-full h-full"
        style={{ color }}
      >
        {/* Pad principale (cuscinetto centrale) */}
        <ellipse
          cx="12"
          cy="18"
          rx="3.5"
          ry="2.5"
          fill="currentColor"
          opacity="0.9"
        />
        {/* Pads delle dita - 4 dita realistiche */}
        <ellipse
          cx="7"
          cy="10"
          rx="1.8"
          ry="1.2"
          fill="currentColor"
          opacity="0.8"
        />
        <ellipse
          cx="11"
          cy="8"
          rx="1.5"
          ry="1"
          fill="currentColor"
          opacity="0.8"
        />
        <ellipse
          cx="15"
          cy="10"
          rx="1.8"
          ry="1.2"
          fill="currentColor"
          opacity="0.8"
        />
        <ellipse
          cx="9"
          cy="6"
          rx="1.2"
          ry="0.8"
          fill="currentColor"
          opacity="0.7"
        />
      </svg>
    </div>
  );
};

// Componente per la zampetta decorativa pulsante
const DecorativePawPrint = ({ 
  position, 
  color, 
  size, 
  delay 
}: { 
  position: { x: number; y: number }; 
  color: string; 
  size: string; 
  delay: number; 
}) => {
  return (
    <div
      className={`absolute ${size} pointer-events-none select-none animate-pulse-slow`}
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        transform: 'translate(-50%, -50%)',
        animationDelay: `${delay}s`,
        animationDuration: '3s',
        filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.05))',
      }}
    >
      {/* Zampetta SVG migliorata - più riconoscibile come impronta di pet */}
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className="w-full h-full"
        style={{ color }}
      >
        {/* Pad principale (cuscinetto centrale) - più grande e definito */}
        <ellipse
          cx="12"
          cy="18"
          rx="4.5"
          ry="3.5"
          fill="currentColor"
          opacity="0.9"
        />
        {/* Pads delle dita - 4 dita ben definite e realistiche */}
        <ellipse
          cx="7"
          cy="10"
          rx="2.2"
          ry="1.5"
          fill="currentColor"
          opacity="0.8"
        />
        <ellipse
          cx="11"
          cy="8"
          rx="1.8"
          ry="1.2"
          fill="currentColor"
          opacity="0.8"
        />
        <ellipse
          cx="15"
          cy="10"
          rx="2.2"
          ry="1.5"
          fill="currentColor"
          opacity="0.8"
        />
        <ellipse
          cx="9"
          cy="6"
          rx="1.5"
          ry="1"
          fill="currentColor"
          opacity="0.7"
        />
        {/* Aggiungo piccoli dettagli per renderle più realistiche */}
        <ellipse
          cx="13"
          cy="6"
          rx="1.3"
          ry="0.9"
          fill="currentColor"
          opacity="0.7"
        />
      </svg>
    </div>
  );
};

// Genera traiettoria verticale dal basso verso l'alto
const generateVerticalPawTrajectory = (isMobile: boolean) => {
  const steps = isMobile ? 8 : 6; // 8 zampette per lato su mobile, 6 su desktop
  const leftTrajectory = [];
  const rightTrajectory = [];
  
  // Posizioni di partenza (sotto HeroContent)
  const startY = 85; // Sotto HeroContent
  const endY = 5; // Sopra il logo
  const stepHeight = (startY - endY) / (steps - 1);
  
  for (let i = 0; i < steps; i++) {
    const progress = i / (steps - 1);
    
    // Traiettoria verticale con leggero offset laterale
    const leftX = 25 + Math.sin(progress * Math.PI * 0.5) * 3; // Leggera curva sinistra
    const rightX = 75 + Math.sin(progress * Math.PI * 0.5) * 3; // Leggera curva destra
    const y = startY - (progress * (startY - endY));
    
    // Colori alternati
    const color = i % 2 === 0 ? '#6ee7b7' : '#fdba74'; // Verde acqua e arancione pesca
    
    leftTrajectory.push({
      position: { x: leftX, y },
      color,
      delay: i * 500, // 500ms di ritardo tra ogni zampetta (più spazio)
      side: 'left' as const
    });
    
    rightTrajectory.push({
      position: { x: rightX, y },
      color,
      delay: i * 500 + 250, // Offset di 250ms per la destra
      side: 'right' as const
    });
  }
  
  return [...leftTrajectory, ...rightTrajectory];
};

// Genera posizioni decorative per le zampette
const generateDecorativePawPositions = () => {
  return [
    // Zampette laterali sinistre - solo ai bordi, non sopra il testo
    { x: 5, y: 20, size: 'w-6 h-6', color: '#6ee7b7', delay: 0 },
    { x: 8, y: 35, size: 'w-8 h-8', color: '#fdba74', delay: 0.5 },
    { x: 6, y: 50, size: 'w-6 h-6', color: '#6ee7b7', delay: 1 },
    { x: 10, y: 65, size: 'w-7 h-7', color: '#fdba74', delay: 1.5 },
    { x: 7, y: 80, size: 'w-6 h-6', color: '#6ee7b7', delay: 2 },
    { x: 9, y: 95, size: 'w-8 h-8', color: '#fdba74', delay: 2.5 },
    
    // Zampette laterali destre - solo ai bordi, non sopra il testo
    { x: 95, y: 20, size: 'w-6 h-6', color: '#fdba74', delay: 0.2 },
    { x: 92, y: 35, size: 'w-8 h-8', color: '#6ee7b7', delay: 0.7 },
    { x: 94, y: 50, size: 'w-6 h-6', color: '#fdba74', delay: 1.2 },
    { x: 90, y: 65, size: 'w-7 h-7', color: '#6ee7b7', delay: 1.7 },
    { x: 93, y: 80, size: 'w-6 h-6', color: '#fdba74', delay: 2.2 },
    { x: 91, y: 95, size: 'w-8 h-8', color: '#6ee7b7', delay: 2.7 },
  ];
};

const HeroSection = () => {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('Tutte');
  const [isLoading, setIsLoading] = useState(false);
  const [productImages, setProductImages] = useState<string[]>([]);
  const [showScanner, setShowScanner] = useState(false);
  const [productCount, setProductCount] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [productTitles, setProductTitles] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isScannerActive, setIsScannerActive] = useState(false);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const [productSuggestions, setProductSuggestions] = useState<{
    label: string;
    value: string;
    type: 'brand-title' | 'title' | 'brand' | 'ean';
    ean: number;
    brand: string;
    title: string;
  }[]>([]);
  
  // Stato per l'animazione delle zampette
  const [pawAnimationStep, setPawAnimationStep] = useState(0);
  const [isPawAnimationActive, setIsPawAnimationActive] = useState(false);

  const {
    analysisResult,
    isLoading: analysisLoading,
    searchResults,
    showProductNotFoundModal,
    showAddProductModal,
    lastSearchedEan,
    handleProductAnalysis,
    handleProductSelect,
    handleNewSearch,
    handleAddProduct,
    handleCloseAddProductModal,
    reset,
  } = useProductAnalysis();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Animazione delle zampette
  useEffect(() => {
    if (!isMobile) return; // Solo su mobile
    
    const startPawAnimation = () => {
      setIsPawAnimationActive(true);
      setPawAnimationStep(0);
      
      // Avvia la sequenza di zampette
      const trajectory = generateVerticalPawTrajectory(isMobile);
      const totalDuration = trajectory.length * 500 + 2000; // 500ms per zampetta + 2s finale
      
      // Mostra zampette in sequenza
      trajectory.forEach((_, index) => {
        setTimeout(() => {
          setPawAnimationStep(index + 1);
        }, index * 500);
      });
      
      // Reset dopo il completamento
      setTimeout(() => {
        setIsPawAnimationActive(false);
        setPawAnimationStep(0);
        
        // Riavvia l'animazione dopo 7 secondi (6-8 secondi come richiesto)
        setTimeout(startPawAnimation, 7000);
      }, totalDuration);
    };
    
    // Avvia la prima animazione
    const initialDelay = setTimeout(startPawAnimation, 1000);
    
    return () => clearTimeout(initialDelay);
  }, [isMobile]);

  useEffect(() => {
    fetch('/data/petscan_main.json')
      .then(res => res.json())
      .then((data: any[]) => {
        setProductCount(data.length);
        
        // Genera suggerimenti migliorati dal database
        const suggestions = data
          .filter(p => p.title && p.brand && p.Ean)
          .map(p => {
            // Crea suggerimenti multipli per ogni prodotto
            const suggestions = [];
            
            // Suggerimento con brand e titolo
            if (p.brand && p.title) {
              suggestions.push({
              label: `${p.brand} - ${p.title}`,
                value: `${p.brand} - ${p.title}`,
                type: 'brand-title' as const,
                ean: p.Ean,
                brand: p.brand,
                title: p.title
              });
            }
            
            // Suggerimento solo con titolo
            if (p.title) {
              suggestions.push({
                label: p.title,
                value: p.title,
                type: 'title' as const,
                ean: p.Ean,
                brand: p.brand,
                title: p.title
              });
            }
            
            // Suggerimento solo con brand
            if (p.brand) {
              suggestions.push({
                label: p.brand,
                value: p.brand,
                type: 'brand' as const,
                ean: p.Ean,
                brand: p.brand,
                title: p.title
              });
            }
            
            // Suggerimento con EAN
            if (p.Ean) {
              suggestions.push({
                label: `EAN: ${p.Ean}`,
                value: p.Ean.toString(),
                type: 'ean' as const,
                ean: p.Ean,
                brand: p.brand,
                title: p.title
              });
            }
            
            return suggestions;
          })
          .flat()
          .filter((sugg, index, arr) => 
            // Rimuovi duplicati basati su value
            arr.findIndex(s => s.value === sugg.value) === index
          );
        
        setProductSuggestions(suggestions);
      })
      .catch(error => {
        console.error('Errore nel caricamento del database:', error);
        
        // Fallback con dati di esempio per test
        const sampleData = [
          {
            brand: "ALMO NATURE",
            title: "almo nature Urinary Help Adult & Mature Cat 3 con Pesce, 3 con Pollo 6 x 70 g",
            Ean: 8001154127065
          },
          {
            brand: "ULTIMA",
            title: "ultima Cat Sterilizzati Palline di Pelo Tacchino 440 g",
            Ean: 8059149430072
          },
          {
            brand: "GOURMET",
            title: "PURINA GOURMET Mon Petit Filettini Intense cotti in Salsa",
            Ean: 7613034453846
          }
        ];
        
        const suggestions = sampleData.map(p => [
          {
            label: `${p.brand} - ${p.title}`,
            value: `${p.brand} - ${p.title}`,
            type: 'brand-title' as const,
            ean: p.Ean,
            brand: p.brand,
            title: p.title
          },
          {
            label: p.brand,
            value: p.brand,
            type: 'brand' as const,
            ean: p.Ean,
            brand: p.brand,
            title: p.title
          },
          {
            label: p.title,
            value: p.title,
            type: 'title' as const,
            ean: p.Ean,
            brand: p.brand,
            title: p.title
          }
        ]).flat();
        
        setProductSuggestions(suggestions);
        setProductCount(sampleData.length);
      });
  }, []);

  // Chiudi suggerimenti se clicchi fuori
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredSuggestions = search.length > 0
    ? productSuggestions
        .filter(sugg => {
          const searchLower = search.toLowerCase();
          const labelLower = sugg.label.toLowerCase();
          const valueLower = sugg.value.toLowerCase();
          
          // Ricerca più intelligente
          const matches = (
            labelLower.includes(searchLower) ||
            valueLower.includes(searchLower) ||
            sugg.brand.toLowerCase().includes(searchLower) ||
            sugg.title.toLowerCase().includes(searchLower) ||
            sugg.ean.toString().includes(searchLower)
          );
          
          return matches;
        })
        .sort((a, b) => {
          // Priorità: EAN esatto > brand-title > title > brand
          const searchLower = search.toLowerCase();
          
          // EAN esatto ha priorità massima
          if (a.type === 'ean' && a.value === search) return -1;
          if (b.type === 'ean' && b.value === search) return 1;
          
          // Poi brand-title
          if (a.type === 'brand-title' && b.type !== 'brand-title') return -1;
          if (b.type === 'brand-title' && a.type !== 'brand-title') return 1;
          
          // Poi title
          if (a.type === 'title' && b.type !== 'title' && b.type !== 'brand-title') return -1;
          if (b.type === 'title' && a.type !== 'title' && a.type !== 'brand-title') return 1;
          
          // Infine brand
          return 0;
        })
        .slice(0, 10) // Aumento a 10 risultati
    : [];

  // Genera traiettoria delle zampette
  const pawTrajectory = generateVerticalPawTrajectory(isMobile);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Scroll al centro della pagina per il loading
    window.scrollTo({ top: window.innerHeight / 2, behavior: 'smooth' });
    handleProductAnalysis(search);
  };

  const handleAnalyzeClick = () => {
    setIsLoading(true);
    // Scroll al centro della pagina per il loading
    window.scrollTo({ top: window.innerHeight / 2, behavior: 'smooth' });
    handleProductAnalysis(search);
  };

  const handleScan = (barcode: string) => {
    setShowScanner(false);
    setSearch(barcode);
    setIsLoading(true);
    // Scroll al centro della pagina per il loading
    window.scrollTo({ top: window.innerHeight / 2, behavior: 'smooth' });
    handleProductAnalysis(barcode);
  };

  // Funzione per resettare il campo di ricerca
  const resetSearchField = () => {
    setSearch('');
    setShowSuggestions(false);
  };

  // Wrapper functions per resettare anche lo stato locale
  const handleNewSearchWrapper = () => {
    setIsLoading(false); // Reset dello stato locale
    setSearch(''); // Pulisce il campo di ricerca
    setShowSuggestions(false); // Nasconde i suggerimenti
    handleNewSearch(); // Chiama la funzione del hook
  };

  const handleCloseAddProductModalWrapper = () => {
    setIsLoading(false); // Reset dello stato locale
    setSearch(''); // Pulisce il campo di ricerca
    setShowSuggestions(false); // Nasconde i suggerimenti
    handleCloseAddProductModal(); // Chiama la funzione del hook
  };

  // Reset loading quando l'analisi è completata
  useEffect(() => {
    if (analysisResult) {
      // Aggiungi un delay più lungo per mostrare meglio l'animazione
      setTimeout(() => {
        setIsLoading(false);
        // Scroll alla scheda analisi per centrarla
        setTimeout(() => {
          const analysisCard = document.querySelector('[data-analysis-card]');
          if (analysisCard) {
            analysisCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 200);
      }, 1500); // Aumentato da 100ms a 1500ms
    }
  }, [analysisResult]);

  return (
    <section className="relative min-h-screen flex flex-col justify-between items-center px-2 md:px-4 py-0 md:py-16 pb-0 md:pb-16 bg-gradient-to-br from-yellow-200 via-orange-200 to-green-200 rounded-3xl shadow-xl overflow-hidden hero-section-container" style={{ paddingBottom: analysisResult ? '3rem' : '2rem' }}>
      {/* Overlay per oscurare il contenuto quando lo scanner è attivo su mobile */}
      {isMobile && isScannerActive && (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-40 flex items-center justify-center">
          <div className="text-center text-white p-4">
            <div className="w-16 h-16 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center">
              <Camera className="w-8 h-8" />
            </div>
            <p className="text-lg font-semibold mb-2">Scanner Attivo</p>
            <p className="text-sm opacity-90">Inquadra il codice a barre nel riquadro</p>
          </div>
        </div>
      )}
      {/* Logo PetScan - visibile solo su mobile con safe area support, nascosto quando scanner è attivo */}
      {!showScanner && (
        <div className={`md:hidden absolute ${showSuggestions || analysisResult ? 'top-1' : 'top-4'} left-1/2 transform -translate-x-1/2 z-30`} style={{ top: showSuggestions || analysisResult ? 'calc(0.25rem + env(safe-area-inset-top))' : 'calc(1rem + env(safe-area-inset-top))' }}>
          <img 
            src="/logo_no_cont.png" 
            alt="PetScan Logo" 
            className={`${showSuggestions || analysisResult ? 'w-32 h-32' : 'w-50 h-50'} object-contain transition-all duration-200 logo-webapp-lower`}
          />
        </div>
      )}

      {/* Animazione zampette - visibile solo su mobile, nascosta quando scanner è attivo */}
      {!showScanner && (
        <div className="md:hidden absolute left-0 top-0 w-full h-full pointer-events-none select-none overflow-hidden">
          {pawTrajectory.map((paw, index) => (
            <AnimatedPawPrint
              key={index}
              position={paw.position}
              delay={paw.delay}
              color={paw.color}
              isVisible={isPawAnimationActive && index < pawAnimationStep}
              side={paw.side}
            />
          ))}
        </div>
      )}

      {/* Zampette decorative pulsanti - visibili solo su mobile/tablet, nascoste quando scanner è attivo */}
      {!showScanner && (
        <div className="md:hidden absolute left-0 top-0 w-full h-full pointer-events-none select-none overflow-hidden">
          <style>{pawAnimations}</style>
          {generateDecorativePawPositions().map((paw, index) => (
            <DecorativePawPrint
              key={`decorative-${index}`}
              position={{ x: paw.x, y: paw.y }}
              color={paw.color}
              size={paw.size}
              delay={paw.delay}
            />
          ))}
        </div>
      )}

      <div className={`container mx-auto max-w-3xl relative z-20 flex flex-col items-center justify-center flex-1 pb-0 md:pb-4 md:items-center md:justify-center md:text-center ${analysisResult ? 'gap-2' : 'gap-4'} md:gap-8 hero-content-wrapper`} style={{ paddingBottom: analysisResult ? '2rem' : '1rem', paddingLeft: analysisResult ? '0.5rem' : '1rem', paddingRight: analysisResult ? '0.5rem' : '1rem' }}>
        {/* Hero Content (testo invariato) - nascosto quando scanner è attivo */}
        {!showScanner && (
          <div className={`${analysisResult ? 'mt-8' : ''}`}>
            <HeroContent 
              onAnalyzeClick={handleAnalyzeClick}
              onExamplesClick={() => {}}
              isAnalysisActive={analysisResult !== null}
            />
          </div>
        )}
        
        {/* Barra di ricerca - visibile solo su mobile, espansa quando scanner è attivo */}
        <div id="scannerizza-form" className={`w-full md:hidden relative ${showScanner ? 'flex-1 flex flex-col justify-center' : ''}`}>
          <form
            onSubmit={handleSubmit}
            className={`w-full max-w-xl mx-auto flex flex-row items-center gap-0 shadow-lg border-2 border-transparent relative overflow-visible ${showScanner ? 'bg-white/80 backdrop-blur-xl rounded-3xl py-6 px-4' : 'bg-white/90 rounded-full py-3 px-2 backdrop-blur-md min-h-[60px]'}
              !transition-all !duration-200`}
            style={{
              WebkitAppearance: 'none',
              WebkitTapHighlightColor: 'transparent',
              touchAction: 'manipulation',
              boxSizing: 'border-box',
              willChange: 'transform',
              zIndex: 10,
              background: 'linear-gradient(white, white) padding-box, linear-gradient(90deg, #ffb3ba, #ffdfba, #ffffba, #baffc9, #bae1ff, #e8baff, #ffb3f7, #ffb3ba) border-box',
              backgroundSize: '110% 110%',
              animation: 'rainbow-border 800s ease-in-out infinite',
            }}
          >
            {/* Scanner icon sinistra */}
            {!showScanner && (
              <button
                type="button"
                className="flex items-center justify-center bg-gradient-to-br from-green-400 to-orange-400 text-white rounded-full w-12 h-12 shadow-lg hover:scale-110 hover:shadow-xl transition-all duration-200 mr-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                onClick={() => setShowScanner(true)}
                aria-label="Scansiona barcode"
                tabIndex={0}
                style={{ fontSize: 28, WebkitTapHighlightColor: 'transparent', touchAction: 'manipulation' }}
              >
                <ScanLine className="w-7 h-7" style={{ display: 'block' }} />
              </button>
            )}
            {/* Inline BarcodeScanner o input normale */}
            <div className="flex-1 flex items-center justify-center min-w-0">
              {showScanner ? (
                <div className="w-full flex items-center justify-center">
                                  <BarcodeScanner
                  onScan={handleScan}
                  onManualEntry={handleScan}
                  isLoading={analysisLoading}
                  onScannerStateChange={setIsScannerActive}
                  onClose={() => setShowScanner(false)}
                />
                  <button
                    type="button"
                    className="ml-2 text-gray-400 hover:text-red-500 text-2xl font-bold focus:outline-none"
                    onClick={() => setShowScanner(false)}
                    aria-label="Chiudi scanner"
                    tabIndex={0}
                    style={{ WebkitTapHighlightColor: 'transparent', touchAction: 'manipulation' }}
                  >
                    ×
                  </button>
                </div>
              ) : (
                <input
                  type="text"
                  inputMode="text"
                  className="flex-1 bg-transparent outline-none px-3 py-2 text-base rounded-full placeholder-gray-400 min-w-0"
                  placeholder="Inserisci barcode o nome prodotto"
                  value={search}
                  onChange={e => {
                    setSearch(e.target.value);
                    setShowSuggestions(true);
                  }}
                  disabled={analysisLoading}
                  autoComplete="off"
                  style={{
                    WebkitAppearance: 'none',
                    fontSize: '1.1rem',
                    lineHeight: 1.2,
                    border: 'none',
                    outline: 'none',
                    boxShadow: 'none',
                    background: 'transparent',
                    width: '100%',
                    minWidth: 0,
                    padding: '0.7em 0.5em',
                    borderRadius: '9999px',
                    MozOsxFontSmoothing: 'grayscale',
                    WebkitFontSmoothing: 'antialiased',
                    WebkitTapHighlightColor: 'transparent',
                    touchAction: 'manipulation',
                  }}
                  onFocus={e => {
                    // Previene zoom su iOS
                    e.target.style.fontSize = '16px';
                  }}
                  onBlur={e => {
                    e.target.style.fontSize = '1.1rem';
                  }}
                />
              )}
            </div>
            {/* Search icon destra */}
            {!showScanner && (
              <button
                type="submit"
                className="flex items-center justify-center bg-gradient-to-br from-orange-400 to-green-400 text-white rounded-full w-12 h-12 shadow-lg hover:scale-110 hover:shadow-xl transition-all duration-200 ml-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                disabled={analysisLoading || !search.trim()}
                aria-label="Cerca"
                tabIndex={0}
                style={{ fontSize: 28, WebkitTapHighlightColor: 'transparent', touchAction: 'manipulation' }}
              >
                <Search className="w-7 h-7" style={{ display: 'block' }} />
              </button>
            )}
            
          </form>
          
          {/* Autocomplete suggestions */}
          {showSuggestions && filteredSuggestions.length > 0 && !showScanner && (
            <div 
              ref={suggestionsRef}
              className="w-full max-w-xl mx-auto bg-white border border-gray-200 rounded-b-2xl shadow-lg z-50 mt-1 overflow-auto max-h-64"
            >
              {filteredSuggestions.map((suggestion, idx) => (
                <button
                  key={idx}
                  type="button"
                  className="w-full text-left px-4 py-3 hover:bg-gray-100 text-gray-800 text-sm border-b border-gray-100 last:border-b-0 transition-colors flex flex-col"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    // Per l'analisi usa sempre l'EAN
                    const searchValue = suggestion.type === 'ean' ? suggestion.value : suggestion.ean.toString();
                    setSearch(suggestion.value);
                    setIsLoading(true);
                    // Scroll al centro della pagina per il loading
                    window.scrollTo({ top: window.innerHeight / 2, behavior: 'smooth' });
                    handleProductAnalysis(searchValue); // Chiamo l'analisi prima
                    setShowSuggestions(false); // Poi nascondo i suggerimenti
                  }}
                  onTouchStart={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    // Per l'analisi usa sempre l'EAN
                    const searchValue = suggestion.type === 'ean' ? suggestion.value : suggestion.ean.toString();
                    setSearch(suggestion.value);
                    setIsLoading(true);
                    // Scroll al centro della pagina per il loading
                    window.scrollTo({ top: window.innerHeight / 2, behavior: 'smooth' });
                    handleProductAnalysis(searchValue); // Chiamo l'analisi prima
                    setShowSuggestions(false); // Poi nascondo i suggerimenti
                  }}
                  tabIndex={0}
                  style={{ WebkitTapHighlightColor: 'transparent', touchAction: 'manipulation' }}
                >
                  <div className="font-medium text-gray-900">
                    {suggestion.type === 'ean' ? `EAN: ${suggestion.value}` : suggestion.label}
                  </div>
                  {suggestion.type !== 'ean' && (
                    <div className="text-xs text-gray-500 mt-1">
                      {suggestion.brand} • EAN: {suggestion.ean}
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}
          
        </div>

        {/* Statistiche centrate */}
        <div className="w-full flex justify-center md:mt-8">
          <HeroStats />
        </div>

        {/* Barra di ricerca desktop - visibile solo su desktop */}
        <form
          onSubmit={handleSubmit}
          className={`hidden md:flex w-full max-w-lg mx-auto flex-row items-center gap-0 mt-8 mb-8 shadow-lg border border-white/40 relative overflow-visible ${showScanner ? 'bg-white/80 backdrop-blur-xl rounded-3xl py-6 px-4' : 'bg-white/90 rounded-full py-5 px-6 backdrop-blur-md min-h-[64px]'}
            !transition-all !duration-200`}
          style={{
            WebkitAppearance: 'none',
            WebkitTapHighlightColor: 'transparent',
            touchAction: 'manipulation',
            boxSizing: 'border-box',
            willChange: 'transform',
            zIndex: 10,
          }}
        >
          {/* Scanner icon sinistra */}
          {!showScanner && (
            <button
              type="button"
              className="flex items-center justify-center bg-gradient-to-br from-green-400 to-orange-400 text-white rounded-full w-14 h-14 shadow-lg hover:scale-110 hover:shadow-xl transition-all duration-200 mr-3 focus:outline-none focus:ring-2 focus:ring-green-400"
              onClick={() => setShowScanner(true)}
              aria-label="Scansiona barcode"
              tabIndex={0}
              style={{ fontSize: 28, WebkitTapHighlightColor: 'transparent', touchAction: 'manipulation' }}
            >
              <ScanLine className="w-8 h-8" style={{ display: 'block' }} />
            </button>
          )}
          {/* Inline BarcodeScanner o input normale */}
          <div className="flex-1 flex items-center justify-center min-w-0">
            {showScanner ? (
              <div className="w-full flex items-center justify-center">
                <BarcodeScanner
                  onScan={handleScan}
                  onManualEntry={handleScan}
                  isLoading={analysisLoading}
                  onScannerStateChange={setIsScannerActive}
                  onClose={() => setShowScanner(false)}
                />
                <button
                  type="button"
                  className="ml-2 text-gray-400 hover:text-red-500 text-2xl font-bold focus:outline-none"
                  onClick={() => setShowScanner(false)}
                  aria-label="Chiudi scanner"
                  tabIndex={0}
                  style={{ WebkitTapHighlightColor: 'transparent', touchAction: 'manipulation' }}
                >
                  ×
                </button>
              </div>
            ) : (
              <input
                type="text"
                inputMode="text"
                className="flex-1 bg-transparent outline-none px-4 py-2 text-2xl rounded-full placeholder-gray-400 min-w-0"
                placeholder="Inserisci barcode o nome prodotto"
                value={search}
                onChange={e => {
                  setSearch(e.target.value);
                  setShowSuggestions(true);
                }}
                disabled={analysisLoading}
                autoComplete="off"
                style={{
                  WebkitAppearance: 'none',
                  fontSize: '1.1rem',
                  lineHeight: 1.2,
                  border: 'none',
                  outline: 'none',
                  boxShadow: 'none',
                  background: 'transparent',
                  width: '100%',
                  minWidth: 0,
                  padding: '0.7em 0.5em',
                  borderRadius: '9999px',
                  MozOsxFontSmoothing: 'grayscale',
                  WebkitFontSmoothing: 'antialiased',
                  WebkitTapHighlightColor: 'transparent',
                  touchAction: 'manipulation',
                }}
                onFocus={e => {
                  // Previene zoom su iOS
                  e.target.style.fontSize = '16px';
                }}
                onBlur={e => {
                  e.target.style.fontSize = '1.1rem';
                }}
              />
            )}
          </div>
          {/* Search icon destra */}
          {!showScanner && (
            <button
              type="submit"
              className="flex items-center justify-center bg-gradient-to-br from-orange-400 to-green-400 text-white rounded-full w-14 h-14 shadow-lg hover:scale-110 hover:shadow-xl transition-all duration-200 ml-3 focus:outline-none focus:ring-2 focus:ring-orange-400"
              disabled={analysisLoading || !search.trim()}
              aria-label="Cerca"
              tabIndex={0}
              style={{ fontSize: 28, WebkitTapHighlightColor: 'transparent', touchAction: 'manipulation' }}
            >
              <Search className="w-8 h-8" style={{ display: 'block' }} />
            </button>
          )}
          {/* Autocomplete suggestions */}
          {showSuggestions && filteredSuggestions.length > 0 && !showScanner && (
            <div 
              ref={suggestionsRef} 
              className="absolute left-0 top-full w-full max-w-lg bg-white border border-gray-200 rounded-b-2xl shadow-lg z-50 mt-1 overflow-auto max-h-64"
            >
              {filteredSuggestions.map((suggestion, idx) => (
                <button
                  key={idx}
                  type="button"
                  className="w-full text-left px-4 py-3 hover:bg-gray-100 text-gray-800 text-sm border-b border-gray-100 last:border-b-0 transition-colors flex flex-col"
                  onClick={() => {
                    // Per l'analisi usa sempre l'EAN
                    const searchValue = suggestion.type === 'ean' ? suggestion.value : suggestion.ean.toString();
                    setSearch(suggestion.value);
                    setIsLoading(true);
                    // Scroll al centro della pagina per il loading
                    window.scrollTo({ top: window.innerHeight / 2, behavior: 'smooth' });
                    handleProductAnalysis(searchValue); // Chiamo l'analisi prima
                    setShowSuggestions(false); // Poi nascondo i suggerimenti
                  }}
                  tabIndex={0}
                  style={{ WebkitTapHighlightColor: 'transparent', touchAction: 'manipulation' }}
                >
                  <div className="font-medium text-gray-900">
                    {suggestion.type === 'ean' ? `EAN: ${suggestion.value}` : suggestion.label}
                  </div>
                  {suggestion.type !== 'ean' && (
                    <div className="text-xs text-gray-500 mt-1">
                      {suggestion.brand} • EAN: {suggestion.ean}
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}
        </form>

        {/* Loading Component */}
        {(isLoading || analysisLoading) && (
          <div className="w-full flex flex-col items-center justify-center py-12">
            <style>{pawAnimations}</style>
            <div className="bg-white/90 backdrop-blur-md rounded-2xl p-8 shadow-xl border border-white/20">
              <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-green-200 border-t-green-500 rounded-full animate-spin-slow"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl">🐾</span>
                  </div>
                </div>
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    Analizzando il prodotto...
                  </h3>
                  <p className="text-sm text-gray-600">
                    Stiamo valutando la qualità nutrizionale
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Risultato analisi */}
        {analysisResult && (
          <div className="w-full mt-16" data-analysis-card>
            <ProductEvaluationCard result={analysisResult} onResetSearch={resetSearchField} />
          </div>
        )}
        {/* Risultati ricerca multipli */}
        {searchResults.length > 0 && !analysisLoading && (
          <div className="w-full mt-8 space-y-4">
            <div className="text-center text-lg font-semibold text-gray-700">Seleziona un prodotto:</div>
            <div className="flex flex-wrap justify-center gap-4">
              {searchResults.map((product) => (
                <button
                  key={product.Ean}
                  className="bg-white rounded-xl shadow-md p-4 flex flex-col items-center hover:scale-105 transition-transform border border-gray-100"
                  onClick={() => handleProductSelect(product.Ean)}
                >
                  {product.images && (
                    <img src={typeof product.images === 'string' ? product.images.split(',')[0].trim() : ''} alt={product.title} className="w-16 h-16 object-cover rounded-full mb-2" />
                  )}
                  <div className="font-bold text-sm text-gray-800">{product.title}</div>
                  <div className="text-xs text-gray-500">{product.brand}</div>
                </button>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Modali per prodotto non trovato */}
      <ProductNotFoundModal
        isOpen={showProductNotFoundModal}
        onClose={handleNewSearchWrapper}
        onNewSearch={handleNewSearchWrapper}
        onAddProduct={handleAddProduct}
      />
      
      <AddProductModal
        isOpen={showAddProductModal}
        onClose={handleCloseAddProductModalWrapper}
        eanCode={lastSearchedEan}
      />
    </section>
  );
};

export default HeroSection;