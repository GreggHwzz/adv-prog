import { Injectable } from '@nestjs/common';
import { supabaseClient } from '../config/supabase';

@Injectable()
export class ReviewsService {
  async getAllReviews(filters: {courseId?: string, formId?: string }) {
  try {
    console.log('Attempting to fetch filtered reviews from Supabase...');
    
    let query = supabaseClient
      .from('Review')
      .select('*'); 
    if (filters.formId) {
      query = query.eq('adminId', filters.formId);
    }
    if (filters.courseId) {
      query = query.eq('courseId', filters.courseId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Supabase query error:', error);
      throw new Error(`Supabase query error: ${error.message}`);
    }

    console.log('Fetched filtered reviews:', data);
    return data;
  } catch (err) {
    console.error('Internal error fetching reviews:', err);
    throw new Error('Failed to fetch reviews');
  }
}

async getReviewById(filters: { id: string }) {
  try {
    console.log('Attempting to fetch specific review from Supabase...');
    
    const { data, error } = await supabaseClient
      .from('Review')
      .select('*')
      .eq('id', filters.id)  

    if (error) {
      console.error('Supabase query error:', error);
      throw new Error(`Supabase query error: ${error.message}`);
    }
    console.log('Fetched specific review:', data);
    return data;
  } catch (err) {
    console.error('Internal error fetching review:', err);
    throw new Error('Failed to fetch review');
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

  async updateReview(reviewId: string, updatedData: any) {
    try {
      console.log('Received review ID:', reviewId); 
      console.log('Updated review data:', updatedData); // Debugging
  
      const { data, error } = await supabaseClient
        .from('Review')
        .update(updatedData)
        .eq('id', reviewId);
  
      if (error) {
        console.error('Failed to update review:', error);
        throw new Error('Failed to update review');
      }
  
      console.log('Updated review data:', data);
      return data;
    } catch (err) {
      console.error('Internal error updating review:', err);
      throw new Error('Failed to update review');
    }
  }
}

  


  


  

