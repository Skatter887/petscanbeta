import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle, Menu, X } from 'lucide-react';
import ContactModal from './ContactModal';
import { useNavigate } from 'react-router-dom';
import PetScanLogo from './PetScanLogo';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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
    setIsMenuOpen(false);
  };

  const navigateToAboutUs = () => {
    navigate('/chi-ce-dietro');
    setIsMenuOpen(false);
  };

  const navigateToHome = () => {
    navigate('/');
    setIsMenuOpen(false);
  };

  return (
    <>
      <header className="bg-white shadow-sm sticky top-0 z-40 border-b border-green-100">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Integrated Logo & Brand */}
            <div 
              className="group cursor-pointer transition-all duration-300 hover:scale-105"
              onClick={navigateToHome}
            >
              <div className="flex items-center space-x-3 relative">
                {/* Logo Container - Full size without padding */}
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-50 to-orange-50 shadow-sm group-hover:shadow-md transition-all duration-300 overflow-hidden flex items-center justify-center">
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
            <nav className="hidden md:flex items-center space-x-8">
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

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-green-100">
              <nav className="flex flex-col space-y-4">
                <button 
                  onClick={() => scrollToSection('come-funziona')}
                  className="text-gray-600 hover:text-green-600 font-medium transition-colors text-left"
                >
                  Come funziona
                </button>
                <button 
                  onClick={() => scrollToSection('prodotti')}
                  className="text-gray-600 hover:text-green-600 font-medium transition-colors text-left"
                >
                  Esempi
                </button>
                <button 
                  onClick={() => scrollToSection('faq')}
                  className="text-gray-600 hover:text-green-600 font-medium transition-colors text-left"
                >
                  FAQ
                </button>
                <button 
                  onClick={navigateToAboutUs}
                  className="text-gray-600 hover:text-green-600 font-medium transition-colors text-left"
                >
                  Chi c'è dietro ❤️
                </button>
                <Button 
                  onClick={() => scrollToSection('analisi-form')}
                  className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-200 w-full"
                >
                  Analizza ora
                </Button>
                <Button 
                  onClick={() => setIsContactModalOpen(true)}
                  variant="outline"
                  className="border-green-200 hover:border-green-300 text-green-700 rounded-full font-semibold w-full"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Contattaci
                </Button>
              </nav>
            </div>
          )}
        </div>
      </header>

      <ContactModal 
        isOpen={isContactModalOpen} 
        onClose={() => setIsContactModalOpen(false)} 
      />
    </>
  );
};

export default Header;
