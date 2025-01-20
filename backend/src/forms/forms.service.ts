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

  async getStudentFormResponse(studentId: string, formId: string) {
    try {
      const { data, error } = await supabaseClient
        .from('StudentFormResponse') 
        .select('*')
        .eq('student_id', studentId)
        .eq('form_id', formId)
        .single(); 

      if (error) {
        throw new Error(error.message);
      }

      return data;
    } catch (err) {
      console.error('Erreur lors de la récupération de la réponse:', err);
      throw err;
    }
  }

  async getFormsForStudent(studentId: string) {
    try {
      // Récupérer les formulaires associés à l'étudiant via la table d'inscription (Enrollment)
      const { data: forms, error: formsError } = await supabaseClient
        .from('Form')
        .select('id, courseId, adminId')
  
      if (formsError) {
        console.error('Erreur lors de la récupération des formulaires :', formsError);
        throw new Error('Impossible de récupérer les formulaires.');
      }
  
      // Étape 2 : Récupérer les noms des cours et les informations des professeurs en une seule requête
      const courseIds = forms.map(form => form.courseId);
      const { data: courses, error: coursesError } = await supabaseClient
        .from('Course')
        .select('id, name, teacherId')
        .in('id', courseIds);

        console.log("AH OUAIS LE FORM ENRICHI", courses)
  
      if (coursesError) {
        console.error('Erreur lors de la récupération des cours :', coursesError);
        throw new Error('Impossible de récupérer les cours.');
      }
  
      // Récupérer les informations des professeurs associés aux cours
      const teacherIds = courses.map(course => course.teacherId);
      const { data: teachers, error: teachersError } = await supabaseClient
        .from('Teacher')
        .select('id, fname, lname')
        .in('id', teacherIds);

        console.log("AH OUAIS LE FORM ENRICHI", teachers)
  
      if (teachersError) {
        console.error('Erreur lors de la récupération des professeurs :', teachersError);
        throw new Error('Impossible de récupérer les professeurs.');
      }
  
      // Joindre les informations des cours et des professeurs avec les formulaires
      const formsWithDetails = forms.map(form => {
        const course = courses.find(c => c.id === form.courseId);
        const teacher = teachers.find(t => t.id === course?.teacherId);
        return {
          ...form,
          title: course?.name || 'Sans titre',
          teacherName: teacher ? `${teacher.fname} ${teacher.lname}` : 'Professeur inconnu',
        };
      });
  
      return formsWithDetails;
  
    } catch (err) {
      console.error('Erreur serveur :', err);
      throw new Error('Erreur serveur. Veuillez réessayer plus tard.');
    }
  }

  async getFormResponsesForStudent(studentId: string) {
    try {
      // Récupérer les réponses du formulaire pour l'étudiant
      const { data, error } = await supabaseClient
        .from('StudentFormResponse')
        .select('formId, isCompleted')
        .eq('studentId', studentId);
  
      if (error) {
        console.error('Erreur lors de la récupération des réponses :', error);
        throw new Error('Impossible de récupérer les réponses.');
      }
  
      return data;
    } catch (err) {
      console.error('Erreur serveur :', err);
      throw new Error('Erreur serveur. Veuillez réessayer plus tard.');
    }
  }

  async getFormsForStudentWithResponses(studentId: string) {
    try {
      // Récupérer les formulaires associés à l'étudiant
      const forms = await this.getFormsForStudent(studentId);
      console.log("forms associés à l'etudiant" ,forms)
      
      // Récupérer les réponses associées
      const formResponses = await this.getFormResponsesForStudent(studentId);
      console.log("réponses associés", formResponses);
  
      // Associer les réponses aux formulaires
      const formsWithResponses = forms.map(form => {
        const response = formResponses.find(r => r.formId === form.id);
        return {
          ...form,
          isCompleted: response ? response.isCompleted : null,
        };
      });
  
      // Filtrer les formulaires non remplis ou incomplets
      const incompleteForms = formsWithResponses.filter(form => form.isCompleted === false || form.isCompleted === null);
  
      return incompleteForms;
  
    } catch (err) {
      console.error('Erreur serveur :', err);
      throw new Error('Erreur serveur. Veuillez réessayer plus tard.');
    }
  }
}

  

