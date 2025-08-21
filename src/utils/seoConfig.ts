// Utilità per la gestione SEO dinamica
export interface SEOMetaData {
  title: string;
  description: string;
  keywords?: string;
  canonicalUrl?: string;
  ogImage?: string;
  ogType?: string;
  structuredData?: object;
}

// Configurazione SEO predefinita per ogni pagina
export const SEOCONFIG = {
  home: {
    title: "PetScan - Analisi alimentazione cani e gatti | Come Yuka per animali",
    description: "PetScan è il primo servizio in Italia per analizzare l'alimentazione di cani e gatti. Scopri se il cibo che dai è sano, sicuro e adatto al tuo animale. Come Yuka, ma per i tuoi amici a quattro zampe. Analisi gratuita con intelligenza artificiale avanzata.",
    keywords: "alimentazione cani, alimentazione gatti, analisi cibo animali, Yuka animali, pet food, cibo sano cani gatti, valutazione ingredienti, PetScan Pro, intelligenza artificiale",
    canonicalUrl: "https://mypetscan.it"
  },
  pro: {
    title: "PetScan Pro - Analisi Alimentare Premium",
    description: "Piano premium per analisi avanzata dell'alimentazione di cani e gatti con funzionalità esclusive",
    keywords: "PetScan Pro, analisi premium, funzionalità esclusive, cani, gatti, alimentazione",
    canonicalUrl: "https://mypetscan.it/pro"
  },
  dogAnalysis: {
    title: "Analisi Cibo per Cani - PetScan",
    description: "Analisi completa e personalizzata del cibo per cani con PetScan. Scopri se l'alimentazione del tuo cane è sana e bilanciata.",
    keywords: "analisi cibo cani, alimentazione cani, cibo sano cani, PetScan",
    canonicalUrl: "https://mypetscan.it/analisi-cane"
  },
  catAnalysis: {
    title: "Analisi Cibo per Gatti - PetScan",
    description: "Analisi completa e personalizzata del cibo per gatti con PetScan. Scopri se l'alimentazione del tuo gatto è sana e bilanciata.",
    keywords: "analisi cibo gatti, alimentazione gatti, cibo sano gatti, PetScan",
    canonicalUrl: "https://mypetscan.it/analisi-gatto"
  },
  about: {
    title: "Chi siamo - PetScan",
    description: "Scopri chi siamo dietro PetScan, il servizio di analisi dell'alimentazione per cani e gatti con intelligenza artificiale.",
    keywords: "chi siamo, petscan, analisi alimentare, intelligenza artificiale, cani, gatti",
    canonicalUrl: "https://mypetscan.it/chi-ce-dietro"
  },
  contacts: {
    title: "Contatti - PetScan",
    description: "Contatta PetScan per supporto e informazioni sul servizio di analisi dell'alimentazione per cani e gatti",
    keywords: "contatti, supporto, petscan, analisi alimentare",
    canonicalUrl: "https://mypetscan.it/contacts"
  },
  privacy: {
    title: "Privacy Policy - PetScan",
    description: "Informativa sulla privacy di PetScan - Come raccogliamo e utilizziamo i tuoi dati per il servizio di analisi dell'alimentazione per cani e gatti",
    keywords: "privacy policy, petscan, protezione dati, GDPR, informativa privacy",
    canonicalUrl: "https://mypetscan.it/privacy-policy"
  },
  terms: {
    title: "Termini di Servizio - PetScan",
    description: "Termini e condizioni per l'utilizzo del servizio PetScan - Analisi dell'alimentazione per cani e gatti",
    keywords: "termini di servizio, petscan, condizioni d'uso, servizio analisi alimentare",
    canonicalUrl: "https://mypetscan.it/terms-of-service"
  },
  insertProduct: {
    title: "Inserisci Prodotto - PetScan",
    description: "Inserisci e analizza nuovi prodotti alimentari per cani e gatti con PetScan. Contribuisci alla crescita del database e ottieni analisi immediate.",
    keywords: "inserisci prodotto, analisi prodotti, database petscan, contribuisci",
    canonicalUrl: "https://mypetscan.it/inserisci-prod"
  },
  discoverPro: {
    title: "Scopri PetScan - Come Yuka per animali",
    description: "Scopri come PetScan utilizza l'intelligenza artificiale avanzata e studi scientifici peer-reviewed per analizzare l'alimentazione di cani e gatti, come Yuka ma per i nostri amici a 4 zampe.",
    keywords: "scopri petscan, intelligenza artificiale, studi scientifici, Yuka animali",
    canonicalUrl: "https://mypetscan.it/scopri-petscan-pro"
  }
};

// Funzione per generare meta tag dinamici
export function generateMetaTags(page: keyof typeof SEOCONFIG, customData?: Partial<SEOMetaData>): SEOMetaData {
  const baseConfig = SEOCONFIG[page];
  return {
    ...baseConfig,
    ...customData
  };
}

// Funzione per aggiornare i meta tag dinamicamente
export function updateMetaTags(metaData: SEOMetaData): void {
  // Aggiorna il title
  if (metaData.title) {
    document.title = metaData.title;
  }

  // Aggiorna la meta description
  let metaDescription = document.querySelector('meta[name="description"]');
  if (!metaDescription) {
    metaDescription = document.createElement('meta');
    metaDescription.setAttribute('name', 'description');
    document.head.appendChild(metaDescription);
  }
  metaDescription.setAttribute('content', metaData.description);

  // Aggiorna i keywords
  if (metaData.keywords) {
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta');
      metaKeywords.setAttribute('name', 'keywords');
      document.head.appendChild(metaKeywords);
    }
    metaKeywords.setAttribute('content', metaData.keywords);
  }

  // Aggiorna il canonical
  if (metaData.canonicalUrl) {
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', metaData.canonicalUrl);
  }

  // Aggiorna Open Graph
  this.updateOpenGraphTags(metaData);

  // Aggiorna Twitter Card
  this.updateTwitterTags(metaData);

  // Aggiorna Structured Data
  if (metaData.structuredData) {
    this.updateStructuredData(metaData.structuredData);
  }
}

// Funzione per aggiornare Open Graph tags
function updateOpenGraphTags(metaData: SEOMetaData): void {
  const ogTags = [
    { property: 'og:title', content: metaData.title },
    { property: 'og:description', content: metaData.description },
    { property: 'og:type', content: metaData.ogType || 'website' },
    { property: 'og:url', content: metaData.canonicalUrl || 'https://mypetscan.it' },
    { property: 'og:image', content: metaData.ogImage || 'https://mypetscan.it/lovable-uploads/a33f1742-394c-45a9-8f25-eb7357254f92.png' },
    { property: 'og:locale', content: 'it_IT' },
    { property: 'og:site_name', content: 'PetScan' }
  ];

  ogTags.forEach(tag => {
    let metaTag = document.querySelector(`meta[property="${tag.property}"]`);
    if (!metaTag) {
      metaTag = document.createElement('meta');
      metaTag.setAttribute('property', tag.property);
      document.head.appendChild(metaTag);
    }
    metaTag.setAttribute('content', tag.content);
  });
}

// Funzione per aggiornare Twitter Card tags
function updateTwitterTags(metaData: SEOMetaData): void {
  const twitterTags = [
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:site', content: '@petscan_it' },
    { name: 'twitter:title', content: metaData.title },
    { name: 'twitter:description', content: metaData.description },
    { name: 'twitter:image', content: metaData.ogImage || 'https://mypetscan.it/lovable-uploads/a33f1742-394c-45a9-8f25-eb7357254f92.png' }
  ];

  twitterTags.forEach(tag => {
    let metaTag = document.querySelector(`meta[name="${tag.name}"]`);
    if (!metaTag) {
      metaTag = document.createElement('meta');
      metaTag.setAttribute('name', tag.name);
      document.head.appendChild(metaTag);
    }
    metaTag.setAttribute('content', tag.content);
  });
}

// Funzione per aggiornare Structured Data
function updateStructuredData(structuredData: object): void {
  // Rimuovi structured data esistenti
  const existingScripts = document.querySelectorAll('script[type="application/ld+json"]');
  existingScripts.forEach(script => script.remove());

  // Aggiungi nuovo structured data
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(structuredData);
  document.head.appendChild(script);
}

// Funzione per aggiornare la navigazione
export function updateNavigation(url: string): void {
  // Aggiorna l'URL senza ricaricare la pagina
  if (window.history && window.history.pushState) {
    window.history.pushState({}, '', url);
  }

  // Aggiorna i meta tag in base alla nuova URL
  const path = new URL(url).pathname;
  const page = this.getPageFromPath(path);
  
  if (page && SEOCONFIG[page]) {
    updateMetaTags(SEOCONFIG[page]);
  }
}

// Funzione per ottenere la pagina dal path
function getPageFromPath(path: string): keyof typeof SEOCONFIG | null {
  const pathMap: Record<string, keyof typeof SEOCONFIG> = {
    '/': 'home',
    '/pro': 'pro',
    '/analisi-cane': 'dogAnalysis',
    '/analisi-gatto': 'catAnalysis',
    '/chi-ce-dietro': 'about',
    '/contacts': 'contacts',
    '/privacy-policy': 'privacy',
    '/terms-of-service': 'terms',
    '/inserisci-prod': 'insertProduct',
    '/scopri-petscan-pro': 'discoverPro'
  };

  return pathMap[path] || null;
}

// Funzione per generare sitemap dinamico
export function generateSitemap(): string {
  const baseUrl = 'https://mypetscan.it';
  const currentDate = new Date().toISOString().split('T')[0];
  
  const urls = Object.values(SEOCONFIG).map(config => ({
    loc: config.canonicalUrl || baseUrl,
    lastmod: currentDate,
    changefreq: 'weekly',
    priority: config.canonicalUrl === baseUrl ? '1.0' : '0.8'
  }));

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  return sitemap;
}

// Funzione per validare meta tags
export function validateMetaTags(metaData: SEOMetaData): string[] {
  const errors: string[] = [];

  if (!metaData.title || metaData.title.length < 10) {
    errors.push('Il title deve essere di almeno 10 caratteri');
  }

  if (!metaData.description || metaData.description.length < 50) {
    errors.push('La description deve essere di almeno 50 caratteri');
  }

  if (metaData.description && metaData.description.length > 160) {
    errors.push('La description non deve superare i 160 caratteri');
  }

  if (!metaData.canonicalUrl) {
    errors.push('URL canonico mancante');
  }

  return errors;
}

// Funzione per ottimizzare i meta tags
export function optimizeMetaTags(metaData: SEOMetaData): SEOMetaData {
  const optimized = { ...metaData };

  // Ottimizza il title
  if (optimized.title && !optimized.title.includes('PetScan')) {
    optimized.title = `${optimized.title} | PetScan`;
  }

  // Ottimizza la description
  if (optimized.description && optimized.description.length > 160) {
    optimized.description = optimized.description.substring(0, 157) + '...';
  }

  // Aggiungi keywords se mancanti
  if (!optimized.keywords) {
    optimized.keywords = 'PetScan, analisi alimentare, cani, gatti, intelligenza artificiale';
  }

  return optimized;
}

export default {
  SEOCONFIG,
  generateMetaTags,
  updateMetaTags,
  updateNavigation,
  generateSitemap,
  validateMetaTags,
  optimizeMetaTags
};
