import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2, AlertCircle, MessageCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCart } from '@/contexts/CartContext';
import { whatsappService } from '@/services/whatsappService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

const Contact = () => {
  const { t, language } = useLanguage();
  const { cartItems, clearCart } = useCart();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    eventDate: '',
    guestCount: '',
    eventType: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Format selected items for email
  const formatSelectedItems = () => {
    if (cartItems.length === 0) {
      return language === 'en' ? 'No items selected' : 'எந்த உணவும் தேர்ந்தெடுக்கப்படவில்லை';
    }
    
    return cartItems.map((item, index) => 
      `${index + 1}. ${item.name[language]} (${item.category})`
    ).join('\n');
  };

  const contactInfo = [
    {
      icon: Phone,
      title: language === 'en' ? 'Phone' : 'தொலைபேசி',
      details: ['+91 99762 57627'],
      color: 'text-primary'
    },
    {
      icon: Mail,
      title: language === 'en' ? 'Email' : 'மின்னஞ்சல்',
      details: ['soorya2705@gmail.com'],
      color: 'text-secondary'
    },
    {
      icon: MapPin,
      title: language === 'en' ? 'Location' : 'இடம்',
      details: [
        'Near B.P.Agraharam Bus Stop',
        'B.P.Agraharam',
        'ERODE-638005',
        'Tamil Nadu'
      ],
      color: 'text-primary'
    },
    {
      icon: Clock,
      title: language === 'en' ? 'Business Hours' : 'வணிக நேரம்',
      details: [
        language === 'en' ? 'Monday - Saturday: 9:00 AM - 8:00 PM' : 'திங்கள் - சனி: காலை 9:00 - மாலை 8:00',
        language === 'en' ? 'Sunday: 10:00 AM - 6:00 PM' : 'ஞாயிறு: காலை 10:00 - மாலை 6:00'
      ],
      color: 'text-secondary'
    }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Validate required fields
      if (!formData.name || !formData.phone) {
        throw new Error(language === 'en' 
          ? 'Please fill in your name and phone number.' 
          : 'தயவுசெய்து உங்கள் பெயர் மற்றும் தொலைபேசி எண்ணைப் பூர்த்தி செய்யவும்.'
        );
      }

      const selectedItems = formatSelectedItems();
      
      // Prepare WhatsApp message parameters
      const whatsappParams = {
        customerName: formData.name,
        customerPhone: formData.phone,
        customerEmail: formData.email,
        eventDate: formData.eventDate,
        guestCount: formData.guestCount,
        eventType: formData.eventType,
        message: formData.message,
        selectedItems: selectedItems,
      };

      // Open WhatsApp with pre-filled message
      whatsappService.openWhatsApp(whatsappParams, language);

      // Show success message
      setIsSubmitted(true);
      
      // Clear form and cart after successful submission
      setFormData({
        name: '',
        email: '',
        phone: '',
        eventDate: '',
        guestCount: '',
        eventType: '',
        message: ''
      });
      clearCart();
      setTimeout(() => setIsSubmitted(false), 8000);
      
    } catch (err: any) {
      console.error('WhatsApp form error:', err);
      setError(err.message || (language === 'en' 
        ? 'Something went wrong. Please try again.' 
        : 'ஏதோ தவறு நடந்தது. மீண்டும் முயற்சிக்கவும்.')
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-background pt-6 sm:pt-12 lg:pt-20 pb-12 sm:pb-16 lg:pb-20">
      <div className="w-full px-3 sm:px-4 lg:px-8 max-w-7xl mx-auto overflow-hidden">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-6 sm:mb-8 lg:mb-12"
        >
          <h1 className="font-heading text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-3 sm:mb-4 lg:mb-6">
            {t('contact')}
          </h1>
          <p className="text-sm sm:text-base lg:text-lg text-muted-foreground max-w-2xl mx-auto">
            {language === 'en' 
              ? 'Ready to create an unforgettable dining experience? Get in touch with us to discuss your catering needs and special requirements.'
              : 'மறக்கமுடியாத உணவு அனுபவத்தை உருவாக்க தயாரா? உங்கள் கேட்டரிங் தேவைகள் மற்றும் சிறப்பு தேவைகளைப் பற்றி விவாதிக்க எங்களைத் தொடர்பு கொள்ளுங்கள்.'
            }
          </p>
        </motion.div>

        <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 max-w-full">
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="w-full space-y-4 sm:space-y-6 order-2 lg:order-1"
          >
            <div className="w-full">
              <h2 className="font-heading text-xl sm:text-2xl lg:text-3xl font-bold text-foreground mb-4 sm:mb-6 lg:mb-8">
                {language === 'en' ? 'Get In Touch' : 'தொடர்பில் இருங்கள்'}
              </h2>
              
              <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
                {contactInfo.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="w-full"
                  >
                    <Card className="w-full p-3 sm:p-4 lg:p-6 hover:shadow-elegant transition-all duration-300 h-full min-h-[100px] sm:min-h-[120px] lg:min-h-[140px]">
                      <div className="flex items-center space-x-2 sm:space-x-3 lg:space-x-4 h-full">
                        <div className={`p-2 sm:p-3 lg:p-4 rounded-full bg-muted ${item.color} flex-shrink-0`}>
                          <item.icon className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-heading text-sm sm:text-base lg:text-lg font-semibold text-foreground mb-1 sm:mb-2">
                            {item.title}
                          </h3>
                          <div className="space-y-1">
                            {item.details.map((detail, idx) => (
                              <p key={idx} className="text-muted-foreground text-xs sm:text-sm break-words leading-relaxed">
                                {detail}
                              </p>
                            ))}
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Google Maps */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
              className="w-full"
            >
              <Card className="p-3 sm:p-4 lg:p-6 w-full">
                <div className="w-full">
                  <h3 className="font-heading text-sm sm:text-base lg:text-lg font-bold text-foreground mb-3 sm:mb-4 flex items-center">
                    <MapPin className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-primary" />
                    {language === 'en' ? 'Our Location' : 'எங்கள் இடம்'}
                  </h3>
                  <div className="rounded-lg overflow-hidden border border-border">
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3910.8254926865675!2d77.71673761436293!3d11.347046091889143!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba96f46baa7ed81%3A0x7a4ea3c25efdeb36!2sB.P.Agraharam%2C%20Erode%2C%20Tamil%20Nadu%20638005!5e0!3m2!1sen!2sin!4v1725534700000!5m2!1sen!2sin"
                      width="100%"
                      height="200"
                      style={{ border: 0 }}
                      allowFullScreen={true}
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      className="w-full h-40 sm:h-48 lg:h-56"
                      title="B.P.Agraharam - Festive Feast Pro Location"
                    />
                  </div>
                  <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row gap-2 sm:gap-4 items-center justify-center">
                    <a
                      href="https://maps.app.goo.gl/uovmonKWLEzSimpn6"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs sm:text-sm text-primary hover:text-primary/80 font-medium underline transition-colors"
                    >
                      {language === 'en' ? 'View larger map' : 'பெரிய வரைபடத்தைப் பார்க்கவும்'}
                    </a>
                    <span className="hidden sm:inline text-muted-foreground">•</span>
                    <a
                      href="https://maps.app.goo.gl/uovmonKWLEzSimpn6"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs sm:text-sm text-secondary hover:text-secondary/80 font-medium underline transition-colors"
                    >
                      {language === 'en' ? 'Get directions' : 'திசைகளைப் பெறுங்கள்'}
                    </a>
                  </div>
                </div>
              </Card>
            </motion.div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="w-full order-1 lg:order-2"
          >
            <Card className="w-full p-4 sm:p-6 lg:p-8 shadow-elegant">
              <CardHeader className="px-0 pt-0">
                <CardTitle className="font-heading text-lg sm:text-xl lg:text-2xl font-bold text-foreground">
                  {language === 'en' ? 'Get Custom Quote via WhatsApp' : 'வாட்ஸ்அப் மூலம் தனிப்பயன் மேற்கோள் பெறுங்கள்'}
                </CardTitle>
              </CardHeader>
              <CardContent className="px-0 pb-0">
                {error && (
                  <Alert className="mb-4 border-destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                
                {cartItems.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 p-4 bg-muted rounded-lg border"
                  >
                    <h4 className="font-semibold text-sm mb-2 flex items-center text-primary">
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      {language === 'en' ? 'Selected Menu Items' : 'தேர்ந்தெடுக்கப்பட்ட உணவுகள்'}
                    </h4>
                    <div className="space-y-1">
                      {cartItems.map((item, index) => (
                        <div key={item.id} className="text-sm text-muted-foreground">
                          {index + 1}. {item.name[language]} <span className="text-xs">({item.category})</span>
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      {language === 'en' 
                        ? 'These items will be included in your inquiry' 
                        : 'இந்த உணவுகள் உங்கள் விசாரணையில் சேர்க்கப்படும்'
                      }
                    </p>
                  </motion.div>
                )}

                {isSubmitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-6 sm:py-8 lg:py-12"
                  >
                    <CheckCircle2 className="h-10 w-10 sm:h-12 sm:w-12 lg:h-16 lg:w-16 text-green-500 mx-auto mb-4" />
                    <h3 className="font-heading text-base sm:text-lg lg:text-xl font-bold text-foreground mb-2">
                      {language === 'en' ? 'WhatsApp Opened Successfully!' : 'வாட்ஸ்அப் வெற்றிகரமாக திறக்கப்பட்டது!'}
                    </h3>
                    <p className="text-muted-foreground text-sm sm:text-base">
                      {language === 'en' 
                        ? 'Your inquiry has been prepared with all selected items. Please send the message in WhatsApp to complete your catering request.'
                        : 'தேர்ந்தெடுக்கப்பட்ட அனைத்து உணவுகளுடன் உங்கள் விசாரணை தயார் செய்யப்பட்டுள்ளது. உங்கள் கேட்டரிங் கோரிக்கையை முடிக்க வாட்ஸ்அப்பில் செய்தியை அனுப்பவும்.'
                      }
                    </p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="w-full space-y-4 sm:space-y-6">
                    <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
                      <div className="w-full space-y-2">
                        <label className="block text-sm font-semibold text-foreground">
                          {language === 'en' ? 'Full Name' : 'முழு பெயர்'} *
                        </label>
                        <Input
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder={language === 'en' ? 'Enter your full name' : 'உங்கள் முழு பெயரை உள்ளிடுங்கள்'}
                          className="w-full h-10 sm:h-12"
                          maxLength={100}
                          required
                        />
                      </div>
                      <div className="w-full space-y-2">
                        <label className="block text-sm font-semibold text-foreground">
                          {language === 'en' ? 'Email Address' : 'மின்னஞ்சல் முகவரி'} *
                        </label>
                        <Input
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder={language === 'en' ? 'Enter your email' : 'உங்கள் மின்னஞ்சலை உள்ளிடுங்கள்'}
                          className="w-full h-10 sm:h-12"
                          maxLength={255}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-foreground">
                          {language === 'en' ? 'Phone Number' : 'தொலைபேசி எண்'} *
                        </label>
                        <Input
                          name="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder={language === 'en' ? 'Enter your phone number' : 'உங்கள் தொலைபேசி எண்ணை உள்ளிடுங்கள்'}
                          className="h-10 sm:h-12"
                          maxLength={15}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-foreground">
                          {language === 'en' ? 'Event Date' : 'நிகழ்வு தேதி'}
                        </label>
                        <Input
                          name="eventDate"
                          type="date"
                          value={formData.eventDate}
                          onChange={handleInputChange}
                          className="h-10 sm:h-12"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-foreground">
                          {language === 'en' ? 'Guest Count' : 'விருந்தினர் எண்ணிக்கை'}
                        </label>
                        <Input
                          name="guestCount"
                          type="number"
                          value={formData.guestCount}
                          onChange={handleInputChange}
                          placeholder={language === 'en' ? 'Number of guests' : 'விருந்தினர்களின் எண்ணிக்கை'}
                          className="h-10 sm:h-12"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-foreground">
                          {language === 'en' ? 'Event Type' : 'நிகழ்வு வகை'}
                        </label>
                        <select
                          name="eventType"
                          value={formData.eventType}
                          onChange={handleInputChange}
                          className="w-full h-10 sm:h-12 px-3 sm:px-4 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-sm sm:text-base"
                        >
                          <option value="">
                            {language === 'en' ? 'Select event type' : 'நிகழ்வு வகையைத் தேர்ந்தெடுக்கவும்'}
                          </option>
                          <option value="wedding">
                            {language === 'en' ? 'Wedding' : 'திருமணம்'}
                          </option>
                          <option value="corporate">
                            {language === 'en' ? 'Corporate Event' : 'நிறுவன நிகழ்வு'}
                          </option>
                          <option value="party">
                            {language === 'en' ? 'Party/Celebration' : 'விழா/கொண்டாட்டம்'}
                          </option>
                          <option value="other">
                            {language === 'en' ? 'Other' : 'மற்றவை'}
                          </option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-foreground">
                        {language === 'en' ? 'Message' : 'செய்தி'} *
                      </label>
                      <Textarea
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        placeholder={language === 'en' 
                          ? 'Tell us about your event requirements, dietary preferences, and any special requests...'
                          : 'உங்கள் நிகழ்வு தேவைகள், உணவு விருப்பங்கள் மற்றும் சிறப்பு கோரிக்கைகள் பற்றி எங்களிடம் சொல்லுங்கள்...'
                        }
                        rows={4}
                        maxLength={2000}
                        className="min-h-[100px] sm:min-h-[120px] resize-none text-sm sm:text-base"
                        required
                      />
                    </div>

                    <Button
                      type="submit"
                      size="lg"
                      disabled={isLoading}
                      className="w-full bg-gradient-festive hover:scale-105 transition-all duration-300 h-12 sm:h-14 text-sm sm:text-base"
                    >
                      <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                      {isLoading 
                        ? (language === 'en' ? 'Opening WhatsApp...' : 'வாட்ஸ்அப் திறக்கிறது...') 
                        : (language === 'en' ? 'Send via WhatsApp' : 'வாட்ஸ்அப் மூலம் அனுப்பு')
                      }
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mt-12 sm:mt-20 text-center"
        >
          <div className="bg-gradient-festive rounded-2xl p-6 sm:p-12 text-primary-foreground">
            <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
              {language === 'en' ? 'Ready to Get Started?' : 'தொடங்க தயாரா?'}
            </h2>
            <p className="text-lg sm:text-xl mb-6 sm:mb-8 opacity-90 px-2">
              {language === 'en' 
                ? 'Call us now for immediate assistance and personalized quotes'
                : 'உடனடி உதவி மற்றும் தனிப்பயனாக்கப்பட்ட மேற்கோள்களுக்கு இப்போதே எங்களை அழைக்கவும்'
              }
            </p>
            <div className="flex flex-col gap-3 sm:gap-4 justify-center items-stretch max-w-md sm:max-w-lg mx-auto">
              <Button
                size="lg"
                variant="premium"
                className="w-full px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg bg-primary-foreground text-primary hover:bg-primary-foreground/90 min-w-0"
              >
                <Phone className="h-4 w-4 sm:h-5 sm:w-5 mr-2 flex-shrink-0" />
                <span className="truncate">+91 99762 57627</span>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="w-full px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg bg-primary-foreground text-primary hover:bg-primary-foreground/90 min-w-0"
              >
                <Mail className="h-4 w-4 sm:h-5 sm:w-5 mr-2 flex-shrink-0" />
                <span className="truncate">{language === 'en' ? 'Email Us' : 'மின்னஞ்சல் அனுப்பு'}</span>
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Contact;