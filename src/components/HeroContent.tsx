
import React from 'react';

interface HeroContentProps {
  onAnalyzeClick: () => void;
  onExamplesClick: () => void;
}

const HeroContent: React.FC<HeroContentProps> = ({ onAnalyzeClick, onExamplesClick }) => {
  return (
    <div className="flex flex-col gap-4 items-center text-center w-full">
      <h1 className="text-3xl md:text-6xl font-extrabold text-gray-900 leading-tight">
        Il cibo che dai è davvero <span className="text-[#22c55e]">sano</span>?
      </h1>
      <p className="text-lg md:text-xl text-gray-700 max-w-2xl mx-auto">
        Scopri in pochi secondi se l'alimentazione del tuo cane o gatto è sicura, adatta e salutare. Analisi personalizzata basata su ingredienti, età, peso e condizioni di salute.
      </p>
      <div className="flex flex-col md:flex-row gap-4 justify-center items-center w-full">
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

