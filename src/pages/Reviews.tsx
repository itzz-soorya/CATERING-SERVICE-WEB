import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Send, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { useReviews } from '@/hooks/useReviews';
import { ReviewFormData } from '@/services/googleSheetsService';

const Reviews = () => {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const { 
    currentReviews, 
    loading, 
    error, 
    currentPage, 
    totalPages, 
    addReview,
    goToPage,
    goToNextPage,
    goToPrevPage,
    totalReviews
  } = useReviews();

  const [newReview, setNewReview] = useState<ReviewFormData>({
    name: '',
    starcount: 5,
    review: '',
    eventtype: 'party'
  });
  const [submitting, setSubmitting] = useState(false);

  // Input validation and sanitization
  const validateAndSanitizeInput = (input: string, maxLength: number = 500): string => {
    return input.trim().slice(0, maxLength);
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate inputs
    const sanitizedName = validateAndSanitizeInput(newReview.name, 100);
    const sanitizedReview = validateAndSanitizeInput(newReview.review, 1000);
    
    if (!sanitizedName) {
      toast({
        title: language === 'en' ? "Error" : "பிழை",
        description: language === 'en' 
          ? "Please enter your name."
          : "உங்கள் பெயரை உள்ளிடவும்.",
        variant: "destructive"
      });
      return;
    }
    
    if (!sanitizedReview || sanitizedReview.length < 10) {
      toast({
        title: language === 'en' ? "Error" : "பிழை",
        description: language === 'en' 
          ? "Please enter a review with at least 10 characters."
          : "குறைந்தது 10 எழுத்துகளுடன் மதிப்பாய்வை உள்ளிடவும்.",
        variant: "destructive"
      });
      return;
    }

    setSubmitting(true);
    
    const sanitizedReviewData = {
      ...newReview,
      name: sanitizedName,
      review: sanitizedReview,
      starcount: Math.max(1, Math.min(5, newReview.starcount)) // Ensure rating is between 1-5
    };
    
    const success = await addReview(sanitizedReviewData);
    
    if (success) {
      toast({
        title: language === 'en' ? "Review Submitted!" : "மதிப்பாய்வு சமர்ப்பிக்கப்பட்டது!",
        description: language === 'en' 
          ? "Thank you for your feedback!"
          : "உங்கள் கருத்துக்கு நன்றி!",
      });
      setNewReview({ name: '', starcount: 5, review: '', eventtype: 'party' });
    } else {
      toast({
        title: language === 'en' ? "Error" : "பிழை",
        description: language === 'en' 
          ? "Failed to submit review. Please try again."
          : "மதிப்பாய்வு சமர்ப்பிக்க முடியவில்லை. மீண்டும் முயற்சிக்கவும்.",
        variant: "destructive"
      });
    }
    
    setSubmitting(false);
  };

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  const getEventTypeColor = (eventType: string) => {
    switch (eventType.toLowerCase()) {
      case 'wedding':
        return 'bg-pink-500 text-white';
      case 'corporate':
        return 'bg-blue-500 text-white';
      case 'party':
        return 'bg-purple-500 text-white';
      case 'special':
        return 'bg-green-500 text-white';
      default:
        return 'bg-primary text-primary-foreground';
    }
  };

  const getEventTypeLabel = (eventType: string) => {
    const labels = {
      'wedding': language === 'en' ? 'Wedding' : 'திருமணம்',
      'corporate': language === 'en' ? 'Corporate' : 'கார்ப்பரேட்',
      'party': language === 'en' ? 'Party' : 'விழா',
      'special': language === 'en' ? 'Special' : 'சிறப்பு'
    };
    return labels[eventType.toLowerCase()] || eventType;
  };

  const formatDateDisplay = (dateString: string) => {
    const reviewDate = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    // Remove time component for comparison
    const reviewDateOnly = new Date(reviewDate.getFullYear(), reviewDate.getMonth(), reviewDate.getDate());
    const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const yesterdayOnly = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate());

    if (reviewDateOnly.getTime() === todayOnly.getTime()) {
      return language === 'en' ? 'Today' : 'இன்று';
    } else if (reviewDateOnly.getTime() === yesterdayOnly.getTime()) {
      return language === 'en' ? 'Yesterday' : 'நேற்று';
    } else {
      return reviewDate.toLocaleDateString(language === 'en' ? 'en-US' : 'ta-IN');
    }
  };

  return (
    <div className="min-h-screen bg-background pt-6 sm:pt-12 lg:pt-20 pb-12 sm:pb-16 lg:pb-20">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-6 sm:mb-8 lg:mb-12"
        >
          <h1 className="font-heading text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-3 sm:mb-4 lg:mb-6">
            {t('reviews')}
          </h1>
          <p className="text-sm sm:text-base lg:text-lg text-muted-foreground max-w-2xl mx-auto">
            {language === 'en' 
              ? 'Read what our satisfied customers have to say about their dining experiences'
              : 'எங்கள் திருப்தியான வாடிக்கையாளர்கள் தங்கள் உணவு அனுபவங்களைப் பற்றி என்ன சொல்கிறார்கள் என்பதைப் படியுங்கள்'
            }
          </p>
        </motion.div>

        {/* Review Form - Moved to Top */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-12"
        >
          <Card className="max-w-2xl mx-auto shadow-elegant">
            <CardHeader>
              <h2 className="font-heading text-2xl font-bold text-foreground text-center">
                {language === 'en' ? 'Leave a Review' : 'ஒரு மதிப்பாய்வை விடுங்கள்'}
              </h2>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitReview} className="space-y-4">
                <Input
                  placeholder={language === 'en' ? 'Your Name' : 'உங்கள் பெயர்'}
                  value={newReview.name}
                  onChange={(e) => setNewReview(prev => ({ ...prev, name: e.target.value }))}
                  required
                  maxLength={100}
                  className="w-full"
                />
                
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {language === 'en' ? 'Event Type' : 'நிகழ்வு வகை'}
                  </label>
                  <select
                    value={newReview.eventtype}
                    onChange={(e) => setNewReview(prev => ({ ...prev, eventtype: e.target.value }))}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  >
                    <option value="wedding">{language === 'en' ? 'Wedding' : 'திருமணம்'}</option>
                    <option value="corporate">{language === 'en' ? 'Corporate' : 'கார்ப்பரேட்'}</option>
                    <option value="party">{language === 'en' ? 'Party' : 'விழா'}</option>
                    <option value="special">{language === 'en' ? 'Special' : 'சிறப்பு'}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    {language === 'en' ? 'Rating' : 'மதிப்பீடு'}
                  </label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setNewReview(prev => ({ ...prev, starcount: star }))}
                        className="focus:outline-none"
                      >
                        <Star
                          className={`h-6 w-6 cursor-pointer transition-colors ${
                            star <= newReview.starcount 
                              ? 'fill-yellow-400 text-yellow-400' 
                              : 'text-gray-300 hover:text-yellow-200'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <Textarea
                  placeholder={language === 'en' ? 'Your feedback...' : 'உங்கள் கருத்து...'}
                  value={newReview.review}
                  onChange={(e) => setNewReview(prev => ({ ...prev, review: e.target.value }))}
                  required
                  maxLength={1000}
                  rows={4}
                  className="w-full"
                />

                <Button type="submit" className="w-full" disabled={submitting}>
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      {language === 'en' ? 'Submitting...' : 'சமர்ப்பிக்கிறது...'}
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      {language === 'en' ? 'Submit Review' : 'மதிப்பாய்வு சமர்ப்பிக்கவும்'}
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        {/* Reviews Display with Pagination */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">{language === 'en' ? 'Loading reviews...' : 'மதிப்பாய்வுகளை ஏற்றுகிறது...'}</span>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-600">{error}</p>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <h3 className="font-heading text-xl font-bold text-foreground text-center">
                {language === 'en' ? `Customer Reviews (${totalReviews})` : `வாடிக்கையாளர் மதிப்பாய்வுகள் (${totalReviews})`}
              </h3>
              {totalPages > 1 && (
                <p className="text-center text-muted-foreground mt-2">
                  {language === 'en' 
                    ? `Page ${currentPage} of ${totalPages}` 
                    : `பக்கம் ${currentPage} / ${totalPages}`
                  }
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {currentReviews.map((review, index) => (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="shadow-elegant hover:shadow-primary/20 transition-all duration-300 h-full">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-heading text-lg font-bold text-foreground">
                            {review.name}
                          </h3>
                          <div className="flex items-center gap-1 mt-1">
                            {renderStars(review.starcount)}
                          </div>
                        </div>
                        <Badge className={getEventTypeColor(review.eventtype)}>
                          {getEventTypeLabel(review.eventtype)}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-3 line-clamp-4">
                        {review.review}
                      </p>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">
                          {formatDateDisplay(review.dateofpost)}
                        </p>
                        {formatDateDisplay(review.dateofpost).includes(language === 'en' ? 'Today' : 'இன்று') && (
                          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                            {language === 'en' ? 'New' : 'புதிய'}
                          </span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex justify-center items-center space-x-2 mt-8"
              >
                <Button
                  variant="outline"
                  size="sm"
                  onClick={goToPrevPage}
                  disabled={currentPage === 1}
                  className="flex items-center"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  {language === 'en' ? 'Previous' : 'முந்தைய'}
                </Button>

                <div className="flex space-x-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => goToPage(page)}
                      className="min-w-[40px]"
                    >
                      {page}
                    </Button>
                  ))}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages}
                  className="flex items-center"
                >
                  {language === 'en' ? 'Next' : 'அடுத்து'}
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </motion.div>
            )}

            {currentReviews.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">
                  {language === 'en' ? 'No reviews yet. Be the first to leave a review!' : 'இன்னும் மதிப்பாய்வுகள் இல்லை. முதலில் மதிப்பாய்வு செய்யுங்கள்!'}
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Reviews;