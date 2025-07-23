import { useEffect, useState } from 'react';

const HeroStats = () => {
  const [productCount, setProductCount] = useState<number | null>(null);

  useEffect(() => {
    fetch('/data/petscan_main.json')
      .then(res => res.json())
      .then((data: any[]) => setProductCount(data.length));
  }, []);

  return (
    <div className="flex flex-row items-center justify-center text-center gap-4 sm:gap-8 w-full">
      <div className="flex flex-col items-center justify-center flex-1">
        <div className="text-xl sm:text-3xl font-bold text-gray-900">
          {productCount !== null ? productCount.toLocaleString('it-IT') + '+' : '...'}
        </div>
        <div className="text-base sm:text-lg text-gray-600">Prodotti analizzati</div>
      </div>
      <div className="flex flex-col items-center justify-center flex-1">
        <div className="text-xl sm:text-3xl font-bold text-gray-900">5.000+</div>
        <div className="text-base sm:text-lg text-gray-600">Pet genitori felici</div>
      </div>
      <div className="flex flex-col items-center justify-center flex-1">
        <div className="text-xl sm:text-3xl font-bold text-gray-900">100%</div>
        <div className="text-base sm:text-lg text-gray-600">Gratuito</div>
      </div>
    </div>
  );
};

export default HeroStats;
