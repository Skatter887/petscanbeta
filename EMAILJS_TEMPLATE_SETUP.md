# Configurazione Template EmailJS per PetScan

## Template ID: template_21pnohw

### Configurazione Template

Per configurare correttamente il template EmailJS, segui questi passaggi:

1. **Vai nel dashboard EmailJS** → Email Templates
2. **Clicca su "Contact Us"** (template_21pnohw)
3. **Modifica il template** con questo contenuto:

#### **Subject:**
```
Richiesta Aggiunta PetScan
```

#### **Body:**
```
NUOVA RICHIESTA DI AGGIUNTA PRODOTTO PETSCAN

=== INFORMAZIONI PRODOTTO ===
EAN: {{ean}}
Brand: {{brand}}
Nome prodotto: {{product_name}}

=== CONTATTO ===
Email del richiedente: {{user_email}}

=== LIMITE RICHIESTE ===
Richieste rimanenti oggi: {{remaining_requests}}

---
Richiesta inviata automaticamente da PetScan
Data: {{date}}
```

### Parametri Disponibili nel Template

Il sistema invia automaticamente questi parametri:

- `{{message}}` - Messaggio completo formattato con tutti i dettagli
- `{{date}}` - Data e ora della richiesta
- `{{ean}}` - Codice EAN del prodotto
- `{{brand}}` - Nome del brand
- `{{product_name}}` - Nome del prodotto
- `{{user_email}}` - Email dell'utente (se fornita)
- `{{remaining_requests}}` - Richieste rimanenti oggi
- `{{subject}}` - Oggetto dell'email
- `{{to_email}}` - Email destinatario

### Test del Template

Dopo aver configurato il template:

1. **Salva il template**
2. **Testa l'invio** da PetScan
3. **Verifica** che l'email arrivi a alessandro.miu@gmail.com

### Configurazione Completata

✅ **Service ID**: petscan_request  
✅ **Template ID**: template_21pnohw  
✅ **Public Key**: wj0id8j8jGtkOvr6i  

Il sistema è ora configurato per utilizzare EmailJS! 