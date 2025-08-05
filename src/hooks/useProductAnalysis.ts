import { useState } from 'react';
import { analyzeProduct, searchProductByName, type ProductData } from '@/data/productDatabase';

export interface ProductAnalysisResult {
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

export function useProductAnalysis() {
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<ProductAnalysisResult | null>(null);
  const [searchResults, setSearchResults] = useState<ProductData[]>([]);
  const [showProductNotFoundModal, setShowProductNotFoundModal] = useState(false);
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [lastSearchedEan, setLastSearchedEan] = useState<string>('');

  const handleProductAnalysis = async (input: string) => {
    setIsLoading(true);
    setAnalysisResult(null);
    setSearchResults([]);
    setShowProductNotFoundModal(false);
    setShowAddProductModal(false);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      const { product, analysis } = await analyzeProduct(input);
      if (product && analysis) {
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
      } else {
        const results = await searchProductByName(input);
        if (results.length > 0) {
          setSearchResults(results.slice(0, 5));
        } else {
          // Prodotto non trovato - mostra il modal
          setLastSearchedEan(input);
          setShowProductNotFoundModal(true);
        }
      }
    } catch (e) {
      // In caso di errore, mostra comunque il modal
      setLastSearchedEan(input);
      setShowProductNotFoundModal(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewSearch = () => {
    // Reset completo dello stato
    setIsLoading(false);
    setAnalysisResult(null);
    setSearchResults([]);
    setShowProductNotFoundModal(false);
    setShowAddProductModal(false);
    
    // Focus sulla barra di ricerca
    const searchBar = document.getElementById('scannerizza-form');
    if (searchBar) {
      searchBar.scrollIntoView({ behavior: 'smooth' });
      const searchInput = searchBar.querySelector('input');
      if (searchInput) {
        searchInput.focus();
      }
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
    
    // Focus sulla barra di ricerca
    const searchBar = document.getElementById('scannerizza-form');
    if (searchBar) {
      searchBar.scrollIntoView({ behavior: 'smooth' });
      const searchInput = searchBar.querySelector('input');
      if (searchInput) {
        searchInput.focus();
      }
    }
  };

  const handleProductSelect = (ean: number) => {
    handleProductAnalysis(ean.toString());
  };

  const reset = () => {
    setAnalysisResult(null);
    setSearchResults([]);
    setShowProductNotFoundModal(false);
    setShowAddProductModal(false);
  };

  return {
    analysisResult,
    isLoading,
    searchResults,
    showProductNotFoundModal,
    showAddProductModal,
    lastSearchedEan,
    handleProductAnalysis,
    handleProductSelect,
    handleNewSearch,
    handleAddProduct,
    handleCloseAddProductModal,
    reset,
  };
} 