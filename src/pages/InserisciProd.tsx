import { useState, useEffect, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { analyzeProduct, searchProductByName, type ProductData } from '@/data/productDatabase';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BarcodeScanner from '@/components/BarcodeScanner';
import ProductAnalysisCard from '@/components/ProductAnalysisCard';
import PetScanLogo from '@/components/PetScanLogo';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Search, AlertCircle, Sparkles } from 'lucide-react';
import ProductNotFoundModal from '@/components/ProductNotFoundModal';
import AddProductModal from '@/components/AddProductModal';

interface ProductAnalysisResult {
  productName: string;
  brand: string;
  category: string;
  overallScore: number;
  evaluationStatus: 'approved' | 'could-be-better' | 'not-approved';
  evaluationLabel: string;
  nutritionalValues: Array<{
    label: string;
    value: number;
    status: 'excellent' | 'good' | 'fair' | 'poor';
    icon: string;
  }>;
  recommendation: string;
  imageUrl: string;
}

const InserisciProd = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<ProductAnalysisResult | null>(null);
  const [searchResults, setSearchResults] = useState<ProductData[]>([]);
  const [productCount, setProductCount] = useState(0);
  const [showProductNotFoundModal, setShowProductNotFoundModal] = useState(false);
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [lastSearchedEan, setLastSearchedEan] = useState<string>('');
  const [resetTrigger, setResetTrigger] = useState(0);
  const { toast } = useToast();
  const analysisCardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load product count from database
    fetch('/data/petscan_main.json')
      .then(response => response.json())
      .then(data => setProductCount(data.length))
      .catch(error => console.error('Error loading product count:', error));
  }, []);

  const handleProductAnalysis = async (input: string) => {
    setIsLoading(true);
    setAnalysisResult(null);
    setSearchResults([]);
    setShowProductNotFoundModal(false);
    setShowAddProductModal(false);

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Prima prova a cercare per barcode
      const { product, analysis } = await analyzeProduct(input);
      
      if (product && analysis) {
        // Prodotto trovato tramite barcode
        const result: ProductAnalysisResult = {
          productName: product.title,
          brand: product.brand,
          category: product.category,
          overallScore: analysis.overallScore,
          evaluationStatus: analysis.evaluationStatus,
          evaluationLabel: analysis.evaluationLabel,
          nutritionalValues: analysis.nutritionalValues,
          recommendation: analysis.recommendation,
          imageUrl: product.images || ''
        };
        
        setAnalysisResult(result);
        scrollToAnalysisCard();
        
        toast({
          title: "Analisi completata",
          description: `${product.title} analizzato con successo`,
        });
      } else {
        // Se non trovato per barcode, prova la ricerca per nome
        const searchResults = await searchProductByName(input);
        
        if (searchResults.length > 0) {
          // Mostra i risultati della ricerca
          setSearchResults(searchResults.slice(0, 5)); // Limita a 5 risultati
          
          toast({
            title: "Prodotti trovati",
            description: `${searchResults.length} prodotto${searchResults.length > 1 ? 'i' : ''} trovato${searchResults.length > 1 ? 'i' : ''} per "${input}"`,
          });
        } else {
          // Prodotto non trovato - mostra il modal
          setLastSearchedEan(input);
          setShowProductNotFoundModal(true);
        }
      }
    } catch (error) {
      console.error('Error analyzing product:', error);
      // In caso di errore, mostra comunque il modal
      setLastSearchedEan(input);
      setShowProductNotFoundModal(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProductSelect = (ean: number) => {
    setSearchResults([]); // Pulisce i risultati di ricerca
    handleProductAnalysis(ean.toString());
  };

  const scrollToAnalysisCard = () => {
    setTimeout(() => {
      if (analysisCardRef.current) {
        analysisCardRef.current.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center',
          inline: 'nearest'
        });
      }
    }, 100); // Piccolo delay per assicurarsi che il componente sia renderizzato
  };

  const handleNewSearch = () => {
    // Reset completo dello stato
    setIsLoading(false);
    setAnalysisResult(null);
    setSearchResults([]);
    setShowProductNotFoundModal(false);
    setShowAddProductModal(false);
    setResetTrigger(prev => prev + 1); // Trigger per resettare il BarcodeScanner
    
    // Focus sulla barra di ricerca
    const searchInput = document.querySelector('input[type="text"]') as HTMLInputElement;
    if (searchInput) {
      searchInput.focus();
    }
  };

  const handleAddProduct = () => {
    setShowProductNotFoundModal(false);
    setShowAddProductModal(true);
  };

  const handleCloseAddProductModal = () => {
    // Reset completo dello stato
    setIsLoading(false);
    setAnalysisResult(null);
    setSearchResults([]);
    setShowAddProductModal(false);
    setResetTrigger(prev => prev + 1); // Trigger per resettare il BarcodeScanner
    
    // Focus sulla barra di ricerca
    const searchInput = document.querySelector('input[type="text"]') as HTMLInputElement;
    if (searchInput) {
      searchInput.focus();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Modern Hero Section with Gradient Background - Mobile Optimized */}
      <div className="relative bg-gradient-to-br from-teal-50 via-emerald-50 to-cyan-50 min-h-screen md:min-h-[80vh] flex items-center">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 md:top-20 left-10 md:left-20 w-16 md:w-32 h-16 md:h-32 bg-gradient-to-br from-teal-400 to-emerald-400 rounded-full blur-xl"></div>
          <div className="absolute bottom-10 md:bottom-20 right-10 md:right-20 w-20 md:w-40 h-20 md:h-40 bg-gradient-to-br from-cyan-400 to-teal-400 rounded-full blur-xl"></div>
          <div className="absolute top-1/2 left-1/3 w-12 md:w-24 h-12 md:h-24 bg-gradient-to-br from-emerald-400 to-cyan-400 rounded-full blur-lg"></div>
        </div>
        
        <div className="container mx-auto px-4 py-8 md:py-16 relative z-10 w-full">
          <div className="text-center space-y-4 md:space-y-8 max-w-4xl mx-auto min-h-screen md:min-h-auto flex flex-col justify-center">
            {/* Logo */}
            <div className="flex justify-center mb-4 md:mb-8">
              <div className="relative">
                <div className="block md:hidden">
                  <PetScanLogo size="lg" className="animate-fade-in drop-shadow-lg" />
                </div>
                <div className="hidden md:block">
                  <PetScanLogo size="xl" className="animate-fade-in drop-shadow-lg" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-teal-400/20 to-emerald-400/20 rounded-full blur-xl -z-10"></div>
              </div>
            </div>
            
            {/* Main Content */}
            <div className="space-y-3 md:space-y-6 flex-shrink-0">
              <div className="space-y-2 md:space-y-4">
                <h1 className="text-3xl md:text-5xl lg:text-7xl font-bold">
                  <span className="bg-gradient-to-r from-teal-600 via-emerald-600 to-cyan-600 bg-clip-text text-transparent">
                  PetScan
                </span>
              </h1>
                <h2 className="text-lg md:text-2xl lg:text-3xl font-semibold text-gray-700">
                  La salute del tuo pet in una scansione
                </h2>
              </div>
              
              <div className="space-y-3 md:space-y-4">
                <p className="text-base md:text-xl lg:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed font-medium px-2">
                  Scopri se il cibo del tuo pet è davvero sano. Scansiona il barcode o 
                  inserisci il nome del prodotto per un'analisi nutrizionale completa.
              </p>
                
                {/* Database Stats - Mobile Optimized */}
                <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-4">
                  <div className="inline-flex items-center px-4 md:px-6 py-2 md:py-3 bg-white/80 backdrop-blur-sm rounded-full shadow-lg border border-white/20">
                    <div className="flex items-center space-x-2 md:space-x-3">
                      <div className="w-2 md:w-3 h-2 md:h-3 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full animate-pulse"></div>
                      <span className="text-xs md:text-sm text-gray-700 font-medium">
                        Sviluppato con amore per i nostri amici a quattro zampe ❤️
                      </span>
            </div>
          </div>

                  <div className="inline-flex items-center px-4 md:px-6 py-2 md:py-3 bg-gradient-to-r from-teal-500/10 to-emerald-500/10 backdrop-blur-sm rounded-full border border-teal-200/50">
                    <div className="flex items-center space-x-2 md:space-x-3">
                      <Sparkles className="w-4 md:w-5 h-4 md:h-5 text-teal-600" />
                      <span className="text-xs md:text-sm text-gray-700 font-semibold">
                        {productCount > 0 ? `${productCount.toLocaleString()} prodotti` : 'Caricamento...'} nel database
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Scanner Section - Mobile Priority */}
            <div className="flex justify-center mt-4 md:mt-12 flex-shrink-0">
              <div className="w-full max-w-md px-2">
              <BarcodeScanner
                onScan={handleProductAnalysis}
                onManualEntry={handleProductAnalysis}
                isLoading={isLoading}
                resetTrigger={resetTrigger}
              />
            </div>
          </div>
          </div>
        </div>
      </div>
      
      {/* Content Section */}
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-8">
          {/* Scanner Section - Moved above */}

          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <div className="text-center space-y-6">
                <div className="relative">
                  <div className="w-20 h-20 mx-auto gradient-primary rounded-full flex items-center justify-center">
                    <Loader2 className="w-8 h-8 text-white animate-spin" />
                  </div>
                  <div className="absolute inset-0 gradient-primary rounded-full opacity-30 animate-pulse"></div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-foreground">
                    Analisi in corso
                  </h3>
                  <p className="text-muted-foreground">
                    Stiamo valutando i valori nutrizionali del prodotto
                  </p>
                  <div className="flex items-center justify-center space-x-1 text-primary">
                    <Sparkles className="w-4 h-4" />
                    <span className="text-sm">Powered by AI</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Analysis Result */}
          {analysisResult && !isLoading && (
            <div ref={analysisCardRef} className="space-y-6 animate-fade-in pt-8">
              <ProductAnalysisCard result={analysisResult} />
            </div>
          )}

          {/* Search Results */}
          {searchResults.length > 0 && !isLoading && (
            <div className="space-y-6 animate-fade-in">
              <div className="text-center">
                <h3 className="text-2xl font-semibold text-foreground mb-2">
                  Prodotti Trovati
                </h3>
                <p className="text-muted-foreground">
                  Seleziona un prodotto per vedere l'analisi nutrizionale
                </p>
              </div>
              
              <div className="grid gap-4 md:grid-cols-2">
                {searchResults.map((product, index) => (
                  <Card 
                    key={index} 
                    className="cursor-pointer shadow-card hover:shadow-elevated transition-all duration-300 hover:scale-105 border-0"
                    onClick={() => handleProductSelect(product.Ean)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center space-x-4">
                        <div className="w-14 h-14 gradient-accent rounded-full flex items-center justify-center">
                          <PetScanLogo size="sm" />
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-lg font-semibold">{product.title}</CardTitle>
                          <p className="text-sm text-muted-foreground">
                            {product.brand} • {product.category}
                          </p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex justify-between items-center">
                        <div className="text-sm text-muted-foreground">
                          Proteine: {product.nutritionalValues.protein}%
                        </div>
                        <div className="text-sm text-primary font-medium flex items-center space-x-1">
                          <span>Analizza</span>
                          <Search className="w-4 h-4" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Info Section */}
          <div className="gradient-accent rounded-2xl p-8 max-w-2xl mx-auto shadow-card">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 gradient-primary rounded-full flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">
                Come funziona l'analisi?
              </h3>
            </div>
            <div className="space-y-3 text-muted-foreground">
              <p className="flex items-start space-x-2">
                <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                <span>Analizziamo i valori nutrizionali del prodotto</span>
              </p>
              <p className="flex items-start space-x-2">
                <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                <span>Valutiamo proteine, grassi, fibre, ceneri e umidità</span>
              </p>
              <p className="flex items-start space-x-2">
                <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                <span>Forniamo un punteggio complessivo da 0 a 100</span>
              </p>
              <p className="flex items-start space-x-2">
                <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                <span>Ti diciamo se il prodotto è approvato per il tuo pet</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Modali per prodotto non trovato */}
      <ProductNotFoundModal
        isOpen={showProductNotFoundModal}
        onClose={handleNewSearch}
        onNewSearch={handleNewSearch}
        onAddProduct={handleAddProduct}
      />
      
      <AddProductModal
        isOpen={showAddProductModal}
        onClose={handleCloseAddProductModal}
        eanCode={lastSearchedEan}
      />

      <Footer />
    </div>
  );
};

export default InserisciProd;