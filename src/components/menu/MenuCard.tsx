import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCart } from '@/contexts/CartContext';

interface MenuCardProps {
  dish: {
    id: string;
    name: {
      en: string;
      ta: string;
    };
    category: string;
    image: string;
    description: {
      en: string;
      ta: string;
    };
  };
}

const MenuCard: React.FC<MenuCardProps> = ({ dish }) => {
  const { language } = useLanguage();
  const { addToCart, cartItems } = useCart();

  const isInCart = cartItems.some(item => item.id === dish.id);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'veg':
        return 'bg-green-500 text-white';
      case 'non-veg':
        return 'bg-red-500 text-white';
      case 'sweets':
        return 'bg-yellow-500 text-white';
      default:
        return 'bg-primary text-primary-foreground';
    }
  };

  const getCategoryLabel = (category: string) => {
    const labels = {
      veg: { en: 'Vegetarian', ta: 'சைவம்' },
      'non-veg': { en: 'Non-Veg', ta: 'அசைவம்' },
      sweets: { en: 'Sweets', ta: 'இனிப்புகள்' }
    };
    return labels[category as keyof typeof labels]?.[language] || category;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -5 }}
    >
      <Card className="overflow-hidden shadow-elegant hover:shadow-primary/20 transition-all duration-300 h-full flex flex-col">
        <div className="relative">
          <img
            src={dish.image}
            alt={dish.name[language]}
            className="w-full h-24 sm:h-32 md:h-40 lg:h-48 object-cover"
          />
          <Badge className={`absolute top-1 right-1 text-xs ${getCategoryColor(dish.category)}`}>
            {getCategoryLabel(dish.category)}
          </Badge>
        </div>
        <CardContent className="p-2 sm:p-3 md:p-4 flex flex-col flex-1">
          <div className="flex-1">
            <h3 className="font-heading text-sm sm:text-base md:text-lg lg:text-xl font-bold text-foreground mb-1 sm:mb-2 min-h-[2rem] sm:min-h-[2.5rem] md:min-h-[3.5rem] overflow-hidden" 
                style={{
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical'
                }}>
              {dish.name[language]}
            </h3>
            <p className="text-muted-foreground text-xs sm:text-sm mb-2 sm:mb-3 md:mb-4 min-h-[2rem] sm:min-h-[3rem] md:min-h-[4rem] overflow-hidden"
               style={{
                 display: '-webkit-box',
                 WebkitLineClamp: 2,
                 WebkitBoxOrient: 'vertical'
               }}>
              {dish.description[language]}
            </p>
          </div>
          <Button
            onClick={() => addToCart(dish)}
            disabled={isInCart}
            className="w-full mt-auto text-xs sm:text-sm h-8 sm:h-9 md:h-10"
            variant={isInCart ? "outline" : "default"}
          >
            {isInCart 
              ? (language === 'en' ? 'Chosen' : 'தேர்ந்தெடுக்கப்பட்டது')
              : (language === 'en' ? 'Choose Item' : 'உணவைத் தேர்ந்தெடுக்கவும்')
            }
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default MenuCard;