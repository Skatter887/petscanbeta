import emailjs from '@emailjs/browser';
import { EMAILJS_CONFIG } from '@/config/emailjs';

export interface ProductRequestData {
  ean: string;
  brand: string;
  productName: string;
  email?: string;
}

export interface ProductRequestResult {
  success: boolean;
  message: string;
}

const SUBMISSIONS_KEY = 'petscan_product_requests';
const MAX_DAILY_REQUESTS = 5;

interface RequestData {
  count: number;
  date: string;
}

const getToday = () => {
  const now = new Date();
  return now.toISOString().split('T')[0]; // YYYY-MM-DD format
};

const checkRequestLimit = (): { canRequest: boolean; remaining: number } => {
  const stored = localStorage.getItem(SUBMISSIONS_KEY);
  const today = getToday();

  if (!stored) {
    return { canRequest: true, remaining: MAX_DAILY_REQUESTS };
  }

  const data: RequestData = JSON.parse(stored);

  // If it's a new day, reset the counter
  if (data.date !== today) {
    return { canRequest: true, remaining: MAX_DAILY_REQUESTS };
  }

  // Check if user has reached the limit
  const remaining = MAX_DAILY_REQUESTS - data.count;
  return { canRequest: remaining > 0, remaining };
};

const recordRequest = () => {
  const today = getToday();
  const stored = localStorage.getItem(SUBMISSIONS_KEY);

  let data: RequestData;

  if (!stored) {
    data = { count: 1, date: today };
  } else {
    const existing: RequestData = JSON.parse(stored);
    
    if (existing.date !== today) {
      // New day, reset counter
      data = { count: 1, date: today };
    } else {
      // Same day, increment counter
      data = { count: existing.count + 1, date: today };
    }
  }

  localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(data));
};

export const sendProductRequest = async (requestData: ProductRequestData): Promise<ProductRequestResult> => {
  try {
    // Check request limit first
    const { canRequest, remaining } = checkRequestLimit();
    
    if (!canRequest) {
      return {
        success: false,
        message: `Hai raggiunto il limite giornaliero di ${MAX_DAILY_REQUESTS} richieste. Potrai inviare una nuova richiesta domani. Grazie per la comprensione! 🐾`
      };
    }

    console.log('Sending product request with data:', requestData);
    console.log('EmailJS config:', EMAILJS_CONFIG);
    
    // Check if EmailJS is properly configured
    if (EMAILJS_CONFIG.service_id === 'your_service_id' || 
        EMAILJS_CONFIG.template_id === 'your_template_id' || 
        EMAILJS_CONFIG.public_key === 'your_public_api_key' ||
        EMAILJS_CONFIG.service_id === '' || 
        EMAILJS_CONFIG.template_id === '' || 
        EMAILJS_CONFIG.public_key === '') {
      
      // Fallback to FormSubmit while EmailJS is not configured
      console.log('EmailJS not configured, using FormSubmit fallback...');
      
      try {
        // Create FormData for FormSubmit
        const submitData = new FormData();
        
        // Add form fields
        submitData.append('_subject', 'Richiesta Aggiunta PetScan');
        submitData.append('_template', 'table');
        submitData.append('_captcha', 'false');
        submitData.append('_next', window.location.origin + '/?product_requested=true');
        
        // Add all form data
        submitData.append('EAN', requestData.ean);
        submitData.append('Brand', requestData.brand);
        submitData.append('Nome_Prodotto', requestData.productName);
        submitData.append('Email_Richiedente', requestData.email || 'Non fornita');
        submitData.append('Richieste_Rimanenti', (remaining - 1).toString());
        
        // Create detailed message
        const message = `
NUOVA RICHIESTA DI AGGIUNTA PRODOTTO PETSCAN

=== INFORMAZIONI PRODOTTO ===
EAN: ${requestData.ean}
Brand: ${requestData.brand}
Nome prodotto: ${requestData.productName}

=== CONTATTO ===
Email del richiedente: ${requestData.email || 'Non fornita'}

=== LIMITE RICHIESTE ===
Richieste rimanenti oggi: ${remaining - 1}

---
Richiesta inviata automaticamente da PetScan
Data: ${new Date().toLocaleString('it-IT')}
        `;
        
        submitData.append('Messaggio_Completo', message);

        console.log('Sending to FormSubmit...');
        
        const response = await fetch('https://formsubmit.co/alessandro.miu@gmail.com', {
          method: 'POST',
          body: submitData,
        });

        console.log('FormSubmit response status:', response.status);
        
        if (response.ok) {
          // Record the request
          recordRequest();
          console.log('Product request sent successfully via FormSubmit fallback');
          
          return {
            success: true,
            message: '🎉 Grazie! La tua richiesta è stata inviata. Ti avviseremo non appena l\'analisi sarà disponibile.'
          };
        } else {
          console.error('FormSubmit error:', response.status, response.statusText);
          return {
            success: false,
            message: 'Si è verificato un errore durante l\'invio. Riprova tra qualche minuto.'
          };
        }
      } catch (fallbackError) {
        console.error('FormSubmit fallback error:', fallbackError);
        return {
          success: false,
          message: 'EmailJS non è ancora configurato. Contatta l\'amministratore per completare la configurazione.'
        };
      }
    }
    
    // Prepare template parameters for EmailJS
    const templateParams = {
      to_email: 'alessandro.miu@gmail.com',
      subject: 'Richiesta Aggiunta PetScan',
      ean: requestData.ean,
      brand: requestData.brand,
      product_name: requestData.productName,
      user_email: requestData.email || 'Non fornita',
      remaining_requests: (remaining - 1).toString(),
      date: new Date().toLocaleString('it-IT'),
      // Parametri aggiuntivi per compatibilità
      to_name: 'PetScan Admin',
      from_name: 'PetScan User',
      reply_to: requestData.email || 'noreply@petscan.com'
    };

    console.log('Sending via EmailJS...');
    
    // Send email using EmailJS
    const response = await emailjs.send(
      EMAILJS_CONFIG.service_id,
      EMAILJS_CONFIG.template_id,
      templateParams,
      EMAILJS_CONFIG.public_key
    );

    console.log('EmailJS response:', response);
    
    if (response.status === 200) {
      // Record the request
      recordRequest();
      console.log('Product request sent successfully via EmailJS');
      
      return {
        success: true,
        message: '🎉 Grazie! La tua richiesta è stata inviata. Ti avviseremo non appena l\'analisi sarà disponibile.'
      };
    } else {
      console.error('EmailJS error:', response);
      return {
        success: false,
        message: 'Si è verificato un errore durante l\'invio. Riprova tra qualche minuto.'
      };
    }
  } catch (error: any) {
    console.error('Error sending product request:', error);
    
    // Provide more specific error messages based on the error type
    if (error?.text?.includes('Service not found')) {
      return {
        success: false,
        message: 'Errore: Service ID EmailJS non valido. Contatta l\'amministratore.'
      };
    } else if (error?.text?.includes('Template not found')) {
      return {
        success: false,
        message: 'Errore: Template ID EmailJS non valido. Contatta l\'amministratore.'
      };
    } else if (error?.text?.includes('Invalid public key')) {
      return {
        success: false,
        message: 'Errore: Public Key EmailJS non valida. Contatta l\'amministratore.'
      };
    } else {
      return {
        success: false,
        message: 'Si è verificato un errore durante l\'invio. Riprova tra qualche minuto.'
      };
    }
  }
}; 