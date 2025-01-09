import { Injectable } from '@nestjs/common';
import { supabaseClient } from '../config/supabase';

@Injectable()
export class FormsService {
  async getForms() {
    try {
      console.log('Attempting to fetch forms from Supabase...');
      const { data, error } = await supabaseClient
        .from('Form')
        .select('*');

      if (error) {
        console.error('Supabase query error:', error);
        throw new Error(`Supabase query error: ${error.message}`);
      }

      console.log('Fetched forms:', data);
      return data;
    } catch (err) {
      console.error('Internal error fetching forms:', err);
      throw new Error('Failed to fetch forms');
    }
  }
  async createForm(form: any) {
    console.log('Received form data:', form); // Debugging
  
    const { data, error } = await supabaseClient
      .from('Form')
      .insert([form]);
  
    if (error) {
      console.error('Failed to create form:', error);
      throw new Error('Failed to create form');
    }
  
    console.log('Inserted form data:', data);
    return data;
  }

  async deleteForm(form: any) {
    console.log('Received question id:', form); 
  
    const { data, error } = await supabaseClient
      .from('Form')
      .delete()
      .eq('id',form.id)
  
    if (error) {
      console.error('Failed to delete form:', error);
      throw new Error('Failed to delete form');
    }
  
    console.log('Deleted form data:', data);
    return data;
  }
}

  

