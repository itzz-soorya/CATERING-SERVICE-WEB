export interface Review {
  id: string;
  name: string;
  starcount: number;
  eventtype: string;
  review: string;
  dateofpost: string;
}

export interface ReviewFormData {
  name: string;
  starcount: number;
  eventtype: string;
  review: string;
}

class GoogleSheetsService {
  private apiKey: string;
  private sheetId: string;
  private range: string;
  private scriptUrl: string;

  constructor() {
    this.apiKey = import.meta.env.VITE_GOOGLE_SHEETS_API_KEY || '';
    this.sheetId = import.meta.env.VITE_GOOGLE_SHEET_ID || '';
    this.range = import.meta.env.VITE_GOOGLE_SHEET_RANGE || 'Sheet1!A:E';
    this.scriptUrl = import.meta.env.VITE_GOOGLE_SCRIPT_URL || '';
  }

  // Get all reviews from Google Apps Script
  async getReviews(): Promise<Review[]> {
    try {
      if (!this.scriptUrl) {
        return this.getFallbackReviews();
      }
      
      const response = await fetch(this.scriptUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data.success || !data.data || data.data.length === 0) {
        return this.getFallbackReviews();
      }

      // Convert Apps Script data to Review objects
      return data.data.map((item: any, index: number) => ({
        id: item.id || `review-${index}`,
        name: item.name || 'Anonymous',
        starcount: parseInt(item.starcount) || 5,
        eventtype: item.eventtype || 'party',
        review: item.review || '',
        dateofpost: item.dateofpost || new Date().toISOString().split('T')[0]
      })).filter((review: Review) => review.name && review.review);
      
    } catch (error) {
      return this.getFallbackReviews();
    }
  }

  // Add new review to Google Sheets
  async addReview(reviewData: ReviewFormData): Promise<boolean> {
    try {
      if (!this.scriptUrl) {
        return false;
      }

      const newReview = {
        ...reviewData,
        dateofpost: new Date().toISOString().split('T')[0]
      };

      // Use GET method with query parameters to avoid CORS preflight issues
      const params = new URLSearchParams({
        action: 'add',
        name: newReview.name,
        starcount: newReview.starcount.toString(),
        eventtype: newReview.eventtype,
        review: newReview.review,
        dateofpost: newReview.dateofpost
      });

      const response = await fetch(`${this.scriptUrl}?${params.toString()}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.success === true;
      
    } catch (error) {
      return false;
    }
  }

  // Fallback reviews for development/demo
  private getFallbackReviews(): Review[] {
    return [
      {
        id: '1',
        name: 'Priya Sharma',
        starcount: 5,
        eventtype: 'wedding',
        review: 'Excellent service for our wedding! The food was delicious and guests loved every dish. Highly recommended!',
        dateofpost: '2024-12-15'
      },
      {
        id: '2',
        name: 'Rajesh Kumar',
        starcount: 4,
        eventtype: 'corporate',
        review: 'Great catering for our corporate event. Professional service and tasty food. Will book again!',
        dateofpost: '2024-12-10'
      },
      {
        id: '3',
        name: 'Meera Krishnan',
        starcount: 5,
        eventtype: 'party',
        review: 'Amazing food quality and presentation. Perfect for our family celebration. Thank you!',
        dateofpost: '2024-12-05'
      },
      {
        id: '4',
        name: 'Arun Patel',
        starcount: 4,
        eventtype: 'special',
        review: 'Good variety of dishes and reasonable service. The biryani was exceptional!',
        dateofpost: '2024-11-28'
      },
      {
        id: '5',
        name: 'Kavya Reddy',
        starcount: 5,
        eventtype: 'wedding',
        review: 'Outstanding catering service! Every guest complimented the food. Perfect for our special day.',
        dateofpost: '2024-11-25'
      },
      {
        id: '6',
        name: 'Suresh Gupta',
        starcount: 4,
        eventtype: 'corporate',
        review: 'Professional team and delicious food. Made our office party a great success.',
        dateofpost: '2024-11-20'
      },
      {
        id: '7',
        name: 'Lakshmi Nair',
        starcount: 5,
        eventtype: 'party',
        review: 'Fantastic experience! The team was very accommodating and the food was fresh and tasty.',
        dateofpost: '2024-11-15'
      },
      {
        id: '8',
        name: 'Vikram Singh',
        starcount: 4,
        eventtype: 'special',
        review: 'Great food and timely service. Would definitely recommend to others.',
        dateofpost: '2024-11-10'
      },
      {
        id: '9',
        name: 'Anita Joshi',
        starcount: 5,
        eventtype: 'wedding',
        review: 'Perfect catering for our daughter\'s wedding. Everything was executed flawlessly!',
        dateofpost: '2024-11-05'
      },
      {
        id: '10',
        name: 'Ravi Kumar',
        starcount: 4,
        eventtype: 'corporate',
        review: 'Good quality food and professional service. Impressed with the presentation.',
        dateofpost: '2024-11-01'
      },
      {
        id: '11',
        name: 'Deepa Menon',
        starcount: 5,
        eventtype: 'party',
        review: 'Absolutely loved the catering service. Fresh ingredients and authentic flavors!',
        dateofpost: '2024-10-28'
      },
      {
        id: '12',
        name: 'Karthik Iyer',
        starcount: 4,
        eventtype: 'special',
        review: 'Excellent food quality and variety. The desserts were particularly amazing!',
        dateofpost: '2024-10-25'
      }
    ];
  }
}

export const googleSheetsService = new GoogleSheetsService();
