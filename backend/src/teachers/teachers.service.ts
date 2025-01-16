import { Injectable } from '@nestjs/common';
import { supabaseClient } from '../config/supabase';

@Injectable()
export class TeachersService {
  async getAllTeachers() {
    try {
      console.log('Attempting to fetch all teachers from Supabase...');
      
      const { data, error } = await supabaseClient
        .from('Teacher')
        .select('*');  // Pas de filtre

      if (error) {
        console.error('Supabase query error:', error);
        throw new Error(`Supabase query error: ${error.message}`);
      }
      console.log('Fetched all teachers:', data);
      return data;
    } catch (err) {
      console.error('Internal error fetching teachers:', err);
      throw new Error('Failed to fetch teachers');
    }
  }

  async getTeacherById(filters: { id: string }) {
    try {
      console.log('Attempting to fetch specific teacher from Supabase...');
      
      const { data, error } = await supabaseClient
        .from('Teacher')
        .select('*')
        .eq('id', filters.id)  

      if (error) {
        console.error('Supabase query error:', error);
        throw new Error(`Supabase query error: ${error.message}`);
      }
      console.log('Fetched specific teacher:', data);
      return data;
    } catch (err) {
      console.error('Internal error fetching teacher:', err);
      throw new Error('Failed to fetch teacher');
    }
  }
  
  async createTeacher(teacher: any) {
    console.log('Received teacher data:', teacher); 
  
    const { data, error } = await supabaseClient
      .from('Teacher')
      .insert([teacher]);
  
    if (error) {
      console.error('Failed to create teacher:', error);
      throw new Error('Failed to create teacher');
    }
  
    console.log('Inserted teacher data:', data);
    return data;
  }

  async deleteTeacher(teacher: any) {
    console.log('Received teacher id:', teacher); 
  
    const { data, error } = await supabaseClient
      .from('Teacher')
      .delete()
      .eq('id',teacher.id)
  
    if (error) {
      console.error('Failed to delete teacher:', error);
      throw new Error('Failed to delete teacher');
    }
  
    console.log('Deleted teacher data:', data);
    return data;
  }

  async updateTeacher(teacherId: string, updatedData: any) {
    try {
      console.log('Received teacher ID:', teacherId); 
      console.log('Updated teacher data:', updatedData); // Debugging
  
      const { data, error } = await supabaseClient
        .from('Teacher')
        .update(updatedData)
        .eq('id', teacherId);
  
      if (error) {
        console.error('Failed to update teacher:', error);
        throw new Error('Failed to update teacher');
      }
  
      console.log('Updated teacher data:', data);
      return data;
    } catch (err) {
      console.error('Internal error updating teacher:', err);
      throw new Error('Failed to update teacher');
    }
  }
}

  

