import emailjs from '@emailjs/browser';
import { EMAILJS_CONFIG, EmailTemplateParams } from '@/config/emailjs';

class EmailService {
  constructor() {
    emailjs.init({
      publicKey: EMAILJS_CONFIG.PUBLIC_KEY,
      blockHeadless: false,
      limitRate: {
        id: 'app',
        throttle: 10000,
      },
    });
  }

  async sendContactForm(params: EmailTemplateParams): Promise<boolean> {
    try {
      const templateIds = [
        'template_contact_festive',
        'template_contact_us', 
        'template_festive_feast',
        'contact_form'
      ];

      let lastError = null;
      
      for (const templateId of templateIds) {
        try {
          await emailjs.send(
            EMAILJS_CONFIG.SERVICE_ID,
            templateId,
            {
              to_email: 'soorya2705@gmail.com',
              from_name: params.from_name,
              from_email: params.from_email,
              phone: params.phone,
              event_date: params.event_date || 'Not specified',
              guest_count: params.guest_count || 'Not specified',
              event_type: params.event_type || 'Not specified',
              message: params.message,
              selected_items: params.selected_items,
              reply_to: params.from_email,
              name: params.from_name,
              email: params.from_email,
              subject: `Catering Inquiry from ${params.from_name}`,
            }
          );

          return true;
          
        } catch (templateError) {
          lastError = templateError;
          continue;
        }
      }

      return false;
      
    } catch (error) {
      return false;
    }
  }
}

export const emailService = new EmailService();
