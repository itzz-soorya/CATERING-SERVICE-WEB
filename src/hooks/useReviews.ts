import { useState, useEffect } from 'react';
import { googleSheetsService, Review, ReviewFormData } from '../services/googleSheetsService';

export const useReviews = () => {
  const [allReviews, setAllReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 10;

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const data = await googleSheetsService.getReviews();
      
      // Enhanced sorting: newest first with multiple fallbacks
      const sortedReviews = data.sort((a, b) => {
        // First, try to sort by date
        const dateA = new Date(a.dateofpost);
        const dateB = new Date(b.dateofpost);
        
        // If dates are valid and different, sort by date (newest first)
        if (!isNaN(dateA.getTime()) && !isNaN(dateB.getTime())) {
          const dateDiff = dateB.getTime() - dateA.getTime();
          if (dateDiff !== 0) return dateDiff;
        }
        
        // If dates are same or invalid, sort by ID (which includes timestamp)
        if (a.id && b.id) {
          // Extract timestamp from ID if it exists
          const timestampA = a.id.split('_').pop();
          const timestampB = b.id.split('_').pop();
          
          if (timestampA && timestampB && !isNaN(+timestampA) && !isNaN(+timestampB)) {
            return +timestampB - +timestampA;
          }
        }
        
        // Fallback: just put newer items at top based on array order (reverse)
        return 0;
      });
      
      setAllReviews(sortedReviews);
      setError(null);
    } catch (err) {
      setError('Failed to fetch reviews');
    } finally {
      setLoading(false);
    }
  };

  const addReview = async (reviewData: ReviewFormData) => {
    try {
      const success = await googleSheetsService.addReview(reviewData);
      if (success) {
        // Add the new review immediately to the top of the list for instant feedback
        const newReview: Review = {
          id: `${reviewData.name}_new_${Date.now()}`,
          name: reviewData.name,
          starcount: reviewData.starcount,
          eventtype: reviewData.eventtype,
          review: reviewData.review,
          dateofpost: new Date().toISOString().split('T')[0]
        };
        
        // Add to top of current reviews and re-sort
        setAllReviews(prevReviews => {
          const updatedReviews = [newReview, ...prevReviews];
          // Re-sort to ensure newest is truly at top
          return updatedReviews.sort((a, b) => {
            const dateA = new Date(a.dateofpost);
            const dateB = new Date(b.dateofpost);
            
            if (!isNaN(dateA.getTime()) && !isNaN(dateB.getTime())) {
              const dateDiff = dateB.getTime() - dateA.getTime();
              if (dateDiff !== 0) return dateDiff;
            }
            
            // Use ID timestamp as secondary sort
            const timestampA = a.id.split('_').pop();
            const timestampB = b.id.split('_').pop();
            
            if (timestampA && timestampB && !isNaN(+timestampA) && !isNaN(+timestampB)) {
              return +timestampB - +timestampA;
            }
            
            return 0;
          });
        });
        
        setCurrentPage(1); // Go to first page to see new review
        
        // Refresh from server after a short delay to get the actual data
        setTimeout(() => {
          fetchReviews();
        }, 1000);
        
        return true;
      }
      return false;
    } catch (err) {
      setError('Failed to add review');
      return false;
    }
  };

  // Pagination logic
  const totalPages = Math.ceil(allReviews.length / reviewsPerPage);
  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = allReviews.slice(indexOfFirstReview, indexOfLastReview);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  return {
    allReviews,
    currentReviews,
    loading,
    error,
    currentPage,
    totalPages,
    reviewsPerPage,
    addReview,
    refreshReviews: fetchReviews,
    goToPage,
    goToNextPage,
    goToPrevPage,
    totalReviews: allReviews.length
  };
};
