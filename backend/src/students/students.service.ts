import { Injectable } from '@nestjs/common';
import { supabaseClient } from '../config/supabase';

@Injectable()
export class StudentsService {
  async getAllStudents() {
    try {

      
      const { data, error } = await supabaseClient
        .from('Student')
        .select('*');  // Pas de filtre

      if (error) {
        console.error('Supabase query error:', error);
        throw new Error(`Supabase query error: ${error.message}`);
      }

      return data;
    } catch (err) {
      console.error('Internal error fetching students:', err);
      throw new Error('Failed to fetch students');
    }
  }

  async getStudentById(filters: { id: string }) {
    try {

      
      const { data, error } = await supabaseClient
        .from('Student')
        .select('*')
        .eq('id', filters.id) 
        .single()

      if (error) {
        console.error('Supabase query error:', error);
        throw new Error(`Supabase query error: ${error.message}`);
      }

      return data;
    } catch (err) {
      console.error('Internal error fetching student:', err);
      throw new Error('Failed to fetch student');
    }
  }
  
  async createStudent(student: any) {


    const { fname, lname, master, email, password, userRole } = student;
  
    const { data: userResponse, error } = await supabaseClient.auth.signUp({
      email,
      password,
      options: {
        data: {
          userrole: userRole,
        },
      },
    });

    if (error) {
      throw new Error(`Erreur lors de la création de l'utilisateur : ${error.message}`);
    }

    const { data, error: studentError } = await supabaseClient
      .from('Student')
      .insert([{ fname, lname, email, master ,id: userResponse.user.id }]);

    if (studentError) {
      await supabaseClient.auth.admin.deleteUser(userResponse.user.id); // pour la précision ici je delete le user si l'insertion se passe mal

      throw new Error('Erreur lors de l\'insertion dans la table Student');
    }

    return { userResponse, data };
  }

  async deleteStudent(studentId: string) {

  
    const { data, error } = await supabaseClient
      .from('Student')
      .delete()
      .eq('id', studentId)
  
    if (error) {
      console.error('Failed to delete student:', error);
      throw new Error('Failed to delete student');
    }
  

    return data;
  }

  async updateStudent(studentId: string, updatedData: any) {
    try {


  
      const { data, error } = await supabaseClient
        .from('Student')
        .update(updatedData)
        .eq('id', studentId);
  
      if (error) {
        console.error('Failed to update student:', error);
        throw new Error('Failed to update student');
      }
  

      return data;
    } catch (err) {
      console.error('Internal error updating student:', err);
      throw new Error('Failed to update student');
    }
  }
}

  

