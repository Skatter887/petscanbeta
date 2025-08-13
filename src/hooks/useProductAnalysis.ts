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
    console.log('🔍 useProductAnalysis: Starting analysis for input:', input);
    setIsLoading(true);
    setAnalysisResult(null);
    setSearchResults([]);
    setShowProductNotFoundModal(false);
    setShowAddProductModal(false);
    
    try {
      console.log('⏱️ Adding delay before analysis...');
      await new Promise(resolve => setTimeout(resolve, 1500)); // Aumentato a 1.5 secondi per mostrare meglio la loading bar
      
      console.log('🔍 Calling analyzeProduct with:', input);
      const { product, analysis } = await analyzeProduct(input);
      
      console.log('📋 Analysis result:', { 
        product: product ? { title: product.title, brand: product.brand, ean: product.Ean } : null, 
        analysis: analysis ? { score: analysis.overallScore, status: analysis.evaluationStatus } : null 
      });
      
      if (product && analysis) {
        console.log('✅ Product found, creating analysis result');
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
        console.log('📊 Setting analysis result:', result);
        setAnalysisResult(result);
      } else {
        console.log('❌ Product not found by barcode, trying name search...');
        const results = await searchProductByName(input);
        console.log('🔍 Name search results:', results.length);
        
        if (results.length > 0) {
          console.log('✅ Found products by name, setting search results');
          setSearchResults(results.slice(0, 5));
        } else {
          console.log('❌ No products found, showing not found modal');
          setLastSearchedEan(input);
          setShowProductNotFoundModal(true);
        }
      }
    } catch (e) {
      console.error('💥 Error in product analysis:', e);
      setLastSearchedEan(input);
      setShowProductNotFoundModal(true);
    } finally {
      console.log('🏁 Analysis complete, setting loading to false');
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