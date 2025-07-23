
import { Mail, Heart, Search, Brain, BookOpen } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import PetScanLogo from './PetScanLogo';

const Footer = () => {
  const navigate = useNavigate();

  const scrollToSection = (sectionId: string) => {
    // If we're not on the homepage, navigate there first
    if (window.location.pathname !== '/') {
      navigate('/');
      // Wait for navigation to complete, then scroll
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({
            behavior: 'smooth'
          });
        }
      }, 100);
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({
          behavior: 'smooth'
        });
      }
    }
  };

  const navigateToHome = () => {
    navigate('/');
  };

  return (
    <footer className="bg-gray-900 text-white py-16 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          {/* Logo & Description */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-3 mb-4 cursor-pointer hover:opacity-80 transition-opacity" onClick={navigateToHome}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center">
                <PetScanLogo size="sm" />
              </div>
              <span className="text-2xl font-bold">
                <span style={{ color: '#81e5d0' }}>Pet</span>
                <span style={{ color: '#fdc595' }}>Scan</span>
              </span>
            </div>
            <p className="text-gray-400 leading-relaxed mb-6 max-w-md">
              Il primo servizio in Italia per analizzare l'alimentazione di cani e gatti. 
              Perché anche i nostri amici a quattro zampe meritano il meglio.
            </p>
            <div className="flex items-center text-sm text-gray-500">
              <Heart className="w-4 h-4 mr-2 text-red-400" />
              Fatto con amore per gli animali
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Link rapidi</h4>
            <ul className="space-y-3">
              <li>
                <button onClick={() => scrollToSection('come-funziona')} className="text-gray-400 hover:text-green-400 transition-colors text-left">
                  Come funziona
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection('prodotti')} className="text-gray-400 hover:text-green-400 transition-colors text-left">
                  Prodotti analizzati
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection('faq')} className="text-gray-400 hover:text-green-400 transition-colors text-left">
                  FAQ
                </button>
              </li>
              <li>
                <Link to="/scopri-petscan-pro" className="text-gray-400 hover:text-green-400 transition-colors">PetScan</Link>
              </li>
            </ul>
          </div>

          {/* Contact & Legal */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Supporto</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/contacts" className="text-gray-400 hover:text-green-400 transition-colors">
                  Contatti
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="text-gray-400 hover:text-green-400 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms-of-service" className="text-gray-400 hover:text-green-400 transition-colors">
                  Termini di Servizio
                </Link>
              </li>
              <li>
                <a href="mailto:alessandro@mypetscan.it" className="text-gray-400 hover:text-green-400 transition-colors">
                  Contattaci direttamente
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* AI & Scientific Sources Information */}
        <div className="border-t border-gray-800 pt-8 mb-8">
          <div className="bg-gray-800/50 rounded-xl p-4 sm:p-6 border border-gray-700/50">
            <div className="flex items-center justify-center mb-3">
              <div className="flex items-center space-x-2">
                <Brain className="w-5 h-5 text-blue-400" />
                <BookOpen className="w-5 h-5 text-purple-400" />
              </div>
            </div>
            <p className="text-center text-gray-300 text-sm sm:text-base leading-relaxed">
              Le valutazioni PetScan combinano il potenziale dell'<strong className="text-blue-400">intelligenza artificiale più avanzata</strong> con <strong className="text-purple-400">fonti scientifiche peer-reviewed</strong>, per fornire un'analisi oggettiva e aggiornata sulla qualità nutrizionale degli alimenti per cani e gatti.
            </p>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-500 text-sm mb-4 md:mb-0">
              © 2024 PetScan. Tutti i diritti riservati.
            </div>
            
            <div className="text-gray-500 text-sm text-center md:text-right">
              <p className="mb-1">
                <strong>Disclaimer:</strong> PetScan fornisce analisi informative non sostitutive del parere veterinario.
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
