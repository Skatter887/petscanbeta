
import HeroContent from './HeroContent';
import HeroStats from './HeroStats';
import ProductEvaluationCard from './ProductAnalysisCard';
import { useState, useEffect, useRef } from 'react';
import { Search, ScanLine, X, Camera } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useProductAnalysis } from '@/hooks/useProductAnalysis';
import { useAutocomplete } from '@/hooks/useAutocomplete';
import BarcodeScanner from './BarcodeScanner';
import ProductNotFoundModal from './ProductNotFoundModal';
import AddProductModal from './AddProductModal';

// Animazioni CSS personalizzate per le zampette decorative e barra di ricerca
const pawAnimations = `
  /* Classi personalizzate per dimensioni logo */
  .w-26 { width: 6.5rem; }
  .h-26 { height: 6.5rem; }
  .w-39 { width: 9.75rem; }
  .h-39 { height: 9.75rem; }

  /* Layout ottimizzato per mobile normale (non web app) - Above the fold */
  @media (max-width: 767px) {
    :not(.standalone-mode) .hero-section-container {
      padding-top: 0 !important;
      padding-bottom: 6rem !important;
      min-height: 100vh !important;
      display: flex !important;
      flex-direction: column !important;
      justify-content: flex-start !important;
    }
    
    :not(.standalone-mode) .hero-content-wrapper {
      padding-top: 0 !important;
      margin-top: 0 !important;
      gap: 0.5rem !important;
      flex: 1 !important;
      display: flex !important;
      flex-direction: column !important;
      justify-content: flex-start !important;
    }
    
    /* Logo container - ridotto ulteriormente */
    :not(.standalone-mode) .hero-section-container > div:first-of-type {
      margin: 0 !important;
      padding: 0 !important;
      transform: scale(0.8) !important;
      margin-bottom: -20px !important;
    }
    
    /* Contenuto principale - ben leggibile */
    :not(.standalone-mode) .hero-content-webapp {
      margin: 0 !important;
      padding: 0 !important;
    }
    
    :not(.standalone-mode) .hero-content-webapp h1 {
      margin: 0 !important;
      padding: 0 !important;
      line-height: 1.1 !important;
      font-size: 2.25rem !important;
    }
    
    :not(.standalone-mode) .hero-content-webapp p {
      margin: 0 !important;
      padding: 0.25rem 0.5rem 0.5rem 0.5rem !important;
      font-size: 1rem !important;
      line-height: 1.4 !important;
    }
    
    /* Barra di ricerca mobile - compatta */
    :not(.standalone-mode) #scannerizza-form {
      margin: 0.1rem 0 !important;
      z-index: 100 !important;
      position: relative !important;
      transform: scale(0.95) !important;
    }
    
    /* HeroStats mobile - above the fold */
    :not(.standalone-mode) .hero-stats-mobile {
      margin: 0.3rem 0 1rem 0 !important;
      z-index: 50 !important;
      position: relative !important;
      padding: 0 1rem !important;
    }
  }
  
  /* Regola aggiuntiva per browser mobile standard - layout compatto */
  @media (max-width: 767px) and (display-mode: browser) {
    .hero-section-container {
      padding-top: 0 !important;
      padding-bottom: 6rem !important;
    }
    
    .hero-content-wrapper {
      padding-top: 0 !important;
      margin-top: 0 !important;
      gap: 0.5rem !important;
    }
    
    .hero-content-webapp {
      margin: 0 !important;
      padding: 0 !important;
    }
    
    .hero-content-webapp p {
      padding: 0.25rem 0.5rem 0.5rem 0.5rem !important;
    }
    
    #scannerizza-form {
      margin: 0.1rem 0 !important;
      z-index: 100 !important;
      transform: scale(0.95) !important;
    }
    
    .hero-stats-mobile {
      margin: 0.3rem 0 1rem 0 !important;
      z-index: 50 !important;
    }
  }

    /* Ottimizzazioni per iOS WebApp - layout migliorato */
  @media (max-width: 430px) and (display-mode: standalone) {
    .hero-section-container {
      min-height: 100dvh !important;
      padding-top: calc(env(safe-area-inset-top) + 1rem) !important;
      padding-bottom: calc(env(safe-area-inset-bottom) + 5rem) !important;
      display: flex !important;
      flex-direction: column !important;
      justify-content: flex-start !important;
      position: relative !important;
    }
   
    .hero-content-wrapper {
      padding-top: 1rem !important;
      gap: 0 !important;
      justify-content: flex-start !important;
      flex: none !important;
      min-height: 0 !important;
      display: flex !important;
      flex-direction: column !important;
      align-items: center !important;
    }
   
    .logo-webapp-higher {
      max-width: 180px !important;
      max-height: 180px !important;
      width: 180px !important;
      height: 180px !important;
      z-index: 10 !important;
      margin: 0 auto 0 auto !important;
      padding: 0 !important;
      flex-shrink: 0 !important;
    }

    .hero-content-webapp {
      margin-top: 0 !important;
      margin-bottom: 0 !important;
      z-index: 20 !important;
      position: relative !important;
      text-align: center !important;
      flex-shrink: 0 !important;
    }

    /* Testo ingrandito per iOS WebApp */
    .hero-content-webapp h1 {
      font-size: 2.25rem !important;
      line-height: 1.1 !important;
      margin-bottom: 0 !important;
      padding: 0 0.5rem !important;
      max-width: 100% !important;
      font-weight: 900 !important;
    }

    .hero-content-webapp p {
      font-size: 1.125rem !important;
      line-height: 1.4 !important;
      margin-top: 0 !important;
      margin-bottom: 1rem !important;
      padding: 0 1rem !important;
      max-width: 100% !important;
      font-weight: 500 !important;
    }

    /* Form di ricerca distribuito meglio */
    #scannerizza-form {
      margin-top: 0 !important;
      margin-bottom: 1rem !important;
      z-index: 30 !important;
      position: relative !important;
      width: 100% !important;
      max-width: 300px !important;
      flex-shrink: 0 !important;
    }
   
    .hero-stats-mobile {
      margin-top: 0 !important;
      margin-bottom: 1rem !important;
      z-index: 40 !important;
      position: relative !important;
      flex-shrink: 0 !important;
    }

    /* Statistiche più leggibili per iOS WebApp */
    .hero-stats-mobile .text-base {
      font-size: 1rem !important;
      font-weight: 700 !important;
    }
    
    .hero-stats-mobile div:last-child {
      font-size: 0.875rem !important;
      font-weight: 500 !important;
    }

    /* Assicura che il contenuto non venga coperto dalla dynamic island */
    .ios-safe-top {
      padding-top: calc(env(safe-area-inset-top) + 1rem) !important;
    }

    /* Layout distribuito meglio */
    .content-distribution {
      display: flex !important;
      flex-direction: column !important;
      justify-content: flex-start !important;
      align-items: center !important;
      min-height: auto !important;
      max-height: calc(100dvh - env(safe-area-inset-top) - env(safe-area-inset-bottom) - 5rem) !important;
      overflow: visible !important;
    }

    /* Prevenzione sovrapposizioni */
    .prevent-overlap {
      position: relative !important;
      z-index: 50 !important;
      background: white !important;
      border-radius: 1rem !important;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1) !important;
    }

    /* Scanner navigation con safe area */
    .scanner-nav-ios {
      padding-bottom: calc(env(safe-area-inset-bottom) + 0.5rem) !important;
      background: rgba(255, 255, 255, 0.95) !important;
      backdrop-filter: blur(20px) !important;
    }
  }

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

  @keyframes search-border-shine {
    0% {
      background-position: -200% 0%;
    }
    100% {
      background-position: 200% 0%;
    }
  }

  .search-border-animation::before {
    content: '';
    position: absolute;
    inset: -2px;
    border-radius: inherit;
    background: linear-gradient(
      90deg,
      transparent 0%,
      rgba(34, 197, 94, 0.1) 10%,
      rgba(34, 197, 94, 0.3) 20%,
      rgba(34, 197, 94, 0.6) 30%,
      rgba(34, 197, 94, 0.8) 40%,
      rgba(34, 197, 94, 1) 50%,
      rgba(251, 191, 36, 1) 60%,
      rgba(251, 191, 36, 0.8) 70%,
      rgba(251, 191, 36, 0.6) 80%,
      rgba(251, 191, 36, 0.3) 90%,
      rgba(251, 191, 36, 0.1) 100%,
      transparent 110%
    );
    background-size: 200% 100%;
    animation: search-border-shine 12s linear infinite;
    pointer-events: none;
    z-index: -1;
    filter: blur(0.3px);
  }

  .search-border-animation::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background: linear-gradient(
      135deg,
      rgba(34, 197, 94, 0.05) 0%,
      rgba(34, 197, 94, 0.1) 25%,
      rgba(251, 191, 36, 0.1) 50%,
      rgba(251, 191, 36, 0.05) 75%,
      transparent 100%
    );
    pointer-events: none;
    z-index: -2;
  }

  /* Progress bar animation */
  @keyframes progress-bar {
    0% {
      width: 0%;
      background-position: 0% 50%;
    }
    25% {
      width: 30%;
      background-position: 25% 50%;
    }
    50% {
      width: 60%;
      background-position: 50% 50%;
    }
    75% {
      width: 85%;
      background-position: 75% 50%;
    }
    100% {
      width: 100%;
      background-position: 100% 50%;
    }
  }

  .animate-progress-bar {
    animation: progress-bar 2s ease-in-out infinite;
    background-size: 200% 100%;
  }

  /* Subtle progress bar animation */
  @keyframes subtle-progress {
    0% {
      width: 0%;
      opacity: 0.8;
    }
    20% {
      width: 25%;
      opacity: 1;
    }
    50% {
      width: 60%;
      opacity: 1;
    }
    80% {
      width: 90%;
      opacity: 0.9;
    }
    100% {
      width: 100%;
      opacity: 0.8;
    }
  }

  .animate-subtle-progress {
    animation: subtle-progress 3s ease-in-out infinite;
    background-size: 200% 100%;
  }

  /* Shimmer effect for loading bar */
  @keyframes shimmer {
    0% {
      background-position: -200% 0;
    }
    100% {
      background-position: 200% 0;
    }
  }

  .loading-shimmer {
    background: linear-gradient(
      90deg,
      transparent 0%,
      rgba(255, 255, 255, 0.4) 50%,
      transparent 100%
    );
    background-size: 200% 100%;
    animation: shimmer 1.5s ease-in-out infinite;
  }

  /* Improved spinner animation */
  @keyframes spin-smooth {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
  
  .animate-spin-slow {
    animation: spin-smooth 2s linear infinite;
  }

  /* Autocomplete animations */
  @keyframes fadeInDown {
    0% {
      opacity: 0;
      transform: translateY(-10px);
    }
    100% {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes scaleIn {
    0% {
      opacity: 0;
      transform: scale(0.95);
    }
    100% {
      opacity: 1;
      transform: scale(1);
    }
  }

  /* Animazioni per le zampette */
  @keyframes paw-bounce {
    0%, 100% {
      transform: scale(1);
      opacity: 0.7;
    }
    50% {
      transform: scale(1.1);
      opacity: 1;
    }
  }

  @keyframes paw-wiggle {
    0%, 100% {
      transform: rotate(0deg) scale(1);
    }
    25% {
      transform: rotate(-5deg) scale(1.05);
    }
    75% {
      transform: rotate(5deg) scale(1.05);
    }
  }

  .animate-paw-bounce {
    animation: paw-bounce 1.5s ease-in-out infinite;
  }

  .animate-paw-wiggle {
    animation: paw-wiggle 2s ease-in-out infinite;
  }

  .autocomplete-dropdown {
    animation: fadeInDown 0.2s ease-out;
  }

  .autocomplete-suggestion {
    transition: all 0.15s ease-in-out;
  }

  .autocomplete-suggestion:hover {
    transform: translateX(2px);
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
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('Tutte');
  // Rimosso isLoading locale - usiamo solo analysisLoading dal hook
  const [productImages, setProductImages] = useState<string[]>([]);
  const [showScanner, setShowScanner] = useState(false);
  const [productCount, setProductCount] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isScannerActive, setIsScannerActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  
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

  // Hook per l'autocomplete
  const {
    suggestions,
    isLoading: autocompleteLoading,
    isOpen: showSuggestions,
    selectedIndex,
    search: searchSuggestions,
    handleKeyDown: handleAutocompleteKeyDown,
    selectSuggestion,
    closeSuggestions,
    setIsOpen: setShowSuggestions
  } = useAutocomplete({
    debounceMs: 150, // Più veloce e reattivo
    minChars: 2,
    maxSuggestions: 8
  });

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Click outside handler per chiudere i suggerimenti
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      
      // Controlla se il click è nell'input
      if (inputRef.current && inputRef.current.contains(target)) {
        return;
      }
      
      // Controlla se il click è in un suggerimento
      const suggestionElements = document.querySelectorAll('[data-autocomplete-suggestion]');
      for (const suggestion of suggestionElements) {
        if (suggestion.contains(target)) {
          return; // Non chiudere se il click è su un suggerimento
        }
      }
      
      // Se arriviamo qui, il click è fuori dall'area di autocomplete
  
      closeSuggestions();
    };

    if (showSuggestions) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showSuggestions, closeSuggestions]);

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

  // Carica il conteggio dei prodotti
  useEffect(() => {
    fetch('/data/petscan_main.json')
      .then(res => res.json())
      .then((data: any[]) => {
        setProductCount(data.length);
      })
      .catch(error => {
        console.error('Errore nel caricamento del database:', error);
        setProductCount(3); // Fallback count
      });
  }, []);

  // Genera traiettoria delle zampette
  const pawTrajectory = generateVerticalPawTrajectory(isMobile);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // handleProductAnalysis gestisce il loading state automaticamente
    // Scroll al centro della pagina per il loading
    window.scrollTo({ top: window.innerHeight / 2, behavior: 'smooth' });
    handleProductAnalysis(search);
  };

  const handleAnalyzeClick = () => {
    // Check if we're on mobile (since the search bar layout is different)
    const isMobile = window.innerWidth < 768;
    
    if (isMobile) {
      // Su mobile, trova la barra di ricerca e centrala perfettamente nello schermo
      const searchForm = document.getElementById('scannerizza-form');
      if (searchForm) {
        // Usa scrollIntoView con block: 'center' per centrare perfettamente
        searchForm.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center',
          inline: 'nearest'
        });
      }
    } else {
      // Su desktop, trova la barra di ricerca e posizionala in alto
      const searchForm = document.getElementById('scannerizza-form-desktop');
      if (searchForm) {
        const elementRect = searchForm.getBoundingClientRect();
        const absoluteElementTop = elementRect.top + window.pageYOffset;
        // Posiziona la barra di ricerca a circa 20px dall'alto dello schermo
        const targetPosition = absoluteElementTop - 20;
        window.scrollTo({ top: targetPosition, behavior: 'smooth' });
      }
    }
  };

  const handleScan = (barcode: string) => {

    
    setShowScanner(false);
    setSearch(barcode);
    // handleProductAnalysis gestisce il loading state automaticamente
    

    // Scroll al centro della pagina per il loading
    window.scrollTo({ top: window.innerHeight / 2, behavior: 'smooth' });
    
    // Chiama l'analisi del prodotto
    handleProductAnalysis(barcode);

  };

  // Funzione per resettare il campo di ricerca
  const resetSearchField = () => {
    setSearch('');
    setShowSuggestions(false);
  };

  // Wrapper functions per resettare anche lo stato locale
  const handleNewSearchWrapper = () => {
    // Il loading state è gestito dal hook useProductAnalysis
    setSearch(''); // Pulisce il campo di ricerca
    setShowSuggestions(false); // Nasconde i suggerimenti
    handleNewSearch(); // Chiama la funzione del hook
  };

  const handleCloseAddProductModalWrapper = () => {
    // Il loading state è gestito dal hook useProductAnalysis
    setSearch(''); // Pulisce il campo di ricerca
    setShowSuggestions(false); // Nasconde i suggerimenti
    handleCloseAddProductModal(); // Chiama la funzione del hook
  };

  // Log per debug dello scanner
  useEffect(() => {
    console.log('showScanner state changed to:', showScanner);
  }, [showScanner]);

  // Scroll automatico quando l'analisi è completata
  useEffect(() => {
    if (analysisResult) {
      // Il loading state è gestito automaticamente dal hook useProductAnalysis
      // Scroll alla scheda analisi per centrarla
      setTimeout(() => {
        const analysisCard = document.querySelector('[data-analysis-card]');
        if (analysisCard) {
          analysisCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 200);
    }
  }, [analysisResult]);

  return (
    <>
      {/* Scanner Fullscreen - quando attivo, occupa l'intera schermata */}
      {showScanner && (
        <div className="fixed inset-0 z-50 bg-black flex flex-col">
          {/* Scanner area - occupa tutto lo spazio tranne l'header in basso */}
          <div className="flex-1 relative">
            <BarcodeScanner
              onScan={handleScan}
              onManualEntry={handleScan}
              isLoading={analysisLoading}
              onScannerStateChange={setIsScannerActive}
              onClose={() => setShowScanner(false)}
            />
          </div>
          
          {/* Header di navigazione - posizionato in basso, sempre visibile */}
          <div className="absolute bottom-0 left-0 right-0 z-60 bg-white/90 backdrop-blur-md border-t border-gray-200" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
            <div className="flex justify-around items-center py-2 px-4">
              <div className="flex flex-col items-center">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <span className="text-xs text-gray-600 mt-1">Guida</span>
              </div>
              
              <div className="flex flex-col items-center">
                <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <span className="text-xs text-gray-600 mt-1">Analisi</span>
              </div>
              
              <div className="flex flex-col items-center">
                <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <span className="text-xs font-semibold text-black mt-1">Scannerizza</span>
              </div>
              
              <div className="flex flex-col items-center">
                <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <span className="text-xs text-gray-600 mt-1">Chi Siamo</span>
              </div>
              
              <div className="flex flex-col items-center">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-xs text-gray-600 mt-1">FAQ</span>
              </div>
            </div>
          </div>
        </div>
      )}
      


      {/* Contenuto normale - nascosto quando scanner è attivo */}
      {!showScanner && (
        <section className="relative min-h-screen flex flex-col justify-start md:justify-between items-center px-2 md:px-4 py-0 md:py-16 pb-0 md:pb-16 rounded-3xl shadow-xl overflow-hidden hero-section-container" style={{ 
          paddingTop: 0,
          paddingBottom: analysisResult ? '3rem' : '2rem',
          background: 'radial-gradient(circle at center, #ffffff 0%, #d4f1ff 25%, #ffe6d9 50%, #e6fff6 75%, #f3e9ff 100%)'
        }}>
          {/* Logo PetScan - Posizionato correttamente per evitare sovrapposizioni */}
          <div className={`md:hidden flex justify-center items-center w-full z-10`} style={{ marginTop: 0, marginBottom: 0 }}>
            <img 
              src="/logo_no_cont.png" 
              alt="PetScan Logo" 
              className={`${showSuggestions || analysisResult ? 'w-38 h-38' : 'w-44 h-44'} object-contain transition-all duration-200 logo-webapp-higher`}
            />
          </div>

          {/* Animazione zampette - visibile solo su mobile */}
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

          {/* Zampette decorative pulsanti - visibili solo su mobile/tablet */}
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

          <div className={`container mx-auto max-w-3xl relative z-20 flex flex-col items-center justify-start flex-1 pt-0 md:pt-4 pb-0 md:pb-4 md:items-center md:justify-center md:text-center gap-0 md:gap-8 hero-content-wrapper content-distribution`} style={{ paddingBottom: analysisResult ? '0.5rem' : '0', paddingLeft: analysisResult ? '0.5rem' : '1rem', paddingRight: analysisResult ? '0.5rem' : '1rem', paddingTop: 0, marginTop: 0 }}>
            {/* Hero Content - ottimizzato per iOS WebApp */}
            <div className="hero-content-webapp">
              <HeroContent 
                onAnalyzeClick={handleAnalyzeClick}
                onExamplesClick={() => {}}
                isAnalysisActive={analysisResult !== null}
              />
            </div>
            
            {/* Barra di ricerca - ottimizzata per iOS WebApp */}
            <div id="scannerizza-form" className="w-full md:hidden relative">
              <div className="relative w-full mx-auto">
                {/* Animazione bordo miccia mobile */}
                <div className="absolute inset-0 rounded-full search-border-animation" style={{ zIndex: 1 }} />
                
                <form
                  onSubmit={handleSubmit}
                                     className={`relative w-full flex flex-row items-center gap-0 shadow-lg border border-white/40 overflow-visible bg-white/90 rounded-full py-3 px-2 backdrop-blur-md min-h-[56px] !transition-all !duration-200`}
                  style={{
                    WebkitAppearance: 'none',
                    WebkitTapHighlightColor: 'transparent',
                    touchAction: 'manipulation',
                    boxSizing: 'border-box',
                    willChange: 'transform',
                    zIndex: 2,
                  }}
                >
                {/* Scanner icon sinistra - ottimizzato per above-the-fold */}
                                 <button
                   type="button"
                   data-scan-button="true"
                   className="flex items-center justify-center bg-gradient-to-br from-green-400 to-orange-400 text-white rounded-full w-12 h-12 shadow-lg hover:scale-110 hover:shadow-xl transition-all duration-200 mr-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                  onClick={() => {
                    console.log('Scan button clicked, opening scanner');
                    console.log('Current showScanner state:', showScanner);
                    setShowScanner(true);
                    console.log('showScanner set to true');
                  }}
                  aria-label="Scansiona barcode"
                  tabIndex={0}
                  style={{ fontSize: 28, WebkitTapHighlightColor: 'transparent', touchAction: 'manipulation' }}
                >
                  <ScanLine className="w-5 h-5" style={{ display: 'block' }} />
                </button>
                
                {/* Input di ricerca - ottimizzato per above-the-fold */}
                <input
                  ref={inputRef}
                  type="text"
                  inputMode="text"
                  className="flex-1 bg-transparent outline-none px-2 py-1 text-sm rounded-full placeholder-gray-400 min-w-0"
                  placeholder="Inserisci barcode o nome prodotto"
                  value={search}
                  onChange={e => {
                    const value = e.target.value;
                    setSearch(value);
                    searchSuggestions(value);
                  }}
                  onKeyDown={e => {
                    const selectedSuggestion = handleAutocompleteKeyDown(e);
                    if (selectedSuggestion) {
                      setSearch(selectedSuggestion.value);
                      // Scroll al centro della pagina per il loading
                      window.scrollTo({ top: window.innerHeight / 2, behavior: 'smooth' });
                      handleProductAnalysis(selectedSuggestion.ean.toString());
                    }
                  }}
                  disabled={analysisLoading}
                  autoComplete="off"
                  style={{
                    WebkitAppearance: 'none',
                    fontSize: '0.9rem',
                    lineHeight: 1.2,
                    border: 'none',
                    outline: 'none',
                    boxShadow: 'none',
                    background: 'transparent',
                    width: '100%',
                    minWidth: 0,
                    padding: '0.4em 0.3em',
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
                    e.target.style.fontSize = '0.9rem';
                    // Non chiudiamo i suggerimenti qui - lasciamo che il click outside handler se ne occupi
                  }}
                />
                
                {/* Search icon destra - ottimizzato per above-the-fold */}
                                 <button
                   type="submit"
                   className="flex items-center justify-center bg-gradient-to-br from-orange-400 to-green-400 text-white rounded-full w-12 h-12 shadow-lg hover:scale-110 hover:shadow-xl transition-all duration-200 ml-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                  disabled={analysisLoading || !search.trim()}
                  aria-label="Cerca"
                  tabIndex={0}
                  style={{ fontSize: 28, WebkitTapHighlightColor: 'transparent', touchAction: 'manipulation' }}
                >
                  <Search className="w-5 h-5" style={{ display: 'block' }} />
                </button>
              </form>
              
                            {/* Mobile Autocomplete suggestions - FUORI dal form per evitare conflitti */}
              {showSuggestions && suggestions.length > 0 && !showScanner && (
                <div 
                  className="absolute left-0 top-full w-full bg-white border border-gray-200 rounded-b-2xl shadow-lg z-50 mt-1 overflow-auto max-h-64 mx-auto autocomplete-dropdown"
                  style={{ marginTop: '1px' }}
                >
                  {suggestions.map((suggestion, idx) => (
                    <div
                      key={`mobile-${suggestion.type}-${suggestion.ean}-${idx}`}
                      data-autocomplete-suggestion
                      className={`w-full text-left px-4 py-3 text-gray-800 text-sm border-b border-gray-100 last:border-b-0 flex flex-col cursor-pointer autocomplete-suggestion ${
                        selectedIndex === idx ? 'bg-green-50 border-green-200' : 'hover:bg-gray-100'
                      }`}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        
                        const selected = selectSuggestion(suggestion);
                        setSearch(selected.value);
                        
                        // Scroll al centro della pagina per il loading
                        window.scrollTo({ top: window.innerHeight / 2, behavior: 'smooth' });
                        
                        handleProductAnalysis(selected.ean.toString());
                      }}
                      style={{ WebkitTapHighlightColor: 'transparent', touchAction: 'manipulation' }}
                    >
                      <div className="font-medium text-gray-900 text-xs">
                        {suggestion.label}
                      </div>
                      <div className="text-xs text-gray-500 mt-1 flex items-center justify-between">
                        <span className="text-xs">{suggestion.brand}</span>
                        <span className="text-gray-400 text-xs">EAN: {suggestion.ean}</span>
                      </div>
                      {suggestion.type === 'ean' && (
                        <div className="text-xs text-blue-600 mt-1">
                          🔗 Match barcode
                        </div>
                      )}
                      {suggestion.type === 'brand' && (
                        <div className="text-xs text-green-600 mt-1">
                          🏷️ Match brand
                        </div>
                      )}
                    </div>
                  ))}
                  {autocompleteLoading && (
                    <div className="px-4 py-3 text-sm text-gray-500 text-center">
                      Caricamento suggerimenti...
                    </div>
                  )}
                </div>
              )}
              </div>
            </div>

            {/* MOBILE LOADING BAR - Posizionata subito dopo la ricerca per essere visibile */}
            {analysisLoading && (
              <div className="md:hidden w-full mt-6 px-4">
                <style>{pawAnimations}</style>
                
                <div className="relative w-full">
                  {/* Background bar - elegante e sottile */}
                  <div className="w-full h-2 bg-gray-200/60 rounded-full overflow-hidden shadow-sm relative">
                    {/* Animated progress - elegante */}
                    <div className="h-full bg-gradient-to-r from-green-400 via-green-500 to-orange-400 rounded-full animate-subtle-progress relative">
                      {/* Shimmer effect */}
                      <div className="absolute inset-0 loading-shimmer rounded-full"></div>
                    </div>
                  </div>
                  
                  {/* Mobile text indicator con zampette */}
                  <div className="flex items-center justify-center mt-4 space-x-3">
                    {/* Zampetta sinistra */}
                    <div className="w-6 h-6 text-green-500 animate-paw-bounce">
                      <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                        {/* Zampetta del cane/gatto */}
                        <circle cx="8" cy="7" r="2"/>
                        <circle cx="16" cy="7" r="2"/>
                        <circle cx="6" cy="12" r="1.5"/>
                        <circle cx="18" cy="12" r="1.5"/>
                        <ellipse cx="12" cy="16" rx="4" ry="3"/>
                      </svg>
                    </div>
                    
                    <span className="text-base text-gray-800 font-bold">
                      Analizzando prodotto...
                    </span>
                    
                    {/* Zampetta destra */}
                    <div className="w-6 h-6 text-orange-500 animate-paw-wiggle" style={{ animationDelay: '0.5s' }}>
                      <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                        {/* Zampetta del cane/gatto */}
                        <circle cx="8" cy="7" r="2"/>
                        <circle cx="16" cy="7" r="2"/>
                        <circle cx="6" cy="12" r="1.5"/>
                        <circle cx="18" cy="12" r="1.5"/>
                        <ellipse cx="12" cy="16" rx="4" ry="3"/>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Statistiche - compatte per iOS WebApp */}
            <div className="w-full md:hidden flex justify-center hero-stats-mobile">
              <HeroStats />
            </div>
          </div>
        </section>
      )}

      {/* Barra di ricerca desktop - visibile solo su desktop */}
      <div id="scannerizza-form-desktop" className="relative hidden md:block w-full max-w-lg mx-auto mt-8 mb-8">
        {/* Animazione bordo miccia */}
        <div 
          className={`absolute inset-0 ${showScanner ? 'rounded-3xl' : 'rounded-full'} search-border-animation`}
          style={{
            zIndex: 1,
          }}
        />
        
        <form
          onSubmit={handleSubmit}
          className={`relative flex w-full flex-row items-center gap-0 shadow-lg border border-white/40 overflow-visible ${showScanner ? 'bg-white/80 backdrop-blur-xl rounded-3xl py-6 px-4' : 'bg-white/90 rounded-full py-5 px-6 backdrop-blur-md min-h-[64px]'}
            !transition-all !duration-200`}
          style={{
            WebkitAppearance: 'none',
            WebkitTapHighlightColor: 'transparent',
            touchAction: 'manipulation',
            boxSizing: 'border-box',
            willChange: 'transform',
            zIndex: 2,
          }}
        >
        {/* Scanner icon sinistra */}
        {!showScanner && (
          <button
            type="button"
            data-scan-button="true"
            className="flex items-center justify-center bg-gradient-to-br from-green-400 to-orange-400 text-white rounded-full w-14 h-14 shadow-lg hover:scale-110 hover:shadow-xl transition-all duration-200 mr-3 focus:outline-none focus:ring-2 focus:ring-green-400"
            onClick={() => {
              console.log('Desktop scan button clicked, opening scanner');
              console.log('Current showScanner state:', showScanner);
              setShowScanner(true);
              console.log('showScanner set to true');
            }}
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
              ref={inputRef}
              type="text"
              inputMode="text"
              className="flex-1 bg-transparent outline-none px-4 py-2 text-2xl rounded-full placeholder-gray-400 min-w-0"
              placeholder="Inserisci barcode o nome prodotto"
              value={search}
                                onChange={e => {
                    const value = e.target.value;
                    setSearch(value);
                    searchSuggestions(value);
                  }}
              onKeyDown={e => {
                const selectedSuggestion = handleAutocompleteKeyDown(e);
                if (selectedSuggestion) {
                  setSearch(selectedSuggestion.value);
                  // Scroll al centro della pagina per il loading
                  window.scrollTo({ top: window.innerHeight / 2, behavior: 'smooth' });
                  handleProductAnalysis(selectedSuggestion.ean.toString());
                }
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
                // Non chiudiamo i suggerimenti qui - lasciamo che il click outside handler se ne occupi
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
      </form>
      
      {/* Autocomplete suggestions - FUORI dal form per evitare conflitti */}

      {showSuggestions && suggestions.length > 0 && !showScanner && (
        <div 
          className="absolute left-0 top-full w-full max-w-lg bg-white border border-gray-200 rounded-b-2xl shadow-lg z-50 mt-1 overflow-auto max-h-64 autocomplete-dropdown"
          style={{ marginTop: '1px' }}
        >
          {suggestions.map((suggestion, idx) => (
            <div
              key={`desktop-${suggestion.type}-${suggestion.ean}-${idx}`}
              data-autocomplete-suggestion
              className={`w-full text-left px-4 py-3 text-gray-800 text-sm border-b border-gray-100 last:border-b-0 flex flex-col cursor-pointer autocomplete-suggestion ${
                selectedIndex === idx ? 'bg-green-50 border-green-200' : 'hover:bg-gray-100'
              }`}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                
                const selected = selectSuggestion(suggestion);
                setSearch(selected.value);
                
                // Scroll al centro della pagina per il loading
                window.scrollTo({ top: window.innerHeight / 2, behavior: 'smooth' });
                
                handleProductAnalysis(selected.ean.toString());
              }}
              style={{ WebkitTapHighlightColor: 'transparent', touchAction: 'manipulation' }}
            >
              <div className="font-medium text-gray-900">
                {suggestion.label}
              </div>
              <div className="text-xs text-gray-500 mt-1 flex items-center justify-between">
                <span>{suggestion.brand}</span>
                <span className="text-gray-400">EAN: {suggestion.ean}</span>
              </div>
              {suggestion.type === 'ean' && (
                <div className="text-xs text-blue-600 mt-1">
                  🔗 Match barcode
                </div>
              )}
              {suggestion.type === 'brand' && (
                <div className="text-xs text-green-600 mt-1">
                  🏷️ Match brand
                </div>
              )}
            </div>
          ))}
          {autocompleteLoading && (
            <div className="px-4 py-3 text-sm text-gray-500 text-center">
              Caricamento suggerimenti...
            </div>
          )}
        </div>
      )}
      </div>

      {/* Statistiche - solo desktop, posizionate sotto la barra di ricerca */}
      <div className="w-full hidden md:flex justify-center mt-5 mb-4">
        <HeroStats />
      </div>

      {/* Subtle Loading Bar - appears under search when analyzing */}
      {analysisLoading && (
        <div className="w-full mt-6 mb-8">
          <style>{pawAnimations}</style>
          


          {/* Desktop loading bar */}
          <div className="hidden md:block w-full max-w-lg mx-auto px-4">
            <div className="relative">
              {/* Background bar */}
              <div className="w-full h-1.5 bg-gray-200/60 rounded-full overflow-hidden shadow-sm relative">
                {/* Animated progress */}
                <div className="h-full bg-gradient-to-r from-green-400 via-green-500 to-orange-400 rounded-full animate-subtle-progress relative">
                  {/* Shimmer effect */}
                  <div className="absolute inset-0 loading-shimmer rounded-full"></div>
                </div>
              </div>
              
              {/* Desktop text indicator con zampette */}
              <div className="flex items-center justify-center mt-4 space-x-3">
                {/* Zampetta sinistra */}
                <div className="w-5 h-5 text-green-400 animate-paw-bounce">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                    {/* Zampetta del cane/gatto */}
                    <circle cx="8" cy="7" r="2"/>
                    <circle cx="16" cy="7" r="2"/>
                    <circle cx="6" cy="12" r="1.5"/>
                    <circle cx="18" cy="12" r="1.5"/>
                    <ellipse cx="12" cy="16" rx="4" ry="3"/>
                  </svg>
                </div>
                
                <span className="text-sm text-gray-600 font-medium">
                  Analizzando prodotto...
                </span>
                
                {/* Zampetta destra */}
                <div className="w-5 h-5 text-orange-400 animate-paw-wiggle" style={{ animationDelay: '0.5s' }}>
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                    {/* Zampetta del cane/gatto */}
                    <circle cx="8" cy="7" r="2"/>
                    <circle cx="16" cy="7" r="2"/>
                    <circle cx="6" cy="12" r="1.5"/>
                    <circle cx="18" cy="12" r="1.5"/>
                    <ellipse cx="12" cy="16" rx="4" ry="3"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Risultato analisi */}
      {analysisResult && (
        <div className="w-full mt-4" data-analysis-card>
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
    </>
  );
};

export default HeroSection;