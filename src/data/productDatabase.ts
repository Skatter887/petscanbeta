// Interface per i dati dei prodotti dal database JSON
export interface ProductData {
  Ean: number;
  title: string;
  brand: string;
  category: string;
  nutritionalValues: {
    protein: number;
    fat: number;
    fiber: number;
    ash: number;
    moisture: number;
  };
  images?: string;
  ingredienti: string;
  "Proteine (%)": string;
  "Grassi (%)": string;
  "Fibre (%)": string;
  "Ceneri (%)": string;
  "Umidità (%)": string;
}

// Carica i dati dal file JSON
let productDatabase: ProductData[] = [];
let databasePromise: Promise<ProductData[]> | null = null;

const loadProductDatabase = async (): Promise<ProductData[]> => {
  try {
    const response = await fetch('/data/petscan_main.json');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Errore nel caricamento del database prodotti:', error);
    return [];
  }
};

// Inizializza il database una volta sola
const initializeDatabase = (): Promise<ProductData[]> => {
  if (!databasePromise) {
    databasePromise = loadProductDatabase().then(data => {
      productDatabase = data;
      console.log(`Database caricato con ${data.length} prodotti`);
      return data;
    });
  }
  return databasePromise;
};

// Funzione helper per convertire i valori nutrizionali
const parseNutritionalValue = (value: string): number => {
  if (!value || value === '') return 0;
  const parsed = parseFloat(value);
  return isNaN(parsed) ? 0 : parsed;
};

// Funzione per trasformare i dati del prodotto
const transformProduct = (product: any): ProductData => {
  return {
    ...product,
    nutritionalValues: {
      protein: parseNutritionalValue(product["Proteine (%)"]),
      fat: parseNutritionalValue(product["Grassi (%)"]),
      fiber: parseNutritionalValue(product["Fibre (%)"]),
      ash: parseNutritionalValue(product["Ceneri (%)"]),
      moisture: parseNutritionalValue(product["Umidità (%)"]),
    }
  };
};

// Funzione per assicurarsi che il database sia caricato
const ensureDatabaseLoaded = async (): Promise<ProductData[]> => {
  if (productDatabase.length === 0) {
    await initializeDatabase();
  }
  return productDatabase;
};

// Funzione per analizzare un prodotto
export const analyzeProduct = async (barcode: string): Promise<{
  product: ProductData | null;
  analysis: {
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
  } | null;
}> => {
  await ensureDatabaseLoaded();
  
  const product = productDatabase.find(p => p.Ean.toString() === barcode);
  
  if (!product) {
    return { product: null, analysis: null };
  }

  const transformedProduct = transformProduct(product);

  // Logica di analisi semplificata
  const { nutritionalValues } = transformedProduct;
  
  const analyzeNutrient = (value: number, type: 'protein' | 'fat' | 'fiber' | 'ash' | 'moisture'): 'excellent' | 'good' | 'fair' | 'poor' => {
    const ranges = {
      protein: { excellent: [25, 40], good: [20, 25], fair: [15, 20], poor: [0, 15] },
      fat: { excellent: [15, 20], good: [10, 15], fair: [8, 10], poor: [0, 8] },
      fiber: { excellent: [2, 4], good: [1, 2], fair: [0.5, 1], poor: [0, 0.5] },
      ash: { excellent: [5, 8], good: [8, 10], fair: [10, 12], poor: [12, 100] },
      moisture: { excellent: [8, 10], good: [6, 8], fair: [4, 6], poor: [0, 4] }
    };

    const range = ranges[type];
    if (value >= range.excellent[0] && value <= range.excellent[1]) return 'excellent';
    if (value >= range.good[0] && value <= range.good[1]) return 'good';
    if (value >= range.fair[0] && value <= range.fair[1]) return 'fair';
    return 'poor';
  };

  const nutritionalAnalysis = [
    {
      label: 'Proteine',
      value: nutritionalValues.protein,
      status: analyzeNutrient(nutritionalValues.protein, 'protein'),
      icon: 'protein'
    },
    {
      label: 'Grassi',
      value: nutritionalValues.fat,
      status: analyzeNutrient(nutritionalValues.fat, 'fat'),
      icon: 'fat'
    },
    {
      label: 'Fibre',
      value: nutritionalValues.fiber,
      status: analyzeNutrient(nutritionalValues.fiber, 'fiber'),
      icon: 'fiber'
    },
    {
      label: 'Ceneri',
      value: nutritionalValues.ash,
      status: analyzeNutrient(nutritionalValues.ash, 'ash'),
      icon: 'ash'
    },
    {
      label: 'Umidità',
      value: nutritionalValues.moisture,
      status: analyzeNutrient(nutritionalValues.moisture, 'moisture'),
      icon: 'moisture'
    }
  ];

  // Calcolo punteggio complessivo
  const scores = nutritionalAnalysis.map(n => {
    switch (n.status) {
      case 'excellent': return 100;
      case 'good': return 80;
      case 'fair': return 60;
      case 'poor': return 40;
      default: return 0;
    }
  });

  const overallScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
  
  // Nuovo sistema di valutazione
  let evaluationStatus: 'approved' | 'could-be-better' | 'not-approved';
  let evaluationLabel: string;
  let recommendation: string;

  if (overallScore >= 65) {
    evaluationStatus = 'approved';
    evaluationLabel = 'APPROVATO';
    recommendation = 'Questo prodotto presenta un ottimo equilibrio nutrizionale per il tuo pet. È una scelta eccellente.';
  } else if (overallScore >= 51) {
    evaluationStatus = 'could-be-better';
    evaluationLabel = 'ACCETTABILE';
    recommendation = 'Questo prodotto è accettabile ma esistono alternative migliori. Considera prodotti con valori nutrizionali più bilanciati.';
  } else {
    evaluationStatus = 'not-approved';
    evaluationLabel = 'NON APPROVATO';
    recommendation = 'Questo prodotto non è raccomandato per il tuo pet. Ti consigliamo di scegliere un\'alternativa con migliori valori nutrizionali.';
  }

  return {
    product: transformedProduct,
    analysis: {
      overallScore,
      evaluationStatus,
      evaluationLabel,
      nutritionalValues: nutritionalAnalysis,
      recommendation
    }
  };
};

// Funzione per cercare prodotti per nome
export const searchProductByName = async (searchTerm: string): Promise<ProductData[]> => {
  await ensureDatabaseLoaded();
  
  const term = searchTerm.toLowerCase();
  const results = productDatabase.filter(product => 
    product.title.toLowerCase().includes(term) ||
    product.brand.toLowerCase().includes(term) ||
    product.category.toLowerCase().includes(term)
  );
  
  return results.map(transformProduct);
};

// Funzione per ottenere tutti i prodotti (utile per debugging)
export const getAllProducts = async (): Promise<ProductData[]> => {
  await ensureDatabaseLoaded();
  return productDatabase.map(transformProduct);
};

// Esporta anche il database per accesso diretto se necessario
export const getProductDatabase = () => productDatabase;

// Inizializza automaticamente il database quando il modulo viene importato
initializeDatabase();