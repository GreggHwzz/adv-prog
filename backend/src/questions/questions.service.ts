import { Injectable } from '@nestjs/common';
import { supabaseClient } from '../config/supabase';

@Injectable()
export class QuestionsService {
  async getAllQuestions() {
    try {
      console.log('Attempting to fetch all questions from Supabase...');
      
      const { data, error } = await supabaseClient
        .from('Question')
        .select('*');  // Pas de filtre

      if (error) {
        console.error('Supabase query error:', error);
        throw new Error(`Supabase query error: ${error.message}`);
      }
      console.log('Fetched all questions:', data);
      return data;
    } catch (err) {
      console.error('Internal error fetching questions:', err);
      throw new Error('Failed to fetch questions');
    }
  }

  // Récupérer une question spécifique
  async getQuestionById(filters: { id: string }) {
    try {
      console.log('Attempting to fetch specific question from Supabase...');
      
      const { data, error } = await supabaseClient
        .from('Question')
        .select('*')
        .eq('id', filters.id)  // Filtrage par id spécifique

      if (error) {
        console.error('Supabase query error:', error);
        throw new Error(`Supabase query error: ${error.message}`);
      }
      console.log('Fetched specific question:', data);
      return data;
    } catch (err) {
      console.error('Internal error fetching question:', err);
      throw new Error('Failed to fetch question');
    }
  }

  async createQuestion(question: any) {
    console.log('Received question data:', question); 
  
    const { data, error } = await supabaseClient
      .from('Question')
      .insert([question]);
  
    if (error) {
      console.error('Failed to create question:', error);
      throw new Error('Failed to create question');
    }
  
    console.log('Inserted question data:', data);
    return data;
  }
  async deleteQuestion(question: any) {
    console.log('Received question id:', question); 
  
    const { data, error } = await supabaseClient
      .from('Question')
      .delete()
      .eq('id',question.id)
  
    if (error) {
      console.error('Failed to delete question:', error);
      throw new Error('Failed to delete question');
    }
  
    console.log('Deleted question data:', data);
    return data;
  }

  async updateQuestion(questionId: string, updatedData: any) {
    try {
      console.log('Received question ID:', questionId); 
      console.log('Updated question data:', updatedData); // Debugging
  
      const { data, error } = await supabaseClient
        .from('Question')
        .update(updatedData)
        .eq('id', questionId);
  
      if (error) {
        console.error('Failed to update question:', error);
        throw new Error('Failed to update question');
      }
  
      console.log('Updated question data:', data);
      return data;
    } catch (err) {
      console.error('Internal error updating question:', err);
      throw new Error('Failed to update question');
    }
  }
    
}

  

