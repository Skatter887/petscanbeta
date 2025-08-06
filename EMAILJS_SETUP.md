# Configurazione EmailJS per PetScan

## Panoramica

PetScan ora utilizza EmailJS per l'invio delle richieste di aggiunta prodotto invece di FormSubmit. Questo offre maggiore controllo e flessibilità nell'invio delle email.

## Setup EmailJS

### 1. Creare un account EmailJS

1. Vai su [EmailJS.com](https://www.emailjs.com/)
2. Crea un account gratuito
3. Verifica la tua email

### 2. Configurare un servizio email

1. Nel dashboard EmailJS, vai su "Email Services"
2. Clicca "Add New Service"
3. Seleziona il tuo provider email (Gmail, Outlook, etc.)
4. Segui le istruzioni per connettere il tuo account email
5. Prendi nota del **Service ID** generato

### 3. Creare un template email

1. Nel dashboard EmailJS, vai su "Email Templates"
2. Clicca "Create New Template"
3. Configura il template con i seguenti parametri:

#### Parametri disponibili:
- `{{to_email}}` - Email del destinatario
- `{{subject}}` - Oggetto dell'email
- `{{ean}}` - Codice EAN del prodotto
- `{{brand}}` - Nome del brand
- `{{product_name}}` - Nome del prodotto
- `{{user_email}}` - Email dell'utente (se fornita)
- `{{remaining_requests}}` - Richieste rimanenti oggi
- `{{date}}` - Data e ora della richiesta
- `{{message}}` - Messaggio completo formattato

#### Esempio di template:
```
Subject: {{subject}}

{{message}}

---
Richiesta inviata automaticamente da PetScan
Data: {{date}}
```

4. Prendi nota del **Template ID** generato

### 4. Ottenere la Public Key

1. Nel dashboard EmailJS, vai su "Account" → "API Keys"
2. Copia la **Public Key**

### 5. Configurare il progetto

1. Apri il file `src/config/emailjs.ts`
2. Sostituisci i valori placeholder con i tuoi ID reali:

```typescript
export const EMAILJS_CONFIG = {
  service_id: 'il_tuo_service_id', // Service ID da EmailJS
  template_id: 'il_tuo_template_id', // Template ID da EmailJS
  public_key: 'la_tua_public_key', // Public Key da EmailJS
};
```

## Funzionalità

### Invio Email
- **Destinatario**: alessandro.miu@gmail.com
- **Oggetto**: "Richiesta Aggiunta PetScan"
- **Contenuto**: Include tutti i dettagli del prodotto richiesto

### Limitazioni
- **Limite giornaliero**: 500 richieste per utente
- **Tracking**: Le richieste sono tracciate nel localStorage
- **Reset**: Il contatore si resetta ogni giorno

### Messaggi
- **Successo**: "Richiesta inviata con successo!"
- **Errore**: "Errore nell'invio. Riprova."
- **Limite raggiunto**: Messaggio informativo con limite giornaliero

## Test

Per testare l'integrazione:

1. Configura EmailJS con i tuoi ID reali
2. Cerca un prodotto non presente nel database
3. Compila il form di richiesta aggiunta prodotto
4. Invia la richiesta
5. Verifica che l'email arrivi al destinatario

## Troubleshooting

### Email non arriva
- Verifica che il Service ID sia corretto
- Controlla che il Template ID sia valido
- Assicurati che la Public Key sia corretta
- Controlla i log della console per errori

### Errore "Service not found"
- Verifica che il servizio email sia attivo in EmailJS
- Controlla che il Service ID sia corretto

### Errore "Template not found"
- Verifica che il template sia pubblicato in EmailJS
- Controlla che il Template ID sia corretto

## Note

- EmailJS offre 200 email gratuite al mese
- Per volumi maggiori, considera un piano a pagamento
- I template possono essere personalizzati ulteriormente
- È possibile aggiungere più destinatari modificando il template

## Fallback Temporaneo

**Importante**: Fino a quando EmailJS non è configurato con i tuoi ID reali, il sistema utilizzerà automaticamente FormSubmit come fallback. Questo significa che:

- Le richieste continueranno a funzionare normalmente
- Le email verranno inviate tramite FormSubmit
- Non ci saranno interruzioni del servizio
- Una volta configurato EmailJS, il sistema passerà automaticamente al nuovo servizio

Per attivare EmailJS, sostituisci i placeholder in `src/config/emailjs.ts` con i tuoi ID reali. 