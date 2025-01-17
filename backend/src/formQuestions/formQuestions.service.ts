import { Injectable } from '@nestjs/common';
import { supabaseClient } from '../config/supabase';

@Injectable()
export class FormQuestionsService {

  // Récupérer toutes les associations entre les formulaires et les questions, avec des filtres optionnels
  async getAllFormQuestions(filters: { formId?: string; questionId?: string }) {
    try {
      console.log('Attempting to fetch filtered form-question associations from Supabase...');
      
      let query = supabaseClient
        .from('FormQuestions')
        .select('*');

      if (filters.formId) {
        query = query.eq('formId', filters.formId);
      }

      if (filters.questionId) {
        query = query.eq('questionId', filters.questionId);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Supabase query error:', error);
        throw new Error(`Supabase query error: ${error.message}`);
      }

      console.log('Fetched filtered form-question associations:', data);
      return data;
    } catch (err) {
      console.error('Internal error fetching form-question associations:', err);
      throw new Error('Failed to fetch form-question associations');
    }
  }



  // Créer une association entre un formulaire et une question
  async createFormQuestion(formQuestion: { formId: string; questionId: string }) {
    console.log('Received form-question data:', formQuestion); 
  
    const { data, error } = await supabaseClient
      .from('FormQuestions')
      .insert([formQuestion]);
  
    if (error) {
      console.error('Failed to create form-question association:', error);
      throw new Error('Failed to create form-question association');
    }
  
    console.log('Inserted form-question data:', data);
    return data;
  }

  // Supprimer une association entre un formulaire et une question
  async deleteFormQuestion(formId: string, questionId: string) {
    console.log('Received formId and questionId:', formId, questionId); 
  
    const { data, error } = await supabaseClient
      .from('FormQuestions')
      .delete()
      .eq('formId', formId)
      .eq('questionId', questionId);
  
    if (error) {
      console.error('Failed to delete form-question association:', error);
      throw new Error('Failed to delete form-question association');
    }
  
    console.log('Deleted form-question association:', data);
    return data;
  }

  // Mettre à jour une association entre un formulaire et une question
  async updateFormQuestion(formId: string, questionId: string, updatedData: any) {
    try {
      console.log('Received formId and questionId:', formId, questionId); 
      console.log('Updated form-question data:', updatedData); // Debugging
  
      const { data, error } = await supabaseClient
        .from('FormQuestions')
        .update(updatedData)
        .eq('formId', formId)
        .eq('questionId', questionId);
  
      if (error) {
        console.error('Failed to update form-question association:', error);
        throw new Error('Failed to update form-question association');
      }
  
      console.log('Updated form-question association data:', data);
      return data;
    } catch (err) {
      console.error('Internal error updating form-question association:', err);
      throw new Error('Failed to update form-question association');
    }
  }
}
