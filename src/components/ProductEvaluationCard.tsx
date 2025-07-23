
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star, Heart, Shield, Award, Brain, BookOpen } from 'lucide-react';
import { productEvaluations, getStatusColor, type ProductEvaluation } from './ProductEvaluationData';

const ProductEvaluationCard = () => {
  const [currentExample, setCurrentExample] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setCurrentExample(prev => (prev + 1) % productEvaluations.length);
    }, 5500);
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const nextExample = () => {
    setIsAutoPlaying(false);
    setCurrentExample(prev => (prev + 1) % productEvaluations.length);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const prevExample = () => {
    setIsAutoPlaying(false);
    setCurrentExample(prev => (prev - 1 + productEvaluations.length) % productEvaluations.length);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const selectExample = (index: number) => {
    setIsAutoPlaying(false);
    setCurrentExample(index);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const currentProduct = productEvaluations[currentExample];

  return (
    <div className="relative mb-12 sm:mb-14 md:mb-16 max-w-xl mx-auto">
      {/* Enhanced floating background elements */}
      <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute bg-gradient-to-br from-orange-200 to-orange-300 rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-blob" style={{
          top: '5%',
          left: '5%',
          width: '30%',
          height: '30%'
        }}></div>
        <div className="absolute bg-gradient-to-br from-green-200 to-green-300 rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-blob" style={{
          top: '20%',
          right: '10%',
          width: '25%',
          height: '25%'
        }}></div>
        <div className="absolute bg-gradient-to-br from-blue-200 to-blue-300 rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-blob" style={{
          bottom: '10%',
          left: '20%',
          width: '35%',
          height: '35%'
        }}></div>
        <div className="absolute bg-gradient-to-br from-pink-200 to-pink-300 rounded-full mix-blend-multiply filter blur-2xl opacity-15 animate-blob animation-delay-6000" style={{
          bottom: '30%',
          right: '15%',
          width: '20%',
          height: '20%'
        }}></div>
      </div>
      
      {/* Product Card - REMOVED height constraints to prevent overflow */}
      <div className="bg-gradient-to-br from-white via-white to-orange-50/30 rounded-2xl shadow-xl border border-orange-100/70 relative z-10 transition-all duration-700 backdrop-blur-sm overflow-hidden" style={{
        boxShadow: '0 8px 28px 0 rgba(28,90,62,0.10)'
      }}>
        {/* Decorative corners */}
        <div className="absolute top-0 right-0 w-14 h-14 bg-gradient-to-bl from-orange-100/40 to-transparent rounded-bl-2xl"></div>
        <div className="absolute bottom-0 left-0 w-10 h-10 bg-gradient-to-tr from-green-100/40 to-transparent rounded-tr-2xl"></div>
        
        {/* Content with proper spacing to prevent overflow */}
        <div className="p-6 sm:p-7 md:p-8 relative z-10">
          {/* Navigation controls */}
          <div className="flex justify-between items-center mb-4">
            <button onClick={prevExample} className="group w-7 h-7 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-orange-50 to-orange-100 hover:from-orange-100 hover:to-orange-200 border border-orange-200/60 flex items-center justify-center transition-all duration-300 shadow group-hover:scale-105" aria-label="Prodotto precedente">
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600 group-hover:text-orange-700 transition-colors" />
            </button>
            <div className="flex items-center space-x-1 sm:space-x-2 bg-white/80 backdrop-blur-sm rounded-full px-2 py-1 shadow border border-gray-100">
              {productEvaluations.map((_, index) => (
                <button
                  key={index}
                  onClick={() => selectExample(index)}
                  className={`relative transition-all duration-500 rounded-full ${
                    index === currentExample
                      ? 'w-6 h-2 bg-gradient-to-r from-orange-400 to-green-500 shadow'
                      : 'w-2 h-2 bg-gray-300 hover:bg-gray-400'
                  }`}
                  aria-label={`Vai al prodotto ${index + 1}`}
                >
                  {index === currentExample && (
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-green-400 rounded-full animate-pulse opacity-50"></div>
                  )}
                </button>
              ))}
            </div>
            <button onClick={nextExample} className="group w-7 h-7 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 border border-green-200/60 flex items-center justify-center transition-all duration-300 shadow group-hover:scale-105" aria-label="Prodotto successivo">
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 group-hover:text-green-700 transition-colors" />
            </button>
          </div>

          {/* AI Technology Badge */}
          <div className="bg-gradient-to-r from-blue-50/80 to-purple-50/80 rounded-lg p-2 mb-4 border border-blue-200/30">
            <div className="flex items-center justify-center space-x-2">
              <Brain className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />
              <span className="text-xs sm:text-sm font-medium text-gray-700">Analisi AI + Studi Peer-Reviewed</span>
              <BookOpen className="w-3 h-3 sm:w-4 sm:h-4 text-purple-600" />
            </div>
          </div>

          {/* Product info and grade */}
          <div className="flex flex-row gap-3 sm:gap-4 justify-between items-center mb-4">
            {/* Product info */}
            <div className="flex items-start space-x-2 min-w-0 flex-1">
              <div className="relative group">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600 rounded-xl flex items-center justify-center p-0.5 transition-all duration-500 shadow group-hover:scale-105">
                  <img src={currentProduct.image} alt={currentProduct.product} className="w-full h-full object-cover rounded-lg transition-all duration-500 group-hover:scale-105" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gradient-to-br from-green-400 to-green-500 rounded-full flex items-center justify-center shadow">
                  <Shield className="w-2.5 h-2.5 text-white" />
                </div>
              </div>
              <div className="min-w-0 flex flex-col justify-center py-1">
                <div className="flex items-center space-x-1 mb-0.5">
                  <h3 className="font-bold text-gray-900 text-base sm:text-lg truncate">{currentProduct.product}</h3>
                  <Award className="w-3 h-3 text-orange-500 flex-shrink-0" />
                </div>
                <p className="text-gray-600 text-xs sm:text-sm font-medium truncate mb-0.5">{currentProduct.brand}</p>
                <div className="flex items-center space-x-1">
                  <Heart className="w-2.5 h-2.5 text-pink-500" />
                  <p className="text-gray-500 text-xs truncate">{currentProduct.animal}</p>
                </div>
              </div>
            </div>
            
            {/* Grade box */}
            <div className="flex-shrink-0 flex items-center">
              <div className="relative group">
                <div className="h-12 w-12 sm:h-14 sm:w-14 bg-gradient-to-br from-green-400 via-green-500 to-green-600 rounded-xl shadow-md transition-all duration-500 flex flex-col items-center justify-center group-hover:scale-105 group-hover:shadow-xl relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-white/10 to-transparent rounded-xl"></div>
                  <div className="absolute inset-0 bg-gradient-to-tl from-green-600/20 to-transparent rounded-xl"></div>
                  <div className="relative z-10 text-center">
                    <div className="text-white font-bold text-lg leading-none mb-0.5 drop-shadow">{currentProduct.grade}</div>
                    <div className="text-white/95 font-semibold text-xs leading-none">{currentProduct.score}/100</div>
                  </div>
                  <Star className="absolute top-1 right-1 w-2 h-2 text-white/40 animate-pulse" />
                  <Star className="absolute bottom-1 left-1 w-1.5 h-1.5 text-white/30 animate-pulse delay-1000" />
                  <div className="absolute top-0.5 left-0.5 w-0.5 h-0.5 bg-white/50 rounded-full animate-ping"></div>
                  <div className="absolute bottom-1 right-1 w-0.5 h-0.5 bg-white/40 rounded-full animate-ping delay-500"></div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Evaluations - with proper height management */}
          <div className="bg-gradient-to-r from-gray-50/80 to-white/80 backdrop-blur-sm rounded-xl p-3 mb-4 border border-gray-100/40 shadow-inner">
            <div className="space-y-2">
              {currentProduct.evaluations.map((evaluation, index) => (
                <div key={index} className="transition-all duration-500 ease-in-out group hover:scale-[1.01]">
                  <div className="flex items-center justify-between py-1 px-2 rounded-lg hover:bg-white/60 transition-all duration-300">
                    <div className="flex items-center space-x-2">
                      <div className={`w-1.5 h-1.5 rounded-full ${
                        evaluation.color === 'green' ? 'bg-green-500' : 
                        evaluation.color === 'blue' ? 'bg-blue-500' : 'bg-orange-500'
                      } shadow-sm`}></div>
                      <h4 className="font-semibold text-gray-900 text-xs sm:text-sm group-hover:text-gray-700 transition-colors">{evaluation.name}</h4>
                    </div>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full transition-all duration-300 ${
                      evaluation.color === 'green' ? 'bg-green-100 text-green-700 group-hover:bg-green-200' :
                      evaluation.color === 'blue' ? 'bg-blue-100 text-blue-700 group-hover:bg-blue-200' :
                      'bg-orange-100 text-orange-700 group-hover:bg-orange-200'
                    }`}>
                      {evaluation.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recommendation - properly contained within card */}
          <div className="relative overflow-hidden rounded-xl mb-4">
            <div className="absolute inset-0 bg-gradient-to-r from-green-50 via-green-50 to-emerald-50"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-green-100/15 to-transparent"></div>
            <div className="relative p-3 border border-green-200/40 transition-all duration-500 group-hover:border-green-300/50">
              <div className="flex items-start space-x-2">
                <div className="flex-shrink-0">
                  <div className="w-4 h-4 sm:w-5 sm:h-5 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center shadow group-hover:scale-105 transition-transform duration-300">
                    <span className="text-white text-xs font-bold">✓</span>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-1 mb-1">
                    <h4 className="font-bold text-green-800 text-xs sm:text-sm">Raccomandazione PetScan</h4>
                    <Star className="w-2.5 h-2.5 text-green-600 flex-shrink-0" />
                  </div>
                  <p className="text-green-700 text-xs sm:text-sm leading-snug font-medium">{currentProduct.recommendation}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Animal type indicator - properly contained at bottom */}
          <div className="text-center">
            <div className="inline-flex items-center justify-center">
              <span className={`inline-flex items-center px-3 py-1 sm:px-4 sm:py-1 rounded-xl text-xs sm:text-sm font-bold transition-all duration-500 shadow hover:shadow-md transform hover:scale-105 ${
                currentProduct.type === 'cane' ? 
                'bg-gradient-to-r from-blue-100 to-blue-50 text-blue-800 border border-blue-200/50 hover:from-blue-200 hover:to-blue-100' : 
                'bg-gradient-to-r from-orange-100 to-orange-50 text-orange-800 border border-orange-200/50 hover:from-orange-200 hover:to-orange-100'
              }`}>
                <span className="text-base sm:text-lg mr-1.5">{currentProduct.type === 'cane' ? '🐕' : '🐱'}</span>
                {currentProduct.label}
                <Heart className="w-3 h-3 ml-1 text-pink-500" />
              </span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom floating elements */}
      <div className="absolute bottom-0 left-0 w-full h-full" aria-hidden="true">
        <div className="absolute bg-gradient-to-br from-purple-200 to-purple-300 rounded-full mix-blend-multiply filter blur-2xl opacity-15 animate-blob animation-delay-8000" style={{
          top: '60%',
          right: '5%',
          width: '28%',
          height: '28%'
        }}></div>
        <div className="absolute bg-gradient-to-br from-yellow-200 to-yellow-300 rounded-full mix-blend-multiply filter blur-2xl opacity-10 animate-blob animation-delay-10000" style={{
          bottom: '5%',
          left: '15%',
          width: '20%',
          height: '20%'
        }}></div>
      </div>
    </div>
  );
};

export default ProductEvaluationCard;
