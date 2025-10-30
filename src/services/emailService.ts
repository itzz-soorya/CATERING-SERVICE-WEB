import emailjs from '@emailjs/browser';
import { EMAILJS_CONFIG, EmailTemplateParams } from '@/config/emailjs';

class EmailService {
  constructor() {
    // Initialize EmailJS once when the service is created
    emailjs.init({
      publicKey: EMAILJS_CONFIG.PUBLIC_KEY,
      // Optional: Limit the number of emails per service
      limitRate: {
        throttle: 10000, // 10 seconds between emails
      },
    });
  }

  async sendContactForm(params: EmailTemplateParams): Promise<boolean> {
    // Prepare the template parameters with correct structure
    const templateParams = {
      from_name: params.from_name,
      from_email: params.from_email,
      phone: params.phone,
      event_date: params.event_date || 'Not specified',
      guest_count: params.guest_count || 'Not specified',
      event_type: params.event_type || 'Not specified',
      message: params.message,
      selected_items: params.selected_items,
    };

    console.log('Sending email with template params:', templateParams);

    // Try primary service first
    try {
      console.log('Attempting to send with primary service:', {
        serviceId: EMAILJS_CONFIG.SERVICE_ID,
        templateId: EMAILJS_CONFIG.TEMPLATE_ID
      });

      const response = await emailjs.send(
        EMAILJS_CONFIG.SERVICE_ID,
        EMAILJS_CONFIG.TEMPLATE_ID,
        templateParams,
        {
          publicKey: EMAILJS_CONFIG.PUBLIC_KEY,
        }
      );

      console.log('Email sent successfully with primary service:', response);
      return true;
      
    } catch (primaryError: any) {
      console.error('Primary EmailJS service failed:', {
        message: primaryError.message,
        text: primaryError.text,
        status: primaryError.status,
        name: primaryError.name
      });

      // Check if it's a Gmail authentication error
      if (primaryError.text?.includes('Invalid grant') || 
          primaryError.text?.includes('Gmail_API')) {
        console.error('Gmail authentication error detected');
        
        // Create a detailed error for Gmail issues
        const gmailError = new Error('Gmail account connection expired. Please reconnect your Gmail account in EmailJS dashboard.');
        (gmailError as any).status = 503; // Service Unavailable
        (gmailError as any).isGmailAuth = true;
        throw gmailError;
      }
      
      // Provide specific error information for other cases
      if (primaryError.status === 400) {
        throw new Error('Invalid form data. Please check all required fields are filled correctly.');
      } else if (primaryError.status === 412) {
        throw new Error('Email service configuration error. Please contact support.');
      } else if (primaryError.status === 422) {
        throw new Error('Email template validation failed. Please try again.');
      }
      
      // Re-throw the original error if we can't handle it
      throw primaryError;
    }
  }
}

export const emailService = new EmailService();
