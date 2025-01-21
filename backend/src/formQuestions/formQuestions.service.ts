import { Injectable } from '@nestjs/common';
import { supabaseClient } from '../config/supabase';

@Injectable()
export class FormQuestionsService {

  // Récupérer toutes les associations entre les formulaires et les questions, avec des filtres optionnels
  async getAllFormQuestions(filters: { formId?: string; questionId?: string }) {
    try {

      
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


      return data;
    } catch (err) {
      console.error('Internal error fetching form-question associations:', err);
      throw new Error('Failed to fetch form-question associations');
    }
  }



  // Créer une association entre un formulaire et une question
  async createFormQuestion(formQuestion: { formId: string; questionId: string }) {

  
    const { data, error } = await supabaseClient
      .from('FormQuestions')
      .insert([formQuestion]);
  
    if (error) {
      console.error('Failed to create form-question association:', error);
      throw new Error('Failed to create form-question association');
    }
  

    return data;
  }

  // Supprimer une association entre un formulaire et une question
  async deleteFormQuestion(formId: string, questionId: string) {

  
    const { data, error } = await supabaseClient
      .from('FormQuestions')
      .delete()
      .eq('formId', formId)
      .eq('questionId', questionId);
  
    if (error) {
      console.error('Failed to delete form-question association:', error);
      throw new Error('Failed to delete form-question association');
    }
  

    return data;
  }

  // Mettre à jour une association entre un formulaire et une question
  async updateFormQuestion(formId: string, questionId: string, updatedData: any) {
    try {


  
      const { data, error } = await supabaseClient
        .from('FormQuestions')
        .update(updatedData)
        .eq('formId', formId)
        .eq('questionId', questionId);
  
      if (error) {
        console.error('Failed to update form-question association:', error);
        throw new Error('Failed to update form-question association');
      }
  

      return data;
    } catch (err) {
      console.error('Internal error updating form-question association:', err);
      throw new Error('Failed to update form-question association');
    }
  }
}
