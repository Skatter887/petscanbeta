import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import SEOHead from '@/components/SEOHead';

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <SEOHead
        title="Pagina non trovata - 404 - PetScan"
        description="La pagina che stai cercando non esiste. Torna alla home di PetScan per analizzare l'alimentazione del tuo animale."
        canonicalUrl="https://mypetscan.it/404"
      />
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-4">Oops! Pagina non trovata</p>
        <a href="/" className="text-blue-500 hover:text-blue-700 underline">
          Torna alla Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
