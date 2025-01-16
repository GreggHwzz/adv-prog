import { Injectable } from '@nestjs/common';
import { supabaseClient } from '../config/supabase';

@Injectable()
export class CoursesService {
  async getAllCourses(filters: { teacherId?: string}) {
    try {
      console.log('Attempting to fetch filtered courses from Supabase...');
      
      let query = supabaseClient
        .from('Course')
        .select('*'); 
      if (filters.teacherId) {
        query = query.eq('teacherId', filters.teacherId);
      }
     
      const { data, error } = await query;

      if (error) {
        console.error('Supabase query error:', error);
        throw new Error(`Supabase query error: ${error.message}`);
      }

      console.log('Fetched filtered courses:', data);
      return data;
    } catch (err) {
      console.error('Internal error fetching courses:', err);
      throw new Error('Failed to fetch courses');
    }
  }

  async getCourseById(filters: { id: string }) {
    try {
      console.log('Attempting to fetch specific course from Supabase...');
      
      const { data, error } = await supabaseClient
        .from('Course')
        .select('*')
        .eq('id', filters.id)  

      if (error) {
        console.error('Supabase query error:', error);
        throw new Error(`Supabase query error: ${error.message}`);
      }
      console.log('Fetched specific course:', data);
      return data;
    } catch (err) {
      console.error('Internal error fetching course:', err);
      throw new Error('Failed to fetch course');
    }
  }
  
  async createCourse(course: any) {
    console.log('Received course data:', course); 
  
    const { data, error } = await supabaseClient
      .from('Course')
      .insert([course]);
  
    if (error) {
      console.error('Failed to create course:', error);
      throw new Error('Failed to create course');
    }
  
    console.log('Inserted course data:', data);
    return data;
  }

  async deleteCourse(courseId: string) {
    console.log('Received course id:', courseId); 

    const { data, error } = await supabaseClient
      .from('Course')
      .delete()
      .eq('id', courseId);

    if (error) {
      console.error('Failed to delete course:', error);
      throw new Error('Failed to delete course');
    }

    console.log('Deleted course data:', data);
    return data;
  }

  async updateCourse(courseId: string, updatedData: any) {
    try {
      console.log('Received course ID:', courseId); 
      console.log('Updated course data:', updatedData); // Debugging
  
      const { data, error } = await supabaseClient
        .from('Course')
        .update(updatedData)
        .eq('id', courseId);
  
      if (error) {
        console.error('Failed to update course:', error);
        throw new Error('Failed to update course');
      }
  
      console.log('Updated course data:', data);
      return data;
    } catch (err) {
      console.error('Internal error updating course:', err);
      throw new Error('Failed to update course');
    }
  }
}

  

