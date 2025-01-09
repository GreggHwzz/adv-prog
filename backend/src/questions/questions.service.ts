import { Injectable } from '@nestjs/common';
import { supabaseClient } from '../config/supabase';

@Injectable()
export class QuestionsService {
  async getQuestions() {
    try {
      console.log('Attempting to fetch questions from Supabase...');
      const { data, error } = await supabaseClient
        .from('Question')
        .select('*');

      if (error) {
        console.error('Supabase query error:', error);
        throw new Error(`Supabase query error: ${error.message}`);
      }

      console.log('Fetched questions:', data);
      return data;
    } catch (err) {
      console.error('Internal error fetching questions:', err);
      throw new Error('Failed to fetch questions');
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
    
}

  

