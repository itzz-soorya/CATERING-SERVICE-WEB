// EmailJS Configuration - Updated for proper functionality
export const EMAILJS_CONFIG = {
  PUBLIC_KEY: 'xVXUzg8T3ur7StkmD',
  SERVICE_ID: 'service_4tww8ad', // Updated to use the connected Gmail service
  TEMPLATE_ID: 'template_contact_festive',
  // Backup configurations for redundancy
  BACKUP_SERVICE_ID: 'service_8ff47sc', // Keep old service as backup
  BACKUP_TEMPLATE_ID: 'template_backup', // Add a backup template if needed
} as const;

// Email template parameters interface - matches EmailJS template variables
export interface EmailTemplateParams {
  from_name: string;
  from_email: string;
  phone: string;
  event_date: string;
  guest_count: string;
  event_type: string;
  message: string;
  selected_items: string;
  reply_to: string;
  // Note: to_email should be configured in EmailJS template settings, not sent as parameter
}
