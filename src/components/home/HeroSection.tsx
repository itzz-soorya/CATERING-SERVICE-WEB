import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import heroImage from '@/assets/hero-catering.jpg';

export const HeroSection = () => {
  const { t } = useLanguage();

  return (
    <section className="relative w-full h-[70vh] sm:h-[80vh] lg:h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 w-full h-full z-0">
        <img 
          src={heroImage}
          alt="Premium Catering Setup"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-primary/50 backdrop-blur-[0.5px]"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 w-full max-w-4xl mx-auto px-3 sm:px-4 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-3 sm:space-y-4 lg:space-y-6"
        >
          {/* Main Heading */}
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-heading text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-primary-foreground leading-tight px-2"
          >
            {t('heroTitle')}
          </motion.h1>
          
          {/* Subtitle */}
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl text-primary-foreground/90 max-w-2xl mx-auto font-medium px-2 leading-relaxed"
          >
            {t('heroSubtitle')}
          </motion.p>
          
          {/* CTA Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-2 sm:gap-3 lg:gap-4 justify-center items-center px-2 max-w-xs sm:max-w-lg mx-auto"
          >
            <Link to="/menu" className="w-auto">
              <Button 
                variant="gold" 
                size="lg"
                className="px-3 sm:px-6 lg:px-8 py-2 sm:py-3 lg:py-4 text-sm sm:text-base lg:text-lg font-semibold whitespace-nowrap"
              >
                {t('bookNow')}
              </Button>
            </Link>
            <Link to="/menu" className="w-auto">
              <Button 
                variant="premium" 
                size="lg"
                className="px-3 sm:px-6 lg:px-8 py-2 sm:py-3 lg:py-4 text-sm sm:text-base lg:text-lg bg-primary-foreground/10 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary font-semibold whitespace-nowrap"
              >
                View Menu
              </Button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Floating Elements - Hidden on mobile for cleaner look */}
        <motion.div
          animate={{ y: [-10, 10, -10] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="hidden sm:block absolute top-1/4 left-1/4 w-12 h-12 lg:w-16 lg:h-16 bg-secondary/20 rounded-full blur-xl"
        />
        <motion.div
          animate={{ y: [10, -10, 10] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="hidden sm:block absolute top-1/3 right-1/4 w-16 h-16 lg:w-20 lg:h-20 bg-primary/20 rounded-full blur-xl"
        />
      </div>

      {/* Scroll Indicator - Hidden on mobile, smaller on tablet */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="hidden sm:block absolute bottom-4 lg:bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <div className="w-4 h-8 lg:w-6 lg:h-10 border-2 border-primary-foreground/60 rounded-full flex justify-center">
          <div className="w-1 h-2 lg:h-3 bg-primary-foreground/60 rounded-full mt-1 lg:mt-2"></div>
        </div>
      </motion.div>
    </section>
  );
};