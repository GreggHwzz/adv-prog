import { Injectable } from '@nestjs/common';
import { supabaseClient } from '../config/supabase';

@Injectable()
export class StudentsService {
  async getAllStudents() {
    try {
      console.log('Attempting to fetch all students from Supabase...');
      
      const { data, error } = await supabaseClient
        .from('Student')
        .select('*');  // Pas de filtre

      if (error) {
        console.error('Supabase query error:', error);
        throw new Error(`Supabase query error: ${error.message}`);
      }
      console.log('Fetched all students:', data);
      return data;
    } catch (err) {
      console.error('Internal error fetching students:', err);
      throw new Error('Failed to fetch students');
    }
  }

  async getStudentById(filters: { id: string }) {
    try {
      console.log('Attempting to fetch specific student from Supabase...');
      
      const { data, error } = await supabaseClient
        .from('Student')
        .select('*')
        .eq('id', filters.id) 
        .single()

      if (error) {
        console.error('Supabase query error:', error);
        throw new Error(`Supabase query error: ${error.message}`);
      }
      console.log('Fetched specific student:', data);
      return data;
    } catch (err) {
      console.error('Internal error fetching student:', err);
      throw new Error('Failed to fetch student');
    }
  }
  
  async createStudent(student: any) {
    console.log('Received student data:', student); 
  
    const { data, error } = await supabaseClient
      .from('Student')
      .insert([student]);
  
    if (error) {
      console.error('Failed to create student:', error);
      throw new Error('Failed to create student');
    }
  
    console.log('Inserted student data:', data);
    return data;
  }

  async deleteStudent(studentId: string) {
    console.log('Received student id:', studentId); 
  
    const { data, error } = await supabaseClient
      .from('Student')
      .delete()
      .eq('id', studentId)
  
    if (error) {
      console.error('Failed to delete student:', error);
      throw new Error('Failed to delete student');
    }
  
    console.log('Deleted student data:', data);
    return data;
  }

  async updateStudent(studentId: string, updatedData: any) {
    try {
      console.log('Received student ID:', studentId); 
      console.log('Updated student data:', updatedData); // Debugging
  
      const { data, error } = await supabaseClient
        .from('Student')
        .update(updatedData)
        .eq('id', studentId);
  
      if (error) {
        console.error('Failed to update student:', error);
        throw new Error('Failed to update student');
      }
  
      console.log('Updated student data:', data);
      return data;
    } catch (err) {
      console.error('Internal error updating student:', err);
      throw new Error('Failed to update student');
    }
  }
}

  

