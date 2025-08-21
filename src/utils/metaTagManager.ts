// Utilità per la gestione dinamica delle meta tag e del SEO
export interface MetaTagConfig {
  name?: string;
  property?: string;
  httpEquiv?: string;
  content: string;
}

export interface MetaTagSet {
  title?: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  ogTags?: MetaTagConfig[];
  twitterTags?: MetaTagConfig[];
  additionalTags?: MetaTagConfig[];
}

class MetaTagManager {
  private currentTags: MetaTagSet | null = null;

  updateMetaTags(tags: MetaTagSet): void {
    this.currentTags = { ...tags };

    // Aggiorna title
    if (tags.title) {
      this.updateTitle(tags.title);
    }

    // Aggiorna meta description
    if (tags.description) {
      this.updateMetaDescription(tags.description);
    }

    // Aggiorna meta keywords
    if (tags.keywords) {
      this.updateMetaKeywords(tags.keywords);
    }

    // Aggiorna canonical
    if (tags.canonical) {
      this.updateCanonical(tags.canonical);
    }

    // Aggiorna Open Graph tags
    if (tags.ogTags) {
      this.updateOpenGraphTags(tags.ogTags);
    }

    // Aggiorna Twitter tags
    if (tags.twitterTags) {
      this.updateTwitterTags(tags.twitterTags);
    }

    // Aggiorna tag aggiuntivi
    if (tags.additionalTags) {
      this.updateAdditionalTags(tags.additionalTags);
    }
  }

  private updateTitle(title: string): void {
    document.title = title;
  }

  private updateMetaDescription(description: string): void {
    let metaDescription = document.querySelector('meta[name="description"]');
    
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    
    metaDescription.setAttribute('content', description);
  }

  private updateMetaKeywords(keywords: string): void {
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta');
      metaKeywords.setAttribute('name', 'keywords');
      document.head.appendChild(metaKeywords);
    }
    
    metaKeywords.setAttribute('content', keywords);
  }

  private updateCanonical(url: string): void {
    let canonical = document.querySelector('link[rel="canonical"]');
    
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    
    canonical.setAttribute('href', url);
  }

  private updateOpenGraphTags(ogTags: MetaTagConfig[]): void {
    ogTags.forEach(tag => {
      let metaTag = document.querySelector(`meta[property="${tag.property}"]`);
      
      if (!metaTag) {
        metaTag = document.createElement('meta');
        metaTag.setAttribute('property', tag.property!);
        document.head.appendChild(metaTag);
      }
      
      metaTag.setAttribute('content', tag.content);
    });
  }

  private updateTwitterTags(twitterTags: MetaTagConfig[]): void {
    twitterTags.forEach(tag => {
      let metaTag = document.querySelector(`meta[name="${tag.name}"]`);
      
      if (!metaTag) {
        metaTag = document.createElement('meta');
        metaTag.setAttribute('name', tag.name!);
        document.head.appendChild(metaTag);
      }
      
      metaTag.setAttribute('content', tag.content);
    });
  }

  private updateAdditionalTags(additionalTags: MetaTagConfig[]): void {
    additionalTags.forEach(tag => {
      let metaTag: HTMLMetaElement | null = null;
      
      if (tag.name) {
        metaTag = document.querySelector(`meta[name="${tag.name}"]`);
      } else if (tag.property) {
        metaTag = document.querySelector(`meta[property="${tag.property}"]`);
      } else if (tag.httpEquiv) {
        metaTag = document.querySelector(`meta[http-equiv="${tag.httpEquiv}"]`);
      }
      
      if (!metaTag) {
        metaTag = document.createElement('meta');
        if (tag.name) metaTag.setAttribute('name', tag.name);
        if (tag.property) metaTag.setAttribute('property', tag.property);
        if (tag.httpEquiv) metaTag.setAttribute('http-equiv', tag.httpEquiv);
        document.head.appendChild(metaTag);
      }
      
      metaTag.setAttribute('content', tag.content);
    });
  }

  getCurrentTags(): MetaTagSet | null {
    return this.currentTags ? { ...this.currentTags } : null;
  }

  clearCustomMetaTags(): void {
    // Rimuovi solo i tag personalizzati, mantieni quelli base
    const customTags = document.querySelectorAll('meta[property^="og:"], meta[name^="twitter:"], meta[name="keywords"]');
    customTags.forEach(tag => tag.remove());
    
    this.currentTags = null;
  }

  hasMetaTag(name?: string, property?: string, httpEquiv?: string): boolean {
    if (name) {
      return !!document.querySelector(`meta[name="${name}"]`);
    }
    if (property) {
      return !!document.querySelector(`meta[property="${property}"]`);
    }
    if (httpEquiv) {
      return !!document.querySelector(`meta[http-equiv="${httpEquiv}"]`);
    }
    return false;
  }

  getMetaTagContent(name?: string, property?: string, httpEquiv?: string): string | null {
    let metaTag: HTMLMetaElement | null = null;
    
    if (name) {
      metaTag = document.querySelector(`meta[name="${name}"]`);
    } else if (property) {
      metaTag = document.querySelector(`meta[property="${property}"]`);
    } else if (httpEquiv) {
      metaTag = document.querySelector(`meta[http-equiv="${httpEquiv}"]`);
    }
    
    return metaTag ? metaTag.getAttribute('content') : null;
  }
}

// Istanza globale del meta tag manager
export const metaTagManager = new MetaTagManager();

// Configurazioni predefinite per diversi tipi di pagina
export const DEFAULT_META_TAGS = {
  // Homepage
  home: {
    title: "PetScan - Analisi alimentazione cani e gatti | Come Yuka per animali",
    description: "PetScan è il primo servizio in Italia per analizzare l'alimentazione di cani e gatti. Scopri se il cibo che dai è sano, sicuro e adatto al tuo animale.",
    keywords: "alimentazione cani, alimentazione gatti, analisi cibo animali, Yuka animali, pet food",
    canonical: "https://mypetscan.it",
    ogTags: [
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "it_IT" },
      { property: "og:site_name", content: "PetScan" }
    ],
    twitterTags: [
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:site", content: "@petscan_it" }
    ]
  },

  // Pagina Pro
  pro: {
    title: "PetScan Pro - Analisi Alimentare Premium",
    description: "Piano premium per analisi avanzata dell'alimentazione di cani e gatti con funzionalità esclusive",
    keywords: "PetScan Pro, analisi premium, funzionalità esclusive",
    canonical: "https://mypetscan.it/pro",
    ogTags: [
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "it_IT" }
    ],
    twitterTags: [
      { name: "twitter:card", content: "summary_large_image" }
    ]
  },

  // Pagina Analisi
  analysis: {
    title: "Analisi Alimentare - PetScan",
    description: "Analisi completa e personalizzata del cibo per cani e gatti con PetScan",
    keywords: "analisi cibo, alimentazione, cani, gatti, PetScan",
    canonical: "https://mypetscan.it/analisi",
    ogTags: [
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "it_IT" }
    ],
    twitterTags: [
      { name: "twitter:card", content: "summary_large_image" }
    ]
  },

  // Pagina Chi Siamo
  about: {
    title: "Chi siamo - PetScan",
    description: "Scopri chi siamo dietro PetScan, il servizio di analisi dell'alimentazione per cani e gatti",
    keywords: "chi siamo, petscan, analisi alimentare, intelligenza artificiale",
    canonical: "https://mypetscan.it/chi-ce-dietro",
    ogTags: [
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "it_IT" }
    ],
    twitterTags: [
      { name: "twitter:card", content: "summary_large_image" }
    ]
  }
};

// Funzioni di utilità per la gestione delle meta tag
export function applyMetaTags(pageType: keyof typeof DEFAULT_META_TAGS, customData?: Partial<MetaTagSet>): void {
  const baseTags = DEFAULT_META_TAGS[pageType];
  const finalTags = { ...baseTags, ...customData };
  
  metaTagManager.updateMetaTags(finalTags);
}

export function createMetaTagSet(config: Partial<MetaTagSet>): MetaTagSet {
  return {
    title: config.title,
    description: config.description,
    keywords: config.keywords,
    canonical: config.canonical,
    ogTags: config.ogTags || [],
    twitterTags: config.twitterTags || [],
    additionalTags: config.additionalTags || []
  };
}

export function addStructuredData(structuredData: object): void {
  // Rimuovi structured data esistenti
  const existingScripts = document.querySelectorAll('script[type="application/ld+json"]');
  existingScripts.forEach(script => script.remove());

  // Aggiungi nuovo structured data
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(structuredData);
  document.head.appendChild(script);
}

export function updatePageMetaTags(
  title?: string,
  description?: string,
  keywords?: string,
  canonical?: string,
  ogImage?: string
): void {
  const metaTags: MetaTagSet = {};
  
  if (title) metaTags.title = title;
  if (description) metaTags.description = description;
  if (keywords) metaTags.keywords = keywords;
  if (canonical) metaTags.canonical = canonical;
  
  if (ogImage) {
    metaTags.ogTags = [
      { property: 'og:image', content: ogImage }
    ];
    metaTags.twitterTags = [
      { name: 'twitter:image', content: ogImage }
    ];
  }
  
  metaTagManager.updateMetaTags(metaTags);
}

export function setPageTitle(title: string): void {
  document.title = title;
}

export function setPageDescription(description: string): void {
  let metaDescription = document.querySelector('meta[name="description"]');
  
  if (!metaDescription) {
    metaDescription = document.createElement('meta');
    metaDescription.setAttribute('name', 'description');
    document.head.appendChild(metaDescription);
  }
  
  metaDescription.setAttribute('content', description);
}

export function setCanonicalUrl(url: string): void {
  let canonical = document.querySelector('link[rel="canonical"]');
  
  if (!canonical) {
    canonical = document.createElement('link');
    canonical.setAttribute('rel', 'canonical');
    document.head.appendChild(canonical);
  }
  
  canonical.setAttribute('href', url);
}

export default metaTagManager;
