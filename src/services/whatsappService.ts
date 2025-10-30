// WhatsApp Service - Replace email with WhatsApp integration
export interface WhatsAppMessageParams {
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  eventDate: string;
  guestCount: string;
  eventType: string;
  message: string;
  selectedItems: string;
}

export class WhatsAppService {
  // Your WhatsApp number
  private readonly WHATSAPP_NUMBER = '+916382031932';
  
  formatWhatsAppMessage(params: WhatsAppMessageParams, language: 'en' | 'ta' = 'en'): string {
    if (language === 'ta') {
      return this.formatTamilMessage(params);
    }
    return this.formatEnglishMessage(params);
  }

  private formatEnglishMessage(params: WhatsAppMessageParams): string {
    const message = `
🍽️ *FESTIVE FEAST CATERING - NEW INQUIRY* 🍽️

📋 *Customer Details:*
👤 Name: ${params.customerName}
📞 Phone: ${params.customerPhone}
📧 Email: ${params.customerEmail}

🎉 *Event Details:*
📅 Event Date: ${params.eventDate || 'Not specified'}
👥 Guest Count: ${params.guestCount || 'Not specified'}
🎪 Event Type: ${params.eventType || 'Not specified'}

🛒 *Selected Items:*
${params.selectedItems || 'No items selected'}

💬 *Additional Message:*
${params.message || 'No additional message'}

---
*Generated from Festive Feast Catering Website*
`.trim();

    return message;
  }

  private formatTamilMessage(params: WhatsAppMessageParams): string {
    const message = `
🍽️ *பண்டிகை விருந்து கேட்டரிங் - புதிய விசாரணை* 🍽️

📋 *வாடிக்கையாளர் விவரங்கள்:*
👤 பெயர்: ${params.customerName}
📞 தொலைபேசி: ${params.customerPhone}
📧 மின்னஞ்சல்: ${params.customerEmail}

🎉 *நிகழ்வு விவரங்கள்:*
📅 நிகழ்வு தேதி: ${params.eventDate || 'குறிப்பிடப்படவில்லை'}
👥 விருந்தினர் எண்ணிக்கை: ${params.guestCount || 'குறிப்பிடப்படவில்லை'}
🎪 நிகழ்வு வகை: ${params.eventType || 'குறிப்பிடப்படவில்லை'}

🛒 *தேர்ந்தெடுக்கப்பட்ட உணவுகள்:*
${params.selectedItems || 'எந்த உணவும் தேர்ந்தெடுக்கப்படவில்லை'}

💬 *கூடுதல் செய்தி:*
${params.message || 'கூடுதல் செய்தி இல்லை'}

---
*பண்டிகை விருந்து கேட்டரிங் இணையதளத்தில் இருந்து உருவாக்கப்பட்டது*
`.trim();

    return message;
  }

  generateWhatsAppUrl(params: WhatsAppMessageParams, language: 'en' | 'ta' = 'en'): string {
    const message = this.formatWhatsAppMessage(params, language);
    const encodedMessage = encodeURIComponent(message);
    
    // WhatsApp URL format
    const whatsappUrl = `https://wa.me/${this.WHATSAPP_NUMBER.replace('+', '')}?text=${encodedMessage}`;
    
    return whatsappUrl;
  }

  openWhatsApp(params: WhatsAppMessageParams, language: 'en' | 'ta' = 'en'): void {
    const url = this.generateWhatsAppUrl(params, language);
    
    // Open WhatsApp in a new tab/window
    window.open(url, '_blank');
  }

  // For testing - log the message that would be sent
  previewMessage(params: WhatsAppMessageParams, language: 'en' | 'ta' = 'en'): void {
    console.log('WhatsApp Message Preview:');
    console.log(this.formatWhatsAppMessage(params, language));
    console.log('\nWhatsApp URL:', this.generateWhatsAppUrl(params, language));
  }
}

export const whatsappService = new WhatsAppService();
