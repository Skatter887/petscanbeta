
import HeroContent from './HeroContent';
import HeroStats from './HeroStats';
import ProductEvaluationCard from './ProductAnalysisCard';
import { useState, useEffect, useRef } from 'react';
import { Search, ScanLine, X } from 'lucide-react';
import { useProductAnalysis } from '@/hooks/useProductAnalysis';
import BarcodeScanner from './BarcodeScanner';

const CATEGORIES = [
  'Tutte',
  'Cani',
  'Gatti',
  // ...altre categorie se vuoi
];

// Animazioni floating per avatar
const floatingAnimations = [
  'animate-float-slow',
  'animate-float-medium',
  'animate-float-fast',
  'animate-float-center',
  'animate-float-medium',
  'animate-float-slow',
  'animate-float-fast',
];

function getRandomUnique(arr: string[], n: number) {
  const shuffled = arr.slice().sort(() => 0.5 - Math.random());
  return shuffled.slice(0, n);
}

function getRandomUniqueOrRepeat(arr: string[], n: number) {
  // Filtra solo immagini realmente valide
  const valid = arr.filter(img => img && img.startsWith('http'));
  if (valid.length === 0) return Array(n).fill('https://placehold.co/200x200?text=Prodotto');
  // Ricicla ciclicamente se meno di n
  const result = [];
  let i = 0;
  while (result.length < n) {
    result.push(valid[i % valid.length]);
    i++;
  }
  // Shuffle per non avere sempre la stessa sequenza
  for (let j = result.length - 1; j > 0; j--) {
    const k = Math.floor(Math.random() * (j + 1));
    [result[j], result[k]] = [result[k], result[j]];
  }
  return result;
}

function getExactlyNProductImages(arr: string[], n: number) {
  // Filtra solo immagini prodotto realmente valide
  const valid = arr.filter(img => img && img.startsWith('http'));
  if (valid.length === 0) return Array(n).fill(''); // fallback estremo, ma non succede mai con db reale
  // Ricicla ciclicamente se meno di n
  const result = [];
  let i = 0;
  while (result.length < n) {
    result.push(valid[i % valid.length]);
    i++;
  }
  return result;
}

function getExactlyNProductImagesNoDuplicates(arr: string[], n: number) {
  // Filtra solo immagini prodotto realmente valide
  const valid = arr.filter(img => img && img.startsWith('http'));
  // Shuffle random ad ogni reload
  const shuffled = valid.slice().sort(() => 0.5 - Math.random());
  if (shuffled.length >= n) return shuffled.slice(0, n);
  // Se meno di n, ricicla ma mai duplicati consecutivi
  const result = [];
  let i = 0;
  while (result.length < n) {
    const next = shuffled[i % shuffled.length];
    if (result.length === 0 || result[result.length - 1] !== next) {
      result.push(next);
    } else {
      // Se duplicato consecutivo, prendi il successivo
      result.push(shuffled[(i + 1) % shuffled.length]);
      i++;
    }
    i++;
  }
  return result;
}

const getPawLayout = (isMobile: boolean) =>
  isMobile
    ? [
        { x: '50%', y: '0%', size: 'w-20 h-20', z: 'z-30' }, // centrale grande
        { x: '18%', y: '18%', size: 'w-12 h-12', z: 'z-20' }, // medio sx
        { x: '82%', y: '18%', size: 'w-16 h-16', z: 'z-20' }, // medio dx
        { x: '10%', y: '45%', size: 'w-10 h-10', z: 'z-10' }, // piccolo sx
        { x: '90%', y: '45%', size: 'w-14 h-14', z: 'z-10' }, // piccolo dx
      ]
    : [
        { x: '50%', y: '0%', size: 'w-12 h-12 md:w-32 md:h-32', z: 'z-30' },
        { x: '30%', y: '10%', size: 'w-8 h-8 md:w-20 md:h-20', z: 'z-20' },
        { x: '70%', y: '10%', size: 'w-8 h-8 md:w-20 md:h-20', z: 'z-20' },
        { x: '15%', y: '35%', size: 'w-6 h-6 md:w-14 md:h-14', z: 'z-10' },
        { x: '85%', y: '35%', size: 'w-6 h-6 md:w-14 md:h-14', z: 'z-10' },
        { x: '35%', y: '40%', size: 'w-8 h-8 md:w-16 md:h-16', z: 'z-10' },
        { x: '65%', y: '40%', size: 'w-8 h-8 md:w-16 md:h-16', z: 'z-10' },
      ];

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
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const [productSuggestions, setProductSuggestions] = useState<{label: string, value: string}[]>([]);

  const {
    analysisResult,
    isLoading: analysisLoading,
    noResults,
    searchResults,
    handleProductAnalysis,
    handleProductSelect,
    reset,
  } = useProductAnalysis();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    fetch('/data/petscan_main.json')
      .then(res => res.json())
      .then((data: any[]) => {
        const allImages = data
          .map(p => (typeof p.images === 'string' ? p.images.split(',')[0].trim() : ''))
          .filter(img => img && img.startsWith('http'));
        const n = isMobile ? 5 : 7;
        setProductImages(getExactlyNProductImagesNoDuplicates(allImages, n));
        setProductCount(data.length);
        // Unisci brand e title per suggerimenti
        setProductSuggestions(
          data
            .filter(p => p.title && p.brand)
            .map(p => ({
              label: `${p.brand} - ${p.title}`,
              value: `${p.brand} - ${p.title}`
            }))
        );
      });
  }, [isMobile]);

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
    ? productSuggestions.filter(sugg => sugg.label.toLowerCase().includes(search.toLowerCase())).slice(0, 8)
    : [];

  const pawLayout = getPawLayout(isMobile);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleProductAnalysis(search);
  };

  const handleAnalyzeClick = () => {
    handleProductAnalysis(search);
  };

  const handleScan = (barcode: string) => {
    setShowScanner(false);
    setSearch(barcode);
    handleProductAnalysis(barcode);
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center px-2 md:px-4 py-4 md:py-16 bg-gradient-to-br from-yellow-200 via-orange-200 to-green-200 rounded-3xl shadow-xl overflow-hidden">
      {/* Avatar circles */}
      <div className="absolute left-0 top-0 w-full h-40 md:h-64 pointer-events-none select-none">
        {pawLayout.map((layout, i) => (
          <img
            key={i}
            src={productImages[i] || ''}
            alt="avatar prodotto"
            className={`absolute rounded-full border-4 border-white shadow-lg object-cover bg-white/70 ${layout.size} ${layout.z} ${floatingAnimations[i]}`}
            style={{
              left: layout.x,
              top: layout.y,
              transform: 'translate(-50%, 0)',
            }}
          />
        ))}
      </div>

      <div className="container mx-auto max-w-3xl relative z-20 flex flex-col items-center justify-center pt-20 md:pt-36 pb-2 md:pb-4 md:items-center md:justify-center md:text-center gap-2 md:gap-8">
        {/* Hero Content (testo invariato) */}
        <HeroContent 
          onAnalyzeClick={handleAnalyzeClick}
          onExamplesClick={() => {}}
        />
        {/* Statistiche centrate */}
        <div className="w-full flex justify-center mt-4 mb-2 md:mt-8">
          <HeroStats />
        </div>

        {/* Barra di ricerca */}
        <form
          onSubmit={handleSubmit}
          className={`w-full max-w-lg mx-auto flex flex-row items-center gap-0 mt-0 md:mt-8 mb-2 md:mb-8 shadow-lg border border-white/40 relative overflow-hidden ${showScanner ? 'bg-white/80 backdrop-blur-xl rounded-3xl py-6 px-4' : 'bg-white/90 rounded-full py-3 md:py-5 px-2 md:px-6 backdrop-blur-md min-h-[60px] md:min-h-[64px]'}
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
              className="flex items-center justify-center bg-gradient-to-br from-green-400 to-orange-400 text-white rounded-full w-12 h-12 md:w-14 md:h-14 shadow-lg hover:scale-110 hover:shadow-xl transition-all duration-200 mr-2 md:mr-3 focus:outline-none focus:ring-2 focus:ring-green-400"
              onClick={() => setShowScanner(true)}
              aria-label="Scansiona barcode"
              tabIndex={0}
              style={{ fontSize: 28, WebkitTapHighlightColor: 'transparent', touchAction: 'manipulation' }}
            >
              <ScanLine className="w-7 h-7 md:w-8 md:h-8" style={{ display: 'block' }} />
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
                className="flex-1 bg-transparent outline-none px-3 md:px-4 py-2 text-base md:text-2xl rounded-full placeholder-gray-400 min-w-0"
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
              className="flex items-center justify-center bg-gradient-to-br from-orange-400 to-green-400 text-white rounded-full w-12 h-12 md:w-14 md:h-14 shadow-lg hover:scale-110 hover:shadow-xl transition-all duration-200 ml-2 md:ml-3 focus:outline-none focus:ring-2 focus:ring-orange-400"
              disabled={analysisLoading || !search.trim()}
              aria-label="Cerca"
              tabIndex={0}
              style={{ fontSize: 28, WebkitTapHighlightColor: 'transparent', touchAction: 'manipulation' }}
            >
              <Search className="w-7 h-7 md:w-8 md:h-8" style={{ display: 'block' }} />
            </button>
          )}
          {/* Autocomplete suggestions */}
          {showSuggestions && filteredSuggestions.length > 0 && !showScanner && (
            <div ref={suggestionsRef} className="absolute left-0 top-full w-full max-w-lg bg-white border border-gray-200 rounded-b-2xl shadow-lg z-30 mt-1 overflow-auto max-h-64">
              {filteredSuggestions.map((suggestion, idx) => (
                <button
                  key={idx}
                  type="button"
                  className="w-full text-left px-4 py-2 hover:bg-green-50 text-gray-800 text-base border-b border-gray-100 last:border-b-0 transition-colors"
                  onClick={() => {
                    setSearch(suggestion.value);
                    setShowSuggestions(false);
                    handleProductAnalysis(suggestion.value);
                  }}
                  tabIndex={0}
                  style={{ WebkitTapHighlightColor: 'transparent', touchAction: 'manipulation' }}
                >
                  {suggestion.label}
                </button>
              ))}
            </div>
          )}
        </form>

        {/* Risultato analisi */}
        {analysisResult && (
          <div className="w-full mt-8">
            <ProductEvaluationCard result={analysisResult} />
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
        {/* Nessun risultato */}
        {noResults && !analysisLoading && (
          <div className="w-full mt-8 text-center text-red-500 font-semibold">Nessun prodotto trovato.</div>
        )}
      </div>
    </section>
  );
};

export default HeroSection;
