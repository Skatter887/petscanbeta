
import React from 'react';

interface HeroContentProps {
  onAnalyzeClick: () => void;
  onExamplesClick: () => void;
  isAnalysisActive?: boolean;
}

const HeroContent: React.FC<HeroContentProps> = ({ onAnalyzeClick, onExamplesClick, isAnalysisActive = false }) => {
  return (
    <div className="flex flex-col gap-0 md:gap-4 items-center text-center w-full hero-content-webapp" style={{ marginTop: 0, paddingTop: 0 }}>
      <h1 className={`${isAnalysisActive ? 'text-xl md:text-4xl' : 'text-2xl md:text-6xl'} font-black leading-tight px-2 relative max-w-[400px] mx-auto`} style={{ marginTop: 0, paddingTop: 0 }}>
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
      <p className={`${isAnalysisActive ? 'text-sm md:text-lg' : 'text-base md:text-xl'} text-gray-700 max-w-[380px] mx-auto leading-relaxed mt-0 md:mt-2 px-2`}>
        Scopri in <span className="font-semibold text-gray-800">pochi secondi</span> se l'alimentazione del tuo cane o gatto è{' '}
        <span className="font-medium text-green-600">sicura, adatta e salutare</span>.{' '}
        <span className="font-bold text-gray-900">Analisi con intelligenza artificiale</span>{' '}
        supportata da <span className="font-medium text-gray-800">studi scientifici e ricerca peer-reviewed</span>.
      </p>
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
    </div>
  );
};

export default HeroContent;

