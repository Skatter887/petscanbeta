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
  const [noResults, setNoResults] = useState(false);

  const handleProductAnalysis = async (input: string) => {
    setIsLoading(true);
    setAnalysisResult(null);
    setSearchResults([]);
    setNoResults(false);
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
          setNoResults(true);
        }
      }
    } catch (e) {
      setNoResults(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProductSelect = (ean: number) => {
    handleProductAnalysis(ean.toString());
  };

  const reset = () => {
    setAnalysisResult(null);
    setSearchResults([]);
    setNoResults(false);
  };

  return {
    analysisResult,
    isLoading,
    noResults,
    searchResults,
    handleProductAnalysis,
    handleProductSelect,
    reset,
  };
} 