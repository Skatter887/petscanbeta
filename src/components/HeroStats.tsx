import { useEffect, useState, useRef } from 'react';

// Hook per animazione contatore semplice
const useCountUp = (end: number, duration: number = 2000, delay: number = 0) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.5 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const timer = setTimeout(() => {
      let start = 0;
      const increment = end / (duration / 16); // 60fps
      
      const counter = setInterval(() => {
        start += increment;
        if (start >= end) {
          setCount(end);
          clearInterval(counter);
        } else {
          setCount(Math.floor(start));
        }
      }, 16);

      return () => clearInterval(counter);
    }, delay);

    return () => clearTimeout(timer);
  }, [isVisible, end, duration, delay]);

  return { count, elementRef };
};

const HeroStats = () => {
  const [productCount, setProductCount] = useState<number | null>(null);

  // Contatori animati che partono da 0
  const { count: analysisCount, elementRef: analysisRef } = useCountUp(5000, 2000, 0);
  const { count: productCountAnimated, elementRef: productRef } = useCountUp(productCount || 1009, 2200, 200);
  const { count: percentageCount, elementRef: percentageRef } = useCountUp(100, 1800, 400);

  useEffect(() => {
    // Carica dati reali per i prodotti
    fetch('/data/petscan_main.json')
      .then(res => res.json())
      .then((data: any[]) => setProductCount(data.length))
      .catch(() => setProductCount(1009)); // Fallback
  }, []);

  return (
    <div className="flex flex-row items-center justify-center text-center gap-4 sm:gap-8 w-full mt-0 max-w-[340px] mx-auto hero-stats-mobile" style={{ position: 'relative', zIndex: 50, marginTop: 0, paddingTop: 0 }}>
      {/* Analisi */}
      <div 
        ref={analysisRef}
        className="flex flex-col items-center justify-center flex-1 min-w-0"
      >
        <div className="text-lg sm:text-3xl font-bold text-gray-900 leading-none">
          {analysisCount.toLocaleString('it-IT')}+
        </div>
        <div className="text-xs sm:text-lg text-gray-600 whitespace-nowrap mt-0.5">Analisi</div>
      </div>

      {/* Prodotti Analizzati */}
      <div 
        ref={productRef}
        className="flex flex-col items-center justify-center flex-1 min-w-0"
      >
        <div className="text-lg sm:text-3xl font-bold text-gray-900 leading-none">
          {productCountAnimated.toLocaleString('it-IT')}+
        </div>
        <div className="text-xs sm:text-lg text-gray-600 whitespace-nowrap mt-0.5">Prodotti</div>
      </div>

      {/* Gratuito */}
      <div 
        ref={percentageRef}
        className="flex flex-col items-center justify-center flex-1 min-w-0"
      >
        <div className="text-lg sm:text-3xl font-bold text-gray-900 leading-none">
          {percentageCount}%
        </div>
        <div className="text-xs sm:text-lg text-gray-600 whitespace-nowrap mt-0.5">Gratuito</div>
      </div>
    </div>
  );
};

export default HeroStats;
