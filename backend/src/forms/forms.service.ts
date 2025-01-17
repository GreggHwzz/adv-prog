import { Injectable } from '@nestjs/common';
import { supabaseClient } from '../config/supabase';

@Injectable()
export class FormsService {
  async getAllForms(filters: { adminId?: string, courseId?: string}) {
    try {
      console.log('Attempting to fetch filtered forms from Supabase...');
      
      let query = supabaseClient
        .from('Form')
        .select('*'); 
      if (filters.adminId) {
        query = query.eq('adminId', filters.adminId);
      }
      if (filters.courseId) {
        query = query.eq('courseId', filters.courseId);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Supabase query error:', error);
        throw new Error(`Supabase query error: ${error.message}`);
      }

      console.log('Fetched filtered forms:', data);
      return data;
    } catch (err) {
      console.error('Internal error fetching forms:', err);
      throw new Error('Failed to fetch forms');
    }
  }

  async getFormById(filters: { id: string }) {
    try {
      console.log('Attempting to fetch specific form from Supabase...');
      
      const { data, error } = await supabaseClient
        .from('Form')
        .select('*')
        .eq('id', filters.id)  
        .single()

      if (error) {
        console.error('Supabase query error:', error);
        throw new Error(`Supabase query error: ${error.message}`);
      }
      console.log('Fetched specific form:', data);
      return data;
    } catch (err) {
      console.error('Internal error fetching form:', err);
      throw new Error('Failed to fetch form');
    }
  }
  
  async createForm(form: any) {
    console.log('Received form data:', form); 
  
    const { data, error } = await supabaseClient
      .from('Form')
      .insert([form])
      .select('*')
      .single()
  
    if (error) {
      console.error('Failed to create form:', error);
      throw new Error('Failed to create form');
    }
  
    console.log('Inserted form data:', data);
    return data;
  }

  async deleteForm(formId: string) {
    console.log('Received form id:', formId); 
  
    const { data, error } = await supabaseClient
      .from('Form')
      .delete()
      .eq('id',formId)
  
    if (error) {
      console.error('Failed to delete form:', error);
      throw new Error('Failed to delete form');
    }
  
    console.log('Deleted form data:', data);
    return data;
  }

  async updateForm(formId: string, updatedData: any) {
    try {
      console.log('Received form ID:', formId); 
      console.log('Updated form data:', updatedData); // Debugging
  
      const { data, error } = await supabaseClient
        .from('Form')
        .update(updatedData)
        .eq('id', formId);
  
      if (error) {
        console.error('Failed to update form:', error);
        throw new Error('Failed to update form');
      }
  
      console.log('Updated form data:', data);
      return data;
    } catch (err) {
      console.error('Internal error updating form:', err);
      throw new Error('Failed to update form');
    }
  }
}

  

