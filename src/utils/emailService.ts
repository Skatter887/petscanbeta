
export interface AnalysisFormData {
  productName: string;
  petType: string;
  petAge: string;
  petWeight: string;
  allergies: string;
  healthConditions: string;
  email: string;
  whatsapp?: string;
  files?: File[];
}

export interface SubmissionResult {
  success: boolean;
  message: string;
  limitReached?: boolean;
}

const SUBMISSIONS_KEY = 'petscan_submissions';
const MAX_WEEKLY_SUBMISSIONS = 2;

interface SubmissionData {
  count: number;
  weekStart: string;
}

const getWeekStart = () => {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const diff = now.getDate() - dayOfWeek;
  const monday = new Date(now.setDate(diff));
  monday.setHours(0, 0, 0, 0);
  return monday.toISOString();
};

const checkSubmissionLimit = (): { canSubmit: boolean; remaining: number } => {
  const stored = localStorage.getItem(SUBMISSIONS_KEY);
  const currentWeekStart = getWeekStart();

  if (!stored) {
    return { canSubmit: true, remaining: MAX_WEEKLY_SUBMISSIONS };
  }

  const data: SubmissionData = JSON.parse(stored);

  // If it's a new week, reset the counter
  if (data.weekStart !== currentWeekStart) {
    return { canSubmit: true, remaining: MAX_WEEKLY_SUBMISSIONS };
  }

  // Check if user has reached the limit
  const remaining = MAX_WEEKLY_SUBMISSIONS - data.count;
  return { canSubmit: remaining > 0, remaining };
};

const recordSubmission = () => {
  const currentWeekStart = getWeekStart();
  const stored = localStorage.getItem(SUBMISSIONS_KEY);

  let data: SubmissionData;

  if (!stored) {
    data = { count: 1, weekStart: currentWeekStart };
  } else {
    const existing: SubmissionData = JSON.parse(stored);
    
    if (existing.weekStart !== currentWeekStart) {
      // New week, reset counter
      data = { count: 1, weekStart: currentWeekStart };
    } else {
      // Same week, increment counter
      data = { count: existing.count + 1, weekStart: currentWeekStart };
    }
  }

  localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(data));
};

export const sendAnalysisRequest = async (formData: AnalysisFormData): Promise<SubmissionResult> => {
  try {
    // Check submission limit first
    const { canSubmit, remaining } = checkSubmissionLimit();
    
    if (!canSubmit) {
      return {
        success: false,
        message: `Hai raggiunto il limite settimanale di ${MAX_WEEKLY_SUBMISSIONS} richieste. Potrai inviare una nuova analisi la prossima settimana. Grazie per la comprensione! 🐾`,
        limitReached: true
      };
    }

    console.log('Sending analysis request with data:', formData);
    
    // Create FormData for FormSubmit
    const submitData = new FormData();
    
    // Add form fields
    submitData.append('_subject', `Analisi Richiesta - ${formData.productName}`);
    submitData.append('_template', 'table');
    submitData.append('_captcha', 'false');
    submitData.append('_next', window.location.origin + '/?submitted=true');
    
    // Add all form data
    submitData.append('Email_Cliente', formData.email);
    submitData.append('Nome_Prodotto', formData.productName);
    submitData.append('Tipo_Animale', formData.petType);
    submitData.append('Eta_Animale', formData.petAge || 'Non specificata');
    submitData.append('Peso_Animale', formData.petWeight || 'Non specificato');
    submitData.append('Allergie', formData.allergies || 'Nessuna');
    submitData.append('Condizioni_Salute', formData.healthConditions || 'Nessuna');
    submitData.append('WhatsApp', formData.whatsapp || 'Non fornito');
    submitData.append('Numero_File', formData.files?.length.toString() || '0');
    submitData.append('Richieste_Rimanenti', (remaining - 1).toString());
    
    // Add files if present
    if (formData.files && formData.files.length > 0) {
      formData.files.forEach((file, index) => {
        submitData.append(`File_${index + 1}`, file);
      });
    }
    
    // Create detailed message
    const message = `
NUOVA RICHIESTA DI ANALISI PETSCAN

=== INFORMAZIONI PRODOTTO ===
Prodotto: ${formData.productName}
Tipo animale: ${formData.petType}

=== DETTAGLI ANIMALE ===
Età: ${formData.petAge || 'Non specificata'}
Peso: ${formData.petWeight || 'Non specificato'}

=== INFORMAZIONI SANITARIE ===
Allergie: ${formData.allergies || 'Nessuna'}
Condizioni di salute: ${formData.healthConditions || 'Nessuna'}

=== CONTATTO ===
Email cliente: ${formData.email}
WhatsApp: ${formData.whatsapp || 'Non fornito'}

=== FILE ALLEGATI ===
Numero di file: ${formData.files?.length || 0}
${formData.files && formData.files.length > 0 ? 
  formData.files.map((file, index) => `File ${index + 1}: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`).join('\n') : 
  'Nessun file allegato'}

=== LIMITE INVII ===
Richieste rimanenti questa settimana: ${remaining - 1}

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
      // Record the submission
      recordSubmission();
      console.log('Email sent successfully via FormSubmit');
      
      return {
        success: true,
        message: '✅ Grazie! Ti risponderemo entro massimo 24 ore.'
      };
    } else {
      console.error('FormSubmit error:', response.status, response.statusText);
      return {
        success: false,
        message: 'Si è verificato un errore durante l\'invio. Riprova tra qualche minuto.'
      };
    }
  } catch (error) {
    console.error('Error sending email:', error);
    return {
      success: false,
      message: 'Si è verificato un errore durante l\'invio. Riprova tra qualche minuto.'
    };
  }
};
