import { Injectable } from '@nestjs/common';
import { supabaseClient } from '../config/supabase';

@Injectable()
export class QuestionsService {
  async getAllQuestions(filters: { is_custom?: boolean}) {
    try {

      
      let query = supabaseClient
        .from('Question')
        .select('*'); 
      if (filters.is_custom) {
        query = query.eq('is_custom', filters.is_custom);
      }
      const { data, error } = await query;

      if (error) {
        console.error('Supabase query error:', error);
        throw new Error(`Supabase query error: ${error.message}`);
      }


      return data;
    } catch (err) {
      console.error('Internal error fetching questions:', err);
      throw new Error('Failed to fetch questions');
    }
  }

  // Récupérer une question spécifique
  async getQuestionById(filters: { id: string }) {
    try {

      
      const { data, error } = await supabaseClient
        .from('Question')
        .select('*')
        .eq('id', filters.id)  
        .single()

      if (error) {
        console.error('Supabase query error:', error);
        throw new Error(`Supabase query error: ${error.message}`);
      }

      return data;
    } catch (err) {
      console.error('Internal error fetching question:', err);
      throw new Error('Failed to fetch question');
    }
  }

  async createQuestion(question: any) {

  
    const { data, error } = await supabaseClient
      .from('Question')
      .insert([question])
      .select('*')
      .single()
  
    if (error) {
      console.error('Failed to create question:', error);
      throw new Error('Failed to create question');
    }
  

    return data;
  }
  async deleteQuestion(questionId: string) {

  
    const { data, error } = await supabaseClient
      .from('Question')
      .delete()
      .eq('id',questionId)
  
    if (error) {
      console.error('Failed to delete question:', error);
      throw new Error('Failed to delete question');
    }
  

    return data;
  }

  async updateQuestion(questionId: string, updatedData: any) {
    try {


  
      const { data, error } = await supabaseClient
        .from('Question')
        .update(updatedData)
        .eq('id', questionId);
  
      if (error) {
        console.error('Failed to update question:', error);
        throw new Error('Failed to update question');
      }
  

      return data;
    } catch (err) {
      console.error('Internal error updating question:', err);
      throw new Error('Failed to update question');
    }
  }
    
}

  

