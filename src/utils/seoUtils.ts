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
    description: "Piano premium per analisi avanzata dell'alimentazione di cani e gatti con funzionalità esclusive e analisi illimitate.",
    keywords: "PetScan Pro, analisi alimentare premium, funzionalità avanzate, cani gatti, nutrizione animale",
    canonicalUrl: "https://mypetscan.it/pro"
  },
  analisiCane: {
    title: "Analisi Cibo per Cani - PetScan",
    description: "Analisi completa e personalizzata del cibo per cani con PetScan. Scopri se l'alimentazione del tuo cane è sana e bilanciata.",
    keywords: "analisi cibo cani, alimentazione cani, nutrizione canina, PetScan, cibo sano cani",
    canonicalUrl: "https://mypetscan.it/analisi-cane"
  },
  analisiGatto: {
    title: "Analisi Cibo per Gatti - PetScan",
    description: "Analisi completa e personalizzata del cibo per gatti con PetScan. Scopri se l'alimentazione del tuo gatto è sana e bilanciata.",
    keywords: "analisi cibo gatti, alimentazione gatti, nutrizione felina, PetScan, cibo sano gatti",
    canonicalUrl: "https://mypetscan.it/analisi-gatto"
  },
  chiSiamo: {
    title: "Chi siamo - PetScan",
    description: "Scopri chi siamo dietro PetScan, il servizio di analisi dell'alimentazione per cani e gatti con intelligenza artificiale.",
    keywords: "chi siamo, petscan, analisi alimentare, intelligenza artificiale, cani, gatti",
    canonicalUrl: "https://mypetscan.it/chi-ce-dietro"
  },
  contatti: {
    title: "Contatti - PetScan",
    description: "Contatta PetScan per supporto e informazioni sul servizio di analisi dell'alimentazione per cani e gatti.",
    keywords: "contatti petscan, supporto petscan, informazioni petscan, analisi alimentare",
    canonicalUrl: "https://mypetscan.it/contacts"
  },
  privacy: {
    title: "Privacy Policy - PetScan",
    description: "Informativa sulla privacy di PetScan - Come raccogliamo e utilizziamo i tuoi dati per il servizio di analisi dell'alimentazione per cani e gatti.",
    keywords: "privacy policy, petscan, protezione dati, GDPR, informativa privacy",
    canonicalUrl: "https://mypetscan.it/privacy-policy"
  },
  termini: {
    title: "Termini di Servizio - PetScan",
    description: "Termini e condizioni per l'utilizzo del servizio PetScan - Analisi dell'alimentazione per cani e gatti.",
    keywords: "termini di servizio, petscan, condizioni d'uso, servizio analisi alimentare",
    canonicalUrl: "https://mypetscan.it/terms-of-service"
  },
  scopri: {
    title: "Scopri PetScan - Come Yuka per animali",
    description: "Scopri come PetScan utilizza l'intelligenza artificiale avanzata e studi scientifici peer-reviewed per analizzare l'alimentazione di cani e gatti, come Yuka ma per i nostri amici a 4 zampe.",
    keywords: "scopri petscan, intelligenza artificiale, studi scientifici, Yuka animali, analisi alimentare",
    canonicalUrl: "https://mypetscan.it/scopri-petscan-pro"
  },
  inserisci: {
    title: "Inserisci Prodotto - PetScan",
    description: "Inserisci e analizza nuovi prodotti alimentari per cani e gatti con PetScan. Contribuisci alla crescita del database e ottieni analisi immediate.",
    keywords: "inserisci prodotto, petscan, database prodotti, analisi alimentare, contribuisci",
    canonicalUrl: "https://mypetscan.it/inserisci-prod"
  }
};

// Funzione per generare meta tag dinamici
export function generateMetaTags(page: keyof typeof SEOCONFIG, customData?: Partial<SEOMetaData>): SEOMetaData {
  const baseConfig = SEOCONFIG[page];
  const customConfig = customData || {};
  
  return {
    ...baseConfig,
    ...customConfig,
    title: customConfig.title || baseConfig.title,
    description: customConfig.description || baseConfig.description,
    canonicalUrl: customConfig.canonicalUrl || baseConfig.canonicalUrl
  };
}

// Funzione per aggiornare i meta tag dinamicamente
export function updateMetaTags(metaData: SEOMetaData): void {
  // Aggiorna title
  if (document.title !== metaData.title) {
    document.title = metaData.title;
  }

  // Aggiorna meta description
  let metaDescription = document.querySelector('meta[name="description"]');
  if (!metaDescription) {
    metaDescription = document.createElement('meta');
    metaDescription.setAttribute('name', 'description');
    document.head.appendChild(metaDescription);
  }
  metaDescription.setAttribute('content', metaData.description);

  // Aggiorna meta keywords se presenti
  if (metaData.keywords) {
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta');
      metaKeywords.setAttribute('name', 'keywords');
      document.head.appendChild(metaKeywords);
    }
    metaKeywords.setAttribute('content', metaData.keywords);
  }

  // Aggiorna canonical URL
  if (metaData.canonicalUrl) {
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', metaData.canonicalUrl);
  }

  // Aggiorna Open Graph tags
  updateOpenGraphTags(metaData);
}

// Funzione per aggiornare i tag Open Graph
function updateOpenGraphTags(metaData: SEOMetaData): void {
  const ogTags = [
    { property: 'og:title', content: metaData.title },
    { property: 'og:description', content: metaData.description },
    { property: 'og:url', content: metaData.canonicalUrl || window.location.href },
    { property: 'og:type', content: metaData.ogType || 'website' }
  ];

  if (metaData.ogImage) {
    ogTags.push({ property: 'og:image', content: metaData.ogImage });
  }

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

// Funzione per generare structured data
export function generateStructuredData(type: string, data: any): object {
  const baseStructuredData = {
    "@context": "https://schema.org",
    "@type": type,
    "url": window.location.href,
    "dateModified": new Date().toISOString()
  };

  return {
    ...baseStructuredData,
    ...data
  };
}

// Funzione per aggiornare structured data
export function updateStructuredData(structuredData: object): void {
  let scriptTag = document.querySelector('script[type="application/ld+json"]');
  if (!scriptTag) {
    scriptTag = document.createElement('script');
    scriptTag.setAttribute('type', 'application/ld+json');
    document.head.appendChild(scriptTag);
  }
  scriptTag.textContent = JSON.stringify(structuredData);
}

// Funzione per gestire la navigazione e aggiornare SEO
export function handleNavigationUpdate(page: keyof typeof SEOCONFIG, customData?: Partial<SEOMetaData>): void {
  const metaData = generateMetaTags(page, customData);
  updateMetaTags(metaData);
  
  if (metaData.structuredData) {
    updateStructuredData(metaData.structuredData);
  }
  
  // Aggiorna l'URL senza ricaricare la pagina
  if (metaData.canonicalUrl && window.location.href !== metaData.canonicalUrl) {
    window.history.replaceState({}, '', metaData.canonicalUrl);
  }
}
