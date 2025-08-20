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
    console.log('scrollToSection called with:', sectionId);
    
    // Check if we're on mobile (since scannerizza-form is md:hidden)
    const isMobile = window.innerWidth < 768;
    console.log('Is mobile:', isMobile);
    
    // If we're not on the homepage, navigate there first
    if (window.location.pathname !== '/') {
      console.log('Navigating to homepage first');
      navigate('/');
      // Wait for navigation to complete, then scroll
      setTimeout(() => {
        if (sectionId === 'analisi-form' && !isMobile) {
          // Su desktop, scrolla alla barra di ricerca integrata in HeroContent
          console.log('Scrolling to HeroContent search form on desktop');
          const heroSearchForm = document.getElementById('scannerizza-form-desktop-hero');
          if (heroSearchForm) {
            heroSearchForm.scrollIntoView({ 
              behavior: 'smooth', 
              block: 'center' 
            });
            
            // Metti il focus sull'input dopo lo scroll
            setTimeout(() => {
              const desktopInput = heroSearchForm.querySelector('input');
              if (desktopInput) {
                desktopInput.focus();
              }
            }, 500);
          } else {
            // Fallback: scroll al centro della pagina
            window.scrollTo({ 
              top: window.innerHeight / 2, 
              behavior: 'smooth' 
            });
          }
        } else {
          const element = document.getElementById(sectionId);
          console.log('Element found after navigation:', element);
          if (element) {
            if (sectionId === 'scannerizza-form') {
              if (isMobile) {
                console.log('Scrolling to scannerizza-form on mobile');
                // Center the search bar on the screen
                element.scrollIntoView({ 
                  behavior: 'smooth', 
                  block: 'center',
                  inline: 'center'
                });
              } else {
                console.log('scannerizza-form is hidden on desktop');
              }
            } else {
              element.scrollIntoView({ behavior: 'smooth' });
            }
          } else {
            console.log('Element not found:', sectionId);
          }
        }
      }, 100);
    } else {
      if (sectionId === 'analisi-form' && !isMobile) {
        // Su desktop, scrolla alla barra di ricerca integrata in HeroContent
        console.log('Scrolling to HeroContent search form on desktop');
        const heroSearchForm = document.getElementById('scannerizza-form-desktop-hero');
        if (heroSearchForm) {
          heroSearchForm.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
          });
          
          // Metti il focus sull'input dopo lo scroll
          setTimeout(() => {
            const desktopInput = heroSearchForm.querySelector('input');
            if (desktopInput) {
              desktopInput.focus();
            }
          }, 500);
        } else {
          // Fallback: scroll al centro della pagina
          window.scrollTo({ 
            top: window.innerHeight / 2, 
            behavior: 'smooth' 
          });
        }
      } else {
        const element = document.getElementById(sectionId);
        console.log('Element found on same page:', element);
        if (element) {
          if (sectionId === 'scannerizza-form') {
            if (isMobile) {
              console.log('Scrolling to scannerizza-form on same page, mobile');
              // Center the search bar on the screen
              element.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'center',
                inline: 'center'
              });
            } else {
              console.log('scannerizza-form is hidden on desktop');
            }
          } else {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        } else {
          console.log('Element not found on same page:', sectionId);
        }
      }
    }
  };

  const navigateToAboutUs = () => {
    // Navigate to the AboutUs page
    navigate('/chi-ce-dietro');
    
    // Aggressive scroll to top with multiple methods
    const forceScrollToTop = () => {
      // Method 1: Force immediate scroll
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      
      // Method 2: Try to scroll the main element if it exists
      const mainElement = document.querySelector('main');
      if (mainElement) {
        mainElement.scrollTop = 0;
      }
    };
    
    // Execute immediately and with multiple delays
    forceScrollToTop();
    
    // Execute after navigation completes
    setTimeout(forceScrollToTop, 50);
    setTimeout(forceScrollToTop, 100);
    setTimeout(forceScrollToTop, 200);
    setTimeout(forceScrollToTop, 500);
    
    // Final aggressive attempt
    setTimeout(() => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }, 1000);
    
    // Nuclear option: force page reload if scroll doesn't work
    setTimeout(() => {
      if (window.scrollY > 0) {
        console.log('Scroll failed, forcing page reload');
        window.location.href = '/chi-ce-dietro';
      }
    }, 1500);
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

      {/* Mobile Bottom Navigation Bar - Dynamic with UI effects */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-[9999] px-6 animate-in slide-in-from-bottom-4 duration-500" style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 8px)' }}>
        <nav className="bg-white/95 backdrop-blur-2xl rounded-[20px] shadow-lg border border-gray-100/80 mx-auto max-w-xs hover:shadow-xl transition-all duration-500 hover:scale-[1.02]">
          <div className="flex items-center justify-between px-4 py-3">
            {/* Guida */}
            <button
              onClick={() => scrollToSection('come-funziona')}
              className="group flex flex-col items-center justify-center transition-all duration-300 active:scale-90 touch-manipulation hover:scale-110"
              style={{ WebkitTapHighlightColor: 'transparent' }}
            >
              <div className="w-11 h-11 rounded-xl bg-gray-50 flex items-center justify-center mb-1.5 shadow-sm border border-gray-100 group-hover:bg-green-50 group-hover:border-green-200 group-hover:shadow-md transition-all duration-300 group-active:scale-90">
                <Settings className="w-5 h-5 text-gray-500 group-hover:text-green-600 transition-colors duration-300" strokeWidth="1.8" />
              </div>
              <span className="text-[10px] font-medium text-gray-500 group-hover:text-green-600 transition-colors duration-300">Guida</span>
            </button>

            {/* Esempi */}
            <button
              onClick={() => scrollToSection('prodotti')}
              className="group flex flex-col items-center justify-center transition-all duration-300 active:scale-90 touch-manipulation hover:scale-110"
              style={{ WebkitTapHighlightColor: 'transparent' }}
            >
              <div className="w-11 h-11 rounded-xl bg-gray-50 flex items-center justify-center mb-1.5 shadow-sm border border-gray-100 group-hover:bg-orange-50 group-hover:border-orange-200 group-hover:shadow-md transition-all duration-300 group-active:scale-90">
                <FileText className="w-5 h-5 text-gray-500 group-hover:text-orange-600 transition-colors duration-300" strokeWidth="1.8" />
              </div>
              <span className="text-[10px] font-medium text-gray-500 group-hover:text-orange-600 transition-colors duration-300">Esempi</span>
            </button>

            {/* Scannerizza - Dynamic central button with enhanced effects */}
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Scan button clicked - navigating to homepage and opening scanner');
                
                // Se non siamo sulla homepage, naviga prima alla homepage
                if (window.location.pathname !== '/') {
                  console.log('Navigating to homepage first');
                  navigate('/');
                  // Aspetta che la navigazione sia completata, poi scrolla all'inizio e apri scanner
                  setTimeout(() => {
                    try {
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                      // Dopo lo scroll, apri lo scanner
                      setTimeout(() => {
                        // Cerca il pulsante scan nella homepage e cliccalo
                        const scanButton = document.querySelector('[data-scan-button]');
                        if (scanButton) {
                          console.log('Found scan button, clicking it');
                          (scanButton as HTMLElement).click();
                        } else {
                          console.log('Scan button not found, opening scanner manually');
                          // Fallback: ricarica la pagina per aprire lo scanner
                          window.location.reload();
                        }
                      }, 500);
                    } catch (error) {
                      console.error('Scroll error after navigation:', error);
                      window.scrollTo(0, 0);
                    }
                  }, 100);
                } else {
                  // Se siamo già sulla homepage, scrolla all'inizio e apri scanner
                  console.log('Already on homepage, scrolling to top and opening scanner');
                  try {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    // Dopo lo scroll, apri lo scanner
                    setTimeout(() => {
                      // Cerca il pulsante scan nella homepage e cliccalo
                      const scanButton = document.querySelector('[data-scan-button]');
                      if (scanButton) {
                        console.log('Found scan button, clicking it');
                        (scanButton as HTMLElement).click();
                      } else {
                        console.log('Scan button not found, opening scanner manually');
                        // Fallback: ricarica la pagina per aprire lo scanner
                        window.location.reload();
                      }
                    }, 500);
                  } catch (error) {
                    console.error('Scroll error:', error);
                    // Fallback per browser più vecchi
                    window.scrollTo(0, 0);
                  }
                }
              }}
              onTouchStart={(e) => {
                console.log('Touch start on scan button');
              }}
              className="group flex flex-col items-center justify-center transition-all duration-500 active:scale-90 touch-manipulation hover:scale-110 -mt-1 relative z-50 p-2"
              style={{ 
                WebkitTapHighlightColor: 'transparent',
                userSelect: 'none',
                touchAction: 'manipulation',
                minHeight: '70px',
                minWidth: '70px'
              }}
            >
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-400 via-green-500 to-orange-400 flex items-center justify-center mb-1.5 shadow-2xl relative border border-white transition-all duration-500 group-active:scale-90">
                {/* Enhanced animated glow effect - always visible */}
                <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-br from-green-400 to-orange-400 blur-md opacity-60 transition-all duration-500 -z-10 animate-pulse"></div>
                
                {/* Rotating border effect - always visible */}
                <div className="absolute -inset-0.5 rounded-2xl opacity-100 transition-opacity duration-500 -z-20">
                  <div className="w-full h-full rounded-2xl bg-gradient-to-r from-green-400 via-orange-400 to-green-400 animate-spin-slow blur-sm"></div>
                </div>
                
                {/* Premium scanner icon with micro-animation - always visible */}
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-white scale-110 transition-transform duration-300">
                  <path d="M3 7V5a2 2 0 0 1 2-2h2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M17 3h2a2 2 0 0 1 2 2v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M21 17v2a2 2 0 0 1-2 2h-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M7 21H5a2 2 0 0 1-2-2v-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M7 12h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="animate-pulse"/>
                  <circle cx="12" cy="12" r="1" fill="currentColor" className="animate-ping"/>
                </svg>
              </div>
              <span className="text-[10px] font-bold text-gray-800 group-hover:text-gray-900 transition-colors duration-300">Scan</span>
            </button>

            {/* Chi Siamo */}
            <button
              onClick={navigateToAboutUs}
              className="group flex flex-col items-center justify-center transition-all duration-300 active:scale-90 touch-manipulation hover:scale-110"
              style={{ WebkitTapHighlightColor: 'transparent' }}
            >
              <div className="w-11 h-11 rounded-xl bg-gray-50 flex items-center justify-center mb-1.5 shadow-sm border border-gray-100 group-hover:bg-red-50 group-hover:border-red-200 group-hover:shadow-md transition-all duration-300 group-active:scale-90">
                <Heart className="w-5 h-5 text-gray-500 group-hover:text-red-500 transition-colors duration-300 group-hover:animate-pulse" strokeWidth="1.8" />
              </div>
              <span className="text-[10px] font-medium text-gray-500 group-hover:text-red-500 transition-colors duration-300">Chi Siamo</span>
            </button>

            {/* FAQ */}
            <button
              onClick={() => scrollToSection('faq')}
              className="group flex flex-col items-center justify-center transition-all duration-300 active:scale-90 touch-manipulation hover:scale-110"
              style={{ WebkitTapHighlightColor: 'transparent' }}
            >
              <div className="w-11 h-11 rounded-xl bg-gray-50 flex items-center justify-center mb-1.5 shadow-sm border border-gray-100 group-hover:bg-teal-50 group-hover:border-teal-200 group-hover:shadow-md transition-all duration-300 group-active:scale-90">
                <HelpCircle className="w-5 h-5 text-gray-500 group-hover:text-teal-600 transition-colors duration-300" strokeWidth="1.8" />
              </div>
              <span className="text-[10px] font-medium text-gray-500 group-hover:text-teal-600 transition-colors duration-300">FAQ</span>
            </button>
          </div>
        </nav>
      </div>

      <style>{`
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
      `}</style>

      <ContactModal 
        isOpen={isContactModalOpen} 
        onClose={() => setIsContactModalOpen(false)} 
      />
    </>
  );
};

export default Header;
