
import { useState, useEffect } from 'react';
import { X, Search, Zap } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const EndPageCTAPopup = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasShown, setHasShown] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    // Prevent multiple triggers
    if (hasShown) return;

    let isScrolling = false;
    let scrollTimeout: NodeJS.Timeout;

    const handleScroll = () => {
      // Prevent multiple rapid calls
      if (isScrolling) return;
      isScrolling = true;

      // Clear existing timeout
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }

      scrollTimeout = setTimeout(() => {
        // Only proceed if popup hasn't been shown yet
        if (hasShown) {
          isScrolling = false;
          return;
        }

        const scrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop;
        const windowHeight = window.innerHeight || document.documentElement.clientHeight;
        const documentHeight = Math.max(
          document.body.scrollHeight,
          document.body.offsetHeight,
          document.documentElement.clientHeight,
          document.documentElement.scrollHeight,
          document.documentElement.offsetHeight
        );
        
        const scrollPosition = scrollY + windowHeight;
        const threshold = isMobile ? documentHeight - 300 : documentHeight - 200;
        
        console.log('Popup scroll check:', {
          scrollY,
          windowHeight,
          documentHeight,
          scrollPosition,
          threshold,
          isMobile,
          hasShown,
          shouldShow: scrollPosition >= threshold && !hasShown
        });

        if (scrollPosition >= threshold && !hasShown) {
          console.log('Showing popup - one time only');
          setIsVisible(true);
          setHasShown(true);
        }
        
        isScrolling = false;
      }, 100); // Debounce scroll events
    };

    // Use only one scroll event listener with passive option
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Check once after component mount with delay for mobile
    const initialCheckTimeout = setTimeout(() => {
      if (!hasShown) {
        handleScroll();
      }
    }, 1500);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
      if (initialCheckTimeout) {
        clearTimeout(initialCheckTimeout);
      }
    };
  }, [hasShown, isMobile]);

  const scrollToAnalysisForm = () => {
    const element = document.getElementById('analisi-form');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsVisible(false);
    }
  };

  const closePopup = () => {
    setIsVisible(false);
  };

  if (!isVisible || hasShown && !isVisible) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 animate-fade-in"
        onClick={closePopup}
        style={{ 
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 40
        }}
      />
      
      {/* Popup - iOS optimized positioning */}
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-scale-in"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 50,
          pointerEvents: 'none'
        }}
      >
        <div 
          className={`bg-white rounded-2xl shadow-2xl border border-gray-200 p-4 sm:p-6 relative overflow-hidden w-full max-w-sm sm:max-w-md mx-auto ${isMobile ? 'max-h-[90vh] overflow-y-auto' : ''}`}
          style={{ 
            pointerEvents: 'auto',
            maxHeight: isMobile ? '90vh' : 'auto',
            transform: 'translateZ(0)',
            WebkitTransform: 'translateZ(0)'
          }}
        >
          {/* Close button */}
          <button
            onClick={closePopup}
            className="absolute top-2 right-2 sm:top-3 sm:right-3 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors z-10"
            aria-label="Chiudi popup"
            style={{ 
              WebkitTapHighlightColor: 'transparent',
              touchAction: 'manipulation'
            }}
          >
            <X className="w-4 h-4 text-gray-600" />
          </button>

          {/* Background gradient accent */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 via-green-500 to-green-600"></div>

          {/* Content */}
          <div className="space-y-3 sm:space-y-4 pt-2">
            {/* Header with icon */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                <Search className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-gray-900 leading-tight">
                  Hai già provato PetScan?
                </h3>
              </div>
            </div>

            {/* Message */}
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
              Scopri subito se il cibo che dai al tuo cane o gatto è davvero sano.
            </p>

            {/* CTA Button */}
            <button
              onClick={scrollToAnalysisForm}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-4 sm:px-6 py-3 rounded-xl font-semibold text-sm sm:text-base shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 flex items-center justify-center space-x-2 active:scale-95"
              style={{ 
                WebkitTapHighlightColor: 'transparent',
                touchAction: 'manipulation'
              }}
            >
              <Zap className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Prova ora la tua valutazione!</span>
            </button>

            {/* Footer note */}
            <p className="text-xs text-gray-500 text-center">
              Analisi gratuita • Risultati immediati
            </p>
          </div>

          {/* Decorative paw prints - hidden on very small screens */}
          <div className="absolute -top-2 -right-2 text-green-200 opacity-30 hidden sm:block">
            <div className="text-2xl">🐾</div>
          </div>
          <div className="absolute -bottom-1 -left-1 text-orange-200 opacity-30 hidden sm:block">
            <div className="text-xl">🐾</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EndPageCTAPopup;
