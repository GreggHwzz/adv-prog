import { Injectable } from '@nestjs/common';
import { supabaseClient } from '../config/supabase';

@Injectable()
export class EnrollmentService {

  // Récupérer toutes les associations entre les formulaires et les questions, avec des filtres optionnels
  async getAllEnrollments(filters: { studentId?: string; courseId?: string }) {
    try {
      console.log('Attempting to fetch filtered enrollment associations from Supabase...');
      
      let query = supabaseClient
        .from('Enrollment')
        .select('*');
    
      if (filters.studentId) {
        query = query.eq('studentId', filters.studentId);
      }

      if (filters.courseId) {
        query = query.eq('courseId', filters.courseId);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Supabase query error:', error);
        throw new Error(`Supabase query error: ${error.message}`);
      }

      console.log('Fetched filtered enrollment associations:', data);
      return data;
    } catch (err) {
      console.error('Internal error fetching enrollment associations:', err);
      throw new Error('Failed to fetch enrollment associations');
    }
  }



  // Mettre à jour une association entre un formulaire et une question
  async updateEnrollment(formId: string, questionId: string, updatedData: any) {
    try {
      console.log('Received formId and questionId:', formId, questionId); 
      console.log('Updated enrollment data:', updatedData); // Debugging
  
      const { data, error } = await supabaseClient
        .from('Enrollments')
        .update(updatedData)
        .eq('formId', formId)
        .eq('questionId', questionId);
  
      if (error) {
        console.error('Failed to update enrollment association:', error);
        throw new Error('Failed to update enrollment association');
      }
  
      console.log('Updated enrollment association data:', data);
      return data;
    } catch (err) {
      console.error('Internal error updating enrollment association:', err);
      throw new Error('Failed to update enrollment association');
    }
  }

  // Méthode pour inscrire un étudiant à un cours
  async enrollStudentToCourse(studentId: string, courseId: string) {
    try {
      console.log('Attempting to enroll student to course...', { studentId, courseId });

      
      const { data: studentData, error: studentError } = await supabaseClient
        .from('Student') 
        .select('id')
        .eq('id', studentId)
        .single();

      if (studentError || !studentData) {
        throw new Error('Étudiant non trouvé');
      }

      const { data: courseData, error: courseError } = await supabaseClient
        .from('Course')
        .select('id')
        .eq('id', courseId)
        .single();

      if (courseError || !courseData) {
        throw new Error('Cours non trouvé');
      }

      const { data, error } = await supabaseClient
        .from('Enrollment')
        .insert([{ studentId, courseId }]);

      if (error) {
        console.error('Erreur lors de l\'inscription de l\'étudiant au cours:', error);
        throw new Error('Erreur lors de l\'inscription');
      }

      console.log('Inscription réussie:', data);
      return data;
    } catch (err) {
      console.error('Erreur interne lors de l\'inscription de l\'étudiant:', err);
      throw new Error('Échec de l\'inscription');
    }
  }
}
