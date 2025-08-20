
import React, { useRef, useState } from 'react';
import HeroStats from './HeroStats';
import { Search, ScanLine, Smartphone, Monitor, X, PawPrint } from 'lucide-react';

interface HeroContentProps {
  onAnalyzeClick: () => void;
  onExamplesClick: () => void;
  isAnalysisActive?: boolean;
  search?: string;
  onSearchChange?: (value: string) => void;
  onSearchSubmit?: (e: React.FormEvent) => void;
  analysisLoading?: boolean;
  showSuggestions?: boolean;
  suggestions?: any[];
  selectedIndex?: number;
  onSuggestionSelect?: (suggestion: any) => void;
  onSuggestionKeyDown?: (e: React.KeyboardEvent) => any;
  autocompleteLoading?: boolean;
  onScanClick?: () => void;
}

const HeroContent: React.FC<HeroContentProps> = ({ 
  onAnalyzeClick, 
  onExamplesClick, 
  isAnalysisActive = false,
  search = '',
  onSearchChange,
  onSearchSubmit,
  analysisLoading = false,
  showSuggestions = false,
  suggestions = [],
  selectedIndex = 0,
  onSuggestionSelect,
  onSuggestionKeyDown,
  autocompleteLoading = false,
  onScanClick
}) => {
  const desktopInputRef = useRef<HTMLInputElement>(null);
  const [showScannerPopup, setShowScannerPopup] = useState(false);

  const handleScannerClick = () => {
    setShowScannerPopup(true);
  };

  const closeScannerPopup = () => {
    setShowScannerPopup(false);
  };

  return (
    <div className="flex flex-col gap-0 md:gap-4 items-center text-center w-full hero-content-webapp" style={{ marginTop: 0, paddingTop: 0 }}>
      <h1 className={`${isAnalysisActive ? 'text-xl md:text-4xl' : 'text-2xl md:text-6xl'} font-black leading-tight px-2 relative max-w-[400px] md:max-w-[600px] mx-auto`} style={{ marginTop: 0, paddingTop: 0 }}>
        <span className="inline-block">
          <span className="text-gray-900 animate-in fade-in duration-700">Il cibo che dai è</span>
          <br className="block md:hidden" />
          <span className="text-gray-900 animate-in fade-in duration-700 delay-200"> davvero </span>
          <span className="relative inline-block group animate-in fade-in duration-700 delay-500">
            {/* Background glow effect */}
            <span className="absolute inset-0 bg-gradient-to-r from-green-400 via-green-500 to-orange-400 blur-lg opacity-30 group-hover:opacity-50 transition-all duration-500 animate-pulse"></span>
            
            {/* Main gradient text */}
            <span className="relative bg-gradient-to-r from-green-500 via-green-600 to-orange-500 bg-clip-text text-transparent font-extrabold tracking-tight group-hover:from-green-400 group-hover:to-orange-400 transition-all duration-500">
              sano
            </span>
            
            {/* Animated underline */}
            <span className="absolute -bottom-1 left-0 w-full h-1 bg-gradient-to-r from-green-400 to-orange-400 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></span>
            
            {/* Sparkle effects */}
            <span className="absolute -top-2 -right-2 w-2 h-2 bg-orange-400 rounded-full animate-ping opacity-75"></span>
            <span className="absolute -bottom-2 -left-2 w-1.5 h-1.5 bg-green-400 rounded-full animate-ping opacity-75 delay-300"></span>
          </span>
          <span className="text-gray-900 animate-in fade-in duration-700 delay-700">?</span>
        </span>
      </h1>
      <p className={`${isAnalysisActive ? 'text-sm md:text-lg' : 'text-base md:text-xl'} text-gray-700 max-w-[380px] md:max-w-[500px] mx-auto leading-relaxed mt-0 md:mt-2 px-2`}>
        Scopri in <span className="font-semibold text-gray-800">pochi secondi</span> se l'alimentazione del tuo cane o gatto è{' '}
        <span className="font-medium text-green-600">sicura, adatta e salutare</span>.{' '}
        <span className="font-bold text-gray-900">Analisi con intelligenza artificiale</span>{' '}
        supportata da <span className="font-medium text-gray-800">studi scientifici e ricerca peer-reviewed</span>.
      </p>
      
      {/* Barra di ricerca desktop - visibile solo su desktop, posizionata tra paragrafo e pulsanti */}
      <div id="scannerizza-form-desktop-hero" className="hidden md:block w-full max-w-lg mx-auto mt-8 mb-6 relative">
        {/* Animazione bordo miccia desktop */}
        <div className="absolute inset-0 rounded-full search-border-animation" style={{ zIndex: 1 }} />
        
        <form
          onSubmit={onSearchSubmit}
          className="relative flex w-full flex-row items-center gap-0 shadow-lg border border-white/40 overflow-visible bg-white/90 rounded-full py-5 px-6 backdrop-blur-md min-h-[64px] transition-all duration-200"
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
          <button
            type="button"
            data-scan-button="true"
            className="flex items-center justify-center bg-gradient-to-br from-green-400 to-orange-400 text-white rounded-full w-14 h-14 shadow-lg hover:scale-110 hover:shadow-xl transition-all duration-200 mr-3 focus:outline-none focus:ring-2 focus:ring-green-400"
            onClick={handleScannerClick}
            aria-label="Scansiona barcode"
            tabIndex={0}
            style={{ fontSize: 28, WebkitTapHighlightColor: 'transparent', touchAction: 'manipulation' }}
          >
            <ScanLine className="w-8 h-8" style={{ display: 'block' }} />
          </button>
          
          {/* Input di ricerca */}
          <input
            ref={desktopInputRef}
            type="text"
            inputMode="text"
            className="flex-1 bg-transparent outline-none px-4 py-2 text-2xl rounded-full placeholder-gray-400 min-w-0"
            placeholder="Inserisci barcode o nome prodotto"
            value={search}
            onChange={e => onSearchChange?.(e.target.value)}
            onKeyDown={e => onSuggestionKeyDown?.(e)}
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
          
          {/* Search icon destra */}
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
        </form>
        
        {/* Autocomplete suggestions per desktop */}
        {showSuggestions && suggestions.length > 0 && (
          <div 
            className="absolute left-0 top-full w-full max-w-lg bg-white border border-gray-200 rounded-b-2xl shadow-lg z-50 mt-1 overflow-auto max-h-64"
            style={{ marginTop: '1px' }}
          >
            {suggestions.map((suggestion, idx) => (
              <div
                key={`desktop-hero-${suggestion.type}-${suggestion.ean}-${idx}`}
                data-autocomplete-suggestion
                className={`w-full text-left px-4 py-3 text-gray-800 text-sm border-b border-gray-100 last:border-b-0 flex flex-col cursor-pointer transition-all duration-150 ease-in-out ${
                  selectedIndex === idx ? 'bg-green-50 border-green-200' : 'hover:bg-gray-100'
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onSuggestionSelect?.(suggestion);
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
      
      {/* Statistiche desktop - posizionate sotto la barra di ricerca */}
      <div className="hidden md:flex justify-center mt-4 mb-6">
        <HeroStats />
      </div>
      
      {/* Pulsanti - visibili solo su desktop */}
      <div className="hidden md:flex flex-col md:flex-row gap-4 justify-center items-center w-full">
        <button
          onClick={onAnalyzeClick}
          className="bg-[#22c55e] hover:bg-[#16a34a] text-white font-bold rounded-full px-8 py-4 text-lg md:text-xl shadow-md transition-all flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-[#22c55e] focus:ring-offset-2"
          style={{ boxShadow: '0 2px 12px 0 #22c55e33' }}
        >
          Analizza il cibo ora
          <span className="ml-2">→</span>
        </button>
        <button
          onClick={onExamplesClick}
          className="border-2 border-[#22c55e] text-[#22c55e] font-bold rounded-full px-8 py-4 text-lg md:text-xl bg-white hover:bg-[#e6f9f0] hover:text-[#16a34a] transition-all flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-[#22c55e] focus:ring-offset-2"
        >
          Vedi esempi
        </button>
      </div>

      {/* Pop-up Scanner Pet-Friendly - solo per desktop */}
      {showScannerPopup && (
        <div className="hidden md:block fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full mx-4 overflow-hidden animate-in zoom-in-95 duration-300">
            {/* Header con zampette decorative */}
            <div className="relative bg-gradient-to-br from-green-50 to-orange-50 p-6 text-center">
              {/* Zampette decorative in alto */}
              <div className="flex justify-center space-x-2 mb-4">
                <PawPrint className="w-6 h-6 text-green-400 animate-bounce" />
                <PawPrint className="w-6 h-6 text-orange-400 animate-bounce" style={{ animationDelay: '0.2s' }} />
                <PawPrint className="w-6 h-6 text-green-400 animate-bounce" style={{ animationDelay: '0.4s' }} />
              </div>
              
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                🐾 Scansiona il Barcode! 🐾
              </h3>
              <p className="text-gray-600 text-sm">
                Per la migliore esperienza di scansione...
              </p>
            </div>

            {/* Contenuto principale */}
            <div className="p-6 space-y-6">
              {/* Opzione 1: Usa il cellulare */}
              <div className="flex items-start space-x-4 p-4 bg-green-50 rounded-2xl border border-green-200 hover:bg-green-100 transition-colors cursor-pointer group">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
                  <Smartphone className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-green-800 text-lg mb-1">
                    📱 Usa il tuo cellulare!
                  </h4>
                  <p className="text-green-700 text-sm leading-relaxed">
                    Apri PetScan sul tuo smartphone per una scansione barcode perfetta e veloce! 
                    La fotocamera del telefono è ottimizzata per questo tipo di scansione.
                  </p>
                </div>
              </div>

              {/* Opzione 2: Continua da desktop */}
              <div className="flex items-start space-x-4 p-4 bg-orange-50 rounded-2xl border border-orange-200 hover:bg-orange-100 transition-colors cursor-pointer group">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
                  <Monitor className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-orange-800 text-lg mb-1">
                    💻 Continua da desktop
                  </h4>
                  <p className="text-orange-700 text-sm leading-relaxed">
                    Scrivi il numero del barcode o il nome del prodotto nella barra di ricerca qui sopra. 
                    Ti aiuteremo ad analizzare il cibo del tuo pet! 🐕🐱
                  </p>
                </div>
              </div>

              {/* Messaggio motivazionale */}
              <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border border-blue-200">
                <div className="flex justify-center mb-2">
                  <PawPrint className="w-5 h-5 text-blue-500 animate-pulse" />
                </div>
                <p className="text-blue-700 text-sm font-medium">
                  "Ogni scansione aiuta a rendere più felici e sani i nostri amici a quattro zampe! 🐾"
                </p>
              </div>
            </div>

            {/* Footer con pulsante di chiusura */}
            <div className="bg-gray-50 p-4 flex justify-center">
              <button
                onClick={closeScannerPopup}
                className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-500 to-orange-500 text-white font-semibold rounded-full hover:from-green-600 hover:to-orange-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <span>Capito! 👍</span>
                <PawPrint className="w-4 h-4" />
              </button>
            </div>

            {/* Pulsante di chiusura in alto a destra */}
            <button
              onClick={closeScannerPopup}
              className="absolute top-4 right-4 w-8 h-8 bg-white/80 hover:bg-white rounded-full flex items-center justify-center text-gray-600 hover:text-gray-800 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HeroContent;

