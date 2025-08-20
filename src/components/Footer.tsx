
import { Mail, Heart, Search, Brain, BookOpen, ExternalLink } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Footer = () => {
  const navigate = useNavigate();

  const scrollToSection = (sectionId: string) => {
    if (window.location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const navigateToHome = () => {
    navigate('/');
  };

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Main Footer Content */}
      <div className="container mx-auto max-w-7xl px-4 py-12">
        {/* Top Section - Logo & Description */}
        <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between mb-12 gap-8">
          {/* Logo & Brand */}
          <div className="text-center lg:text-left">
            <div 
              className="flex items-center justify-center lg:justify-start space-x-3 mb-6 cursor-pointer hover:opacity-80 transition-all duration-300 hover:scale-105" 
              onClick={navigateToHome}
            >
              <img src="/logo_no_cont.png" alt="PetScan Logo" className="w-16 h-16 lg:w-20 lg:h-20 object-contain" />
              <div className="flex flex-col">
                <span className="text-3xl lg:text-4xl font-bold leading-tight">
                  <span style={{ color: '#81e5d0' }}>Pet</span>
                  <span style={{ color: '#fdc595' }}>Scan</span>
                </span>
                <span className="text-sm text-gray-400 font-medium">Analisi Nutrizionale Intelligente</span>
              </div>
            </div>
            
            <p className="text-gray-300 leading-relaxed max-w-md text-center lg:text-left">
              Il primo servizio in Italia per analizzare l'alimentazione di cani e gatti. 
              Perché anche i nostri amici a quattro zampe meritano il meglio.
            </p>
          </div>

          {/* Quick Links Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Navigation Links */}
            <div>
              <h4 className="font-semibold text-lg mb-4 text-teal-400">Navigazione</h4>
              <ul className="space-y-3">
                <li>
                  <button 
                    onClick={() => scrollToSection('come-funziona')} 
                    className="text-gray-300 hover:text-teal-400 transition-colors duration-200 text-left flex items-center group"
                  >
                    <span className="w-2 h-2 bg-teal-400 rounded-full mr-3 group-hover:scale-150 transition-transform"></span>
                    Come funziona
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => scrollToSection('prodotti')} 
                    className="text-gray-300 hover:text-teal-400 transition-colors duration-200 text-left flex items-center group"
                  >
                    <span className="w-2 h-2 bg-teal-400 rounded-full mr-3 group-hover:scale-150 transition-transform"></span>
                    Prodotti analizzati
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => scrollToSection('faq')} 
                    className="text-gray-300 hover:text-teal-400 transition-colors duration-200 text-left flex items-center group"
                  >
                    <span className="w-2 h-2 bg-teal-400 rounded-full mr-3 group-hover:scale-150 transition-transform"></span>
                    FAQ
                  </button>
                </li>

              </ul>
            </div>

            {/* Support Links */}
            <div>
              <h4 className="font-semibold text-lg mb-4 text-orange-400">Supporto</h4>
              <ul className="space-y-3">
                <li>
                  <Link 
                    to="/contacts" 
                    className="text-gray-300 hover:text-orange-400 transition-colors duration-200 flex items-center group"
                  >
                    <span className="w-2 h-2 bg-orange-400 rounded-full mr-3 group-hover:scale-150 transition-transform"></span>
                    Contatti
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/privacy-policy" 
                    className="text-gray-300 hover:text-orange-400 transition-colors duration-200 flex items-center group"
                  >
                    <span className="w-2 h-2 bg-orange-400 rounded-full mr-3 group-hover:scale-150 transition-transform"></span>
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/terms-of-service" 
                    className="text-gray-300 hover:text-orange-400 transition-colors duration-200 flex items-center group"
                  >
                    <span className="w-2 h-2 bg-orange-400 rounded-full mr-3 group-hover:scale-150 transition-transform"></span>
                    Termini di Servizio
                  </Link>
                </li>
                <li>
                  <a 
                    href="mailto:alessandro@mypetscan.it" 
                    className="text-gray-300 hover:text-orange-400 transition-colors duration-200 flex items-center group"
                  >
                    <span className="w-2 h-2 bg-orange-400 rounded-full mr-3 group-hover:scale-150 transition-transform"></span>
                    Email diretta
                  </a>
                </li>
              </ul>
            </div>

            {/* Company Info */}
            <div className="col-span-2 lg:col-span-1">
              <h4 className="font-semibold text-lg mb-4 text-purple-400">Azienda</h4>
              <ul className="space-y-3">
                <li>
                  <Link 
                    to="/chi-ce-dietro" 
                    className="text-gray-300 hover:text-purple-400 transition-colors duration-200 flex items-center group"
                  >
                    <span className="w-2 h-2 bg-purple-400 rounded-full mr-3 group-hover:scale-150 transition-transform"></span>
                    Chi siamo
                  </Link>
                </li>
                <li className="flex items-center text-gray-400">
                  <Heart className="w-4 h-4 mr-2 text-red-400" />
                  <span className="text-sm">Fatto con amore per gli animali</span>
                </li>
              </ul>
            </div>
          </div>
        </div>



        {/* Bottom Section */}
        <div className="border-t border-gray-700/50 pt-8">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
            <div className="text-gray-400 text-sm text-center lg:text-left">
              © 2024 PetScan. Tutti i diritti riservati.
            </div>
            
            <div className="text-gray-400 text-xs text-center lg:text-right max-w-md">
              <p className="mb-1">
                <strong className="text-gray-300">Disclaimer:</strong> PetScan fornisce analisi informative non sostitutive del parere veterinario.
              </p>
              <p>
                Per decisioni importanti sulla salute del tuo animale, consulta sempre un veterinario qualificato.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
