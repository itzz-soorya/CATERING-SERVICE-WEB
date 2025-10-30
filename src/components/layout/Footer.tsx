import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, MessageSquare, Facebook, Instagram, Twitter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';

export const Footer = () => {
  const { t } = useLanguage();

  const contactInfo = [
    { icon: Phone, text: '+91 99762 57627', href: 'tel:+919976257627' },
    { icon: Mail, text: 'soorya2705@gmail.com', href: 'mailto:soorya2705@gmail.com' },
    { icon: MapPin, text: 'B.P.Agraharam, ERODE-638005, Tamil Nadu' },
  ];

  const socialLinks = [
    { icon: Facebook, href: '#', color: 'hover:text-blue-600' },
    { icon: Instagram, href: '#', color: 'hover:text-pink-600' },
    { icon: Twitter, href: '#', color: 'hover:text-blue-400' },
  ];

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 py-12">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="font-heading text-2xl font-bold">Catering Excellence</h3>
            <p className="text-primary-foreground/80 text-sm">
              Creating memorable dining experiences with authentic flavors and exceptional service for over a decade.
            </p>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg">{t('contact')}</h4>
            <div className="space-y-3">
              {contactInfo.map((item, index) => (
                <motion.div
                  key={index}
                  whileHover={{ x: 5 }}
                  className="flex items-center space-x-3"
                >
                  <item.icon className="h-4 w-4 text-secondary" />
                  {item.href ? (
                    <a 
                      href={item.href}
                      className="text-sm text-primary-foreground/80 hover:text-secondary transition-colors"
                    >
                      {item.text}
                    </a>
                  ) : (
                    <span className="text-sm text-primary-foreground/80">{item.text}</span>
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg">Quick Links</h4>
            <div className="space-y-2">
              <motion.div whileHover={{ x: 5 }}>
                <Link
                  to="/"
                  className="block text-sm text-primary-foreground/80 hover:text-secondary transition-colors"
                >
                  About
                </Link>
              </motion.div>
              <motion.div whileHover={{ x: 5 }}>
                <Link
                  to="/menu"
                  className="block text-sm text-primary-foreground/80 hover:text-secondary transition-colors"
                >
                  Menu
                </Link>
              </motion.div>
              <motion.div whileHover={{ x: 5 }}>
                <Link
                  to="/gallery"
                  className="block text-sm text-primary-foreground/80 hover:text-secondary transition-colors"
                >
                  Gallery
                </Link>
              </motion.div>
              <motion.div whileHover={{ x: 5 }}>
                <Link
                  to="/reviews"
                  className="block text-sm text-primary-foreground/80 hover:text-secondary transition-colors"
                >
                  Reviews
                </Link>
              </motion.div>
              <motion.div whileHover={{ x: 5 }}>
                <Link
                  to="/contact"
                  className="block text-sm text-primary-foreground/80 hover:text-secondary transition-colors"
                >
                  Contact
                </Link>
              </motion.div>
            </div>
          </div>

          {/* WhatsApp & Social */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg">{t('quickEnquiry')}</h4>
            <Button 
              variant="gold" 
              className="w-full"
              onClick={() => window.open('https://wa.me/916382031932', '_blank')}
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              WhatsApp Us
            </Button>
            
            <div className="space-y-3">
              <h5 className="font-medium">{t('followUs')}</h5>
              <div className="flex space-x-3">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.href}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    className={`p-2 rounded-full bg-primary-foreground/10 text-primary-foreground ${social.color} transition-colors`}
                  >
                    <social.icon className="h-4 w-4" />
                  </motion.a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-primary-foreground/20 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-primary-foreground/60">
              © 2024 Catering Excellence. All rights reserved.
            </p>
            <p className="text-sm text-primary-foreground/60 mt-2 md:mt-0">
              Crafted with ❤️ for memorable dining experiences
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};