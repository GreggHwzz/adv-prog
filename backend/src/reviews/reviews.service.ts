import { Injectable } from '@nestjs/common';
import { supabaseClient } from '../config/supabase';

@Injectable()
export class ReviewsService {
  async getAllReviews(filters: { formId?: string }) {
    try {


      let query = supabaseClient
        .from('Review')
        .select('*, questionId(*), studentId(*), formId(*)'); 
      if (filters.formId) {
        query = query.eq('formId', filters.formId);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Supabase query error:', error);
        throw new Error(`Supabase query error: ${error.message}`);
      }


      return data;
    } catch (err) {
      console.error('Internal error fetching reviews:', err);
      throw new Error('Failed to fetch reviews');
    }
  }

  async getReviewById(filters: { id: string }) {
    try {


      const { data, error } = await supabaseClient
        .from('Review')
        .select('*, questionId(*), studentId(*), formId(*)') // Include related tables
        .eq('id', filters.id);

      if (error) {
        console.error('Supabase query error:', error);
        throw new Error(`Supabase query error: ${error.message}`);
      }


      return data[0] || null; // Return the first result or null
    } catch (err) {
      console.error('Internal error fetching review:', err);
      throw new Error('Failed to fetch review');
    }
  }

  async createReview(review: {
    answer: number;
    commentary?: string;
    questionId: string;
    studentId: string;
    formId: string;
    isAnonymous: boolean;
  }) {
    try {


      const { data, error } = await supabaseClient.from('Review').insert([review]);

      if (error) {
        console.error('Failed to create review:', error);
        throw new Error('Failed to create review');
      }


      return data;
    } catch (err) {
      console.error('Internal error creating review:', err);
      throw new Error('Failed to create review');
    }
  }

  async deleteReview(reviewId: string) {
    try {


      const { data, error } = await supabaseClient
        .from('Review')
        .delete()
        .eq('id', reviewId);

      if (error) {
        console.error('Failed to delete review:', error);
        throw new Error('Failed to delete review');
      }


      return data;
    } catch (err) {
      console.error('Internal error deleting review:', err);
      throw new Error('Failed to delete review');
    }
  }

  async updateReview(
    reviewId: string,
    updatedData: {
      answer?: number;
      commentary?: string;
      isAnonymous?: boolean;
    }
  ) {
    try {



      const { data, error } = await supabaseClient
        .from('Review')
        .update(updatedData)
        .eq('id', reviewId);

      if (error) {
        console.error('Failed to update review:', error);
        throw new Error('Failed to update review');
      }


      return data;
    } catch (err) {
      console.error('Internal error updating review:', err);
      throw new Error('Failed to update review');
    }
  }
}
