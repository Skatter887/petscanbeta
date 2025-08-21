// Utilità per la gestione dinamica delle meta tag e del SEO
export interface MetaTagConfig {
  name?: string;
  property?: string;
  content: string;
  httpEquiv?: string;
}

export interface MetaTagSet {
  title: string;
  description: string;
  keywords?: string;
  canonical?: string;
  ogTags: MetaTagConfig[];
  twitterTags: MetaTagConfig[];
  additionalTags: MetaTagConfig[];
}

class MetaTagManager {
  private currentTags: MetaTagSet | null = null;

  // Aggiorna le meta tag della pagina
  updateMetaTags(tags: MetaTagSet): void {
    this.currentTags = tags;
    
    // Aggiorna title
    this.updateTitle(tags.title);
    
    // Aggiorna meta description
    this.updateMetaDescription(tags.description);
    
    // Aggiorna meta keywords
    if (tags.keywords) {
      this.updateMetaKeywords(tags.keywords);
    }
    
    // Aggiorna canonical URL
    if (tags.canonical) {
      this.updateCanonical(tags.canonical);
    }
    
    // Aggiorna Open Graph tags
    this.updateOpenGraphTags(tags.ogTags);
    
    // Aggiorna Twitter Card tags
    this.updateTwitterTags(tags.twitterTags);
    
    // Aggiorna tag aggiuntivi
    this.updateAdditionalTags(tags.additionalTags);
  }

  // Aggiorna il title della pagina
  private updateTitle(title: string): void {
    if (document.title !== title) {
      document.title = title;
    }
  }

  // Aggiorna la meta description
  private updateMetaDescription(description: string): void {
    let metaDescription = document.querySelector('meta[name="description"]');
    
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    
    metaDescription.setAttribute('content', description);
  }

  // Aggiorna le meta keywords
  private updateMetaKeywords(keywords: string): void {
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta');
      metaKeywords.setAttribute('name', 'keywords');
      document.head.appendChild(metaKeywords);
    }
    
    metaKeywords.setAttribute('content', keywords);
  }

  // Aggiorna il canonical URL
  private updateCanonical(url: string): void {
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    
    canonicalLink.setAttribute('href', url);
  }

  // Aggiorna i tag Open Graph
  private updateOpenGraphTags(ogTags: MetaTagConfig[]): void {
    ogTags.forEach(tag => {
      if (tag.property) {
        let metaTag = document.querySelector(`meta[property="${tag.property}"]`);
        
        if (!metaTag) {
          metaTag = document.createElement('meta');
          metaTag.setAttribute('property', tag.property);
          document.head.appendChild(metaTag);
        }
        
        metaTag.setAttribute('content', tag.content);
      }
    });
  }

  // Aggiorna i tag Twitter Card
  private updateTwitterTags(twitterTags: MetaTagConfig[]): void {
    twitterTags.forEach(tag => {
      if (tag.name) {
        let metaTag = document.querySelector(`meta[name="${tag.name}"]`);
        
        if (!metaTag) {
          metaTag = document.createElement('meta');
          metaTag.setAttribute('name', tag.name);
          document.head.appendChild(metaTag);
        }
        
        metaTag.setAttribute('content', tag.content);
      }
    });
  }

  // Aggiorna tag aggiuntivi
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
        
        if (tag.name) {
          metaTag.setAttribute('name', tag.name);
        } else if (tag.property) {
          metaTag.setAttribute('property', tag.property);
        } else if (tag.httpEquiv) {
          metaTag.setAttribute('http-equiv', tag.httpEquiv);
        }
        
        document.head.appendChild(metaTag);
      }
      
      metaTag.setAttribute('content', tag.content);
    });
  }

  // Ottieni le meta tag attuali
  getCurrentTags(): MetaTagSet | null {
    return this.currentTags;
  }

  // Rimuovi tutte le meta tag personalizzate
  clearCustomMetaTags(): void {
    // Rimuovi Open Graph tags
    const ogTags = document.querySelectorAll('meta[property^="og:"]');
    ogTags.forEach(tag => tag.remove());
    
    // Rimuovi Twitter Card tags
    const twitterTags = document.querySelectorAll('meta[name^="twitter:"]');
    twitterTags.forEach(tag => tag.remove());
    
    // Rimuovi tag aggiuntivi personalizzati
    const customTags = document.querySelectorAll('meta[data-custom="true"]');
    customTags.forEach(tag => tag.remove());
    
    this.currentTags = null;
  }

  // Verifica se una meta tag esiste
  hasMetaTag(name?: string, property?: string, httpEquiv?: string): boolean {
    let selector = '';
    
    if (name) {
      selector = `meta[name="${name}"]`;
    } else if (property) {
      selector = `meta[property="${property}"]`;
    } else if (httpEquiv) {
      selector = `meta[http-equiv="${httpEquiv}"]`;
    }
    
    if (!selector) return false;
    
    return document.querySelector(selector) !== null;
  }

  // Ottieni il contenuto di una meta tag
  getMetaTagContent(name?: string, property?: string, httpEquiv?: string): string | null {
    let selector = '';
    
    if (name) {
      selector = `meta[name="${name}"]`;
    } else if (property) {
      selector = `meta[property="${property}"]`;
    } else if (httpEquiv) {
      selector = `meta[http-equiv="${httpEquiv}"]`;
    }
    
    if (!selector) return null;
    
    const metaTag = document.querySelector(selector) as HTMLMetaElement;
    return metaTag ? metaTag.getAttribute('content') : null;
  }
}

// Istanza globale del meta tag manager
export const metaTagManager = new MetaTagManager();

// Funzioni di utilità per le meta tag
export function updatePageMetaTags(tags: MetaTagSet): void {
  metaTagManager.updateMetaTags(tags);
}

export function getPageMetaTags(): MetaTagSet | null {
  return metaTagManager.getCurrentTags();
}

export function clearPageMetaTags(): void {
  metaTagManager.clearCustomMetaTags();
}

// Configurazioni predefinite per le meta tag
export const DEFAULT_META_TAGS: Record<string, MetaTagSet> = {
  home: {
    title: "PetScan - Analisi alimentazione cani e gatti | Come Yuka per animali",
    description: "PetScan è il primo servizio in Italia per analizzare l'alimentazione di cani e gatti. Scopri se il cibo che dai è sano, sicuro e adatto al tuo animale. Come Yuka, ma per i tuoi amici a quattro zampe. Analisi gratuita con intelligenza artificiale avanzata.",
    keywords: "alimentazione cani, alimentazione gatti, analisi cibo animali, Yuka animali, pet food, cibo sano cani gatti, valutazione ingredienti, PetScan Pro, intelligenza artificiale",
    canonical: "https://mypetscan.it",
    ogTags: [
      { property: "og:title", content: "PetScan - Analisi alimentazione cani e gatti | Come Yuka per animali" },
      { property: "og:description", content: "Il primo servizio in Italia per analizzare l'alimentazione di cani e gatti con intelligenza artificiale. Scopri se il cibo del tuo animale è davvero sano. Analisi gratuita e immediata." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://mypetscan.it" },
      { property: "og:image", content: "https://mypetscan.it/lovable-uploads/a33f1742-394c-45a9-8f25-eb7357254f92.png" },
      { property: "og:locale", content: "it_IT" },
      { property: "og:site_name", content: "PetScan" }
    ],
    twitterTags: [
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:site", content: "@petscan_it" },
      { name: "twitter:title", content: "PetScan - Analisi alimentazione cani e gatti" },
      { name: "twitter:description", content: "Il primo servizio in Italia per analizzare l'alimentazione di cani e gatti con intelligenza artificiale." },
      { name: "twitter:image", content: "https://mypetscan.it/lovable-uploads/a33f1742-394c-45a9-8f25-eb7357254f92.png" }
    ],
    additionalTags: [
      { name: "robots", content: "index, follow" },
      { name: "language", content: "Italian" },
      { name: "author", content: "PetScan" }
    ]
  }
};

// Funzione per applicare le meta tag predefinite
export function applyDefaultMetaTags(page: keyof typeof DEFAULT_META_TAGS): void {
  const tags = DEFAULT_META_TAGS[page];
  if (tags) {
    updatePageMetaTags(tags);
  }
}

// Funzione per creare meta tag personalizzate
export function createCustomMetaTags(
  title: string,
  description: string,
  keywords?: string,
  canonical?: string,
  ogImage?: string
): MetaTagSet {
  return {
    title,
    description,
    keywords,
    canonical,
    ogTags: [
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: canonical || window.location.href },
      { property: "og:image", content: ogImage || "https://mypetscan.it/lovable-uploads/a33f1742-394c-45a9-8f25-eb7357254f92.png" },
      { property: "og:locale", content: "it_IT" },
      { property: "og:site_name", content: "PetScan" }
    ],
    twitterTags: [
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:site", content: "@petscan_it" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
      { name: "twitter:image", content: ogImage || "https://mypetscan.it/lovable-uploads/a33f1742-394c-45a9-8f25-eb7357254f92.png" }
    ],
    additionalTags: [
      { name: "robots", content: "index, follow" },
      { name: "language", content: "Italian" },
      { name: "author", content: "PetScan" }
    ]
  };
}
