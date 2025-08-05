// EmailJS Configuration
// Replace these values with your actual EmailJS credentials
export const EMAILJS_CONFIG = {
  service_id: 'petscan_request', // Your EmailJS service ID
  template_id: 'template_21pnohw', // Your EmailJS template ID
  public_key: 'wj0id8j8jGtkOvr6i', // Your EmailJS public key
};

// Template parameters structure for reference
export interface EmailJSTemplateParams {
  to_email: string;
  subject: string;
  ean: string;
  brand: string;
  product_name: string;
  user_email: string;
  remaining_requests: string;
  date: string;
  message: string;
}

// Example EmailJS template structure:
/*
Subject: {{subject}}

{{message}}

---
Richiesta inviata automaticamente da PetScan
Data: {{date}}
*/ 