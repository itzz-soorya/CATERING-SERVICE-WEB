// EmailJS Configuration - Hardcoded for ngrok compatibility
export const EMAILJS_CONFIG = {
  // Hardcoded values to ensure they work via ngrok
  PUBLIC_KEY: 'xVXUzg8T3ur7StkmD',
  SERVICE_ID: 'service_8ff47sc', 
  TEMPLATE_ID: 'template_contact_festive',
};

// Email template parameters interface
export interface EmailTemplateParams {
  to_email: string;
  from_name: string;
  from_email: string;
  phone: string;
  event_date: string;
  guest_count: string;
  event_type: string;
  message: string;
  selected_items: string;
  reply_to: string;
}
