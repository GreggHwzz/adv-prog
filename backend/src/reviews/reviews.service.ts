import { Injectable } from '@nestjs/common';
import { supabaseClient } from '../config/supabase';

@Injectable()
export class ReviewsService {
  async getReviews() {
    try {
      console.log('Attempting to fetch reviews from Supabase...');
      const { data, error } = await supabaseClient
        .from('Review')
        .select('*');

      if (error) {
        console.error('Supabase query error:', error);
        throw new Error(`Supabase query error: ${error.message}`);
      }

      console.log('Fetched reviews:', data);
      return data;
    } catch (err) {
      console.error('Internal error fetching reviews:', err);
      throw new Error('Failed to fetch reviews');
    }
  }
  async createReview(review: any) {
    console.log('Received review data:', review); 
  
    const { data, error } = await supabaseClient
      .from('Review')
      .insert([review]);
  
    if (error) {
      console.error('Failed to create review:', error);
      throw new Error('Failed to create review');
    }
  
  
    return data;
  }
  async deleteReview(review: any) {
    console.log('Received review id:', review); 
  
    const { data, error } = await supabaseClient
      .from('Review')
      .delete()
      .eq('id',review.id)
  
    if (error) {
      console.error('Failed to delete review:', error);
      throw new Error('Failed to delete review');
    }
  
    console.log('Deleted review data:', data);
    return data;
  }
  
}

  

