import { Injectable } from '@nestjs/common';
import { supabaseClient } from '../config/supabase';

@Injectable()
export class TeachersService {
  async getAllTeachers() {
    try {

      
      const { data, error } = await supabaseClient
        .from('Teacher')
        .select('*');  // Pas de filtre

      if (error) {
        console.error('Supabase query error:', error);
        throw new Error(`Supabase query error: ${error.message}`);
      }

      return data;
    } catch (err) {
      console.error('Internal error fetching teachers:', err);
      throw new Error('Failed to fetch teachers');
    }
  }

  async getTeacherById(filters: { id: string }) {
    try {

      
      const { data, error } = await supabaseClient
        .from('Teacher')
        .select('*')
        .eq('id', filters.id)  
        .single()

      if (error) {
        console.error('Supabase query error:', error);
        throw new Error(`Supabase query error: ${error.message}`);
      }

      return data;
    } catch (err) {
      console.error('Internal error fetching teacher:', err);
      throw new Error('Failed to fetch teacher');
    }
  }
  
  async createTeacher(teacher: any) {

  
    const { fname, lname, email, password, userRole, course } = teacher;
  
    const { data: user, error } = await supabaseClient.auth.signUp({
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
  
    // Insertion des données spécifiques à l'enseignant dans la table "teachers"
    const { data, error: teacherError } = await supabaseClient
      .from('Teacher')
      .insert([{ fname, lname, email, course, id: user.user.id }]);
  
    if (teacherError) {

      throw new Error('Erreur lors de l\'insertion dans la table Teacher');
    }
  
    return { user, data };
  }

  async deleteTeacher(teacherId: string) {

  
    const { data, error } = await supabaseClient
      .from('Teacher')
      .delete()
      .eq('id',teacherId)
  
    if (error) {
      console.error('Failed to delete teacher:', error);
      throw new Error('Failed to delete teacher');
    }
  

    return data;
  }

  async updateTeacher(teacherId: string, updatedData: any) {
    try {


  
      const { data, error } = await supabaseClient
        .from('Teacher')
        .update(updatedData)
        .eq('id', teacherId);
  
      if (error) {
        console.error('Failed to update teacher:', error);
        throw new Error('Failed to update teacher');
      }
  

      return data;
    } catch (err) {
      console.error('Internal error updating teacher:', err);
      throw new Error('Failed to update teacher');
    }
  }
}

  

