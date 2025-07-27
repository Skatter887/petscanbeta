import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Search, FileText, Heart, HelpCircle, MessageCircle, Menu, X, Settings, Search as SearchBold } from 'lucide-react';
import ContactModal from './ContactModal';
import { useNavigate } from 'react-router-dom';
import PetScanLogo from './PetScanLogo';

const Header = () => {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const navigate = useNavigate();

  const scrollToSection = (sectionId: string) => {
    // If we're not on the homepage, navigate there first
    if (window.location.pathname !== '/') {
      navigate('/');
      // Wait for navigation to complete, then scroll
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

  const navigateToAboutUs = () => {
    navigate('/chi-ce-dietro');
  };

  const navigateToHome = () => {
    navigate('/');
  };

  return (
    <>
      {/* Desktop Header - visibile solo su desktop */}
      <header className="hidden md:block bg-white shadow-sm sticky top-0 z-40 border-b border-green-100">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Integrated Logo & Brand */}
            <div 
              className="group cursor-pointer transition-all duration-300 hover:scale-105"
              onClick={navigateToHome}
            >
              <div className="flex items-center space-x-3 relative">
                {/* Logo Container - Full size without padding */}
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-50 to-orange-50 shadow-sm group-hover:shadow-md transition-all duration-300 overflow-hidden flex items-center justify-center">
                  <PetScanLogo size="md" />
                </div>

                {/* Brand Text Container - Balanced Layout */}
                <div className="flex flex-col">
                  {/* Main Brand Name - Adjusted size for visual balance */}
                  <div className="flex items-center justify-center">
                    <span className="text-[1.75rem] font-bold tracking-tight leading-none">
                      <span style={{ color: '#81e5d0' }} className="drop-shadow-sm">Pet</span>
                      <span style={{ color: '#fdc595' }} className="drop-shadow-sm">Scan</span>
                    </span>
                  </div>
                  
                  {/* Domain with Enhanced Typography for Visual Balance */}
                  <div className="flex items-center justify-center mt-1">
                    <div className="h-0.5 w-3 bg-gradient-to-r from-green-400 to-orange-400 rounded-full mr-1.5 opacity-60"></div>
                    <span className="text-[0.68rem] font-bold text-gray-600 tracking-[0.12em] uppercase group-hover:text-green-600 transition-colors duration-300">
                      mypetscan.it
                    </span>
                    <div className="h-0.5 w-3 bg-gradient-to-r from-orange-400 to-green-400 rounded-full ml-1.5 opacity-60"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="flex items-center space-x-8">
              <button 
                onClick={() => scrollToSection('come-funziona')}
                className="text-gray-600 hover:text-green-600 font-medium transition-colors"
              >
                Come funziona
              </button>
              <button 
                onClick={() => scrollToSection('prodotti')}
                className="text-gray-600 hover:text-green-600 font-medium transition-colors"
              >
                Esempi
              </button>
              <button 
                onClick={() => scrollToSection('faq')}
                className="text-gray-600 hover:text-green-600 font-medium transition-colors"
              >
                FAQ
              </button>
              <button 
                onClick={navigateToAboutUs}
                className="text-gray-600 hover:text-green-600 font-medium transition-colors"
              >
                Chi c'è dietro ❤️
              </button>
              <Button 
                onClick={() => scrollToSection('analisi-form')}
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-2 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
              >
                Analizza ora
              </Button>
              <Button 
                onClick={() => setIsContactModalOpen(true)}
                variant="outline"
                className="border-green-200 hover:border-green-300 text-green-700 px-6 py-2 rounded-full font-semibold"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Contattaci
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation Bar - visibile solo su mobile */}
      <nav className="md:hidden mobile-bottom-nav fixed bottom-0 left-0 right-0 z-[9999] bg-white/50 backdrop-blur-md shadow-2xl" style={{ bottom: '60px' }}>
        <div className="flex items-center justify-around px-4 py-2.5 max-w-md mx-auto" style={{ paddingBottom: 'calc(0.75rem + env(safe-area-inset-bottom))' }}>
          {/* Guida */}
          <button
            onClick={() => scrollToSection('come-funziona')}
            className="flex flex-col items-center justify-center w-16 h-11 rounded-full transition-all duration-200 active:scale-95 touch-manipulation hover:bg-white/20"
            style={{ WebkitTapHighlightColor: 'transparent' }}
          >
            <div className="w-6 h-6 mb-1 flex items-center justify-center">
              <Settings className="w-5 h-5" style={{ color: '#16a34a', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }} />
            </div>
            <span className="text-xs font-bold" style={{ color: '#16a34a', textShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>Guida</span>
          </button>

          {/* Analisi */}
          <button
            onClick={() => scrollToSection('prodotti')}
            className="flex flex-col items-center justify-center w-16 h-11 rounded-full transition-all duration-200 active:scale-95 touch-manipulation hover:bg-white/20"
            style={{ WebkitTapHighlightColor: 'transparent' }}
          >
            <div className="w-6 h-6 mb-1 flex items-center justify-center">
              <FileText className="w-5 h-5" style={{ color: '#ea580c', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }} />
            </div>
            <span className="text-xs font-bold" style={{ color: '#ea580c', textShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>Analisi</span>
          </button>

          {/* Scannerizza - Pulsante centrale semplificato */}
          <button
            onClick={() => scrollToSection('scannerizza-form')}
            className="flex flex-col items-center justify-center w-16 h-11 rounded-full transition-all duration-200 active:scale-95 touch-manipulation hover:bg-white/20"
            style={{ WebkitTapHighlightColor: 'transparent' }}
          >
            <div className="w-10 h-10 mb-1 flex items-center justify-center">
              <Search className="w-8 h-8" style={{ color: '#000000', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))', strokeWidth: '5' }} />
            </div>
            <span className="text-xs font-bold" style={{ color: '#000000', textShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>Scannerizza</span>
          </button>

          {/* Chi Siamo */}
          <button
            onClick={navigateToAboutUs}
            className="flex flex-col items-center justify-center w-16 h-11 rounded-full transition-all duration-200 active:scale-95 touch-manipulation hover:bg-white/20"
            style={{ WebkitTapHighlightColor: 'transparent' }}
          >
            <div className="w-6 h-6 mb-1 flex items-center justify-center">
              <Heart className="w-5 h-5" style={{ color: '#ea580c', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }} />
            </div>
            <span className="text-xs font-bold" style={{ color: '#ea580c', textShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>Chi Siamo</span>
          </button>

          {/* FAQ */}
          <button
            onClick={() => scrollToSection('faq')}
            className="flex flex-col items-center justify-center w-16 h-11 rounded-full transition-all duration-200 active:scale-95 touch-manipulation hover:bg-white/20"
            style={{ WebkitTapHighlightColor: 'transparent' }}
          >
            <div className="w-6 h-6 mb-1 flex items-center justify-center">
              <HelpCircle className="w-5 h-5" style={{ color: '#16a34a', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }} />
            </div>
            <span className="text-xs font-bold" style={{ color: '#16a34a', textShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>FAQ</span>
          </button>
        </div>
      </nav>

      <ContactModal 
        isOpen={isContactModalOpen} 
        onClose={() => setIsContactModalOpen(false)} 
      />
    </>
  );
};

export default Header;
