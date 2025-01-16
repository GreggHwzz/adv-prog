import { Injectable } from '@nestjs/common';
import { supabaseClient } from '../config/supabase';

@Injectable()
export class AdminsService {
  async getAllAdmins() {
    try {
      console.log('Attempting to fetch all admins from Supabase...');
      
      const { data, error } = await supabaseClient
        .from('Admin')
        .select('*');  // Pas de filtre

      if (error) {
        console.error('Supabase query error:', error);
        throw new Error(`Supabase query error: ${error.message}`);
      }
      console.log('Fetched all admins:', data);
      return data;
    } catch (err) {
      console.error('Internal error fetching admins:', err);
      throw new Error('Failed to fetch admins');
    }
  }

  async getAdminById(filters: { id: string }) {
    try {
      console.log('Attempting to fetch specific admin from Supabase...');
      
      const { data, error } = await supabaseClient
        .from('Admin')
        .select('*')
        .eq('id', filters.id)  

      if (error) {
        console.error('Supabase query error:', error);
        throw new Error(`Supabase query error: ${error.message}`);
      }
      console.log('Fetched specific admin:', data);
      return data;
    } catch (err) {
      console.error('Internal error fetching admin:', err);
      throw new Error('Failed to fetch admin');
    }
  }
  
  async createAdmin(admin: any) {
    console.log('Received admin data:', admin); 
  
    const { data, error } = await supabaseClient
      .from('Admin')
      .insert([admin]);
  
    if (error) {
      console.error('Failed to create admin:', error);
      throw new Error('Failed to create admin');
    }
  
    console.log('Inserted admin data:', data);
    return data;
  }

  async deleteAdmin(admin: any) {
    console.log('Received admin id:', admin); 
  
    const { data, error } = await supabaseClient
      .from('Admin')
      .delete()
      .eq('id',admin.id)
  
    if (error) {
      console.error('Failed to delete admin:', error);
      throw new Error('Failed to delete admin');
    }
  
    console.log('Deleted admin data:', data);
    return data;
  }

  async updateAdmin(adminId: string, updatedData: any) {
    try {
      console.log('Received admin ID:', adminId); 
      console.log('Updated admin data:', updatedData); // Debugging
  
      const { data, error } = await supabaseClient
        .from('Admin')
        .update(updatedData)
        .eq('id', adminId);
  
      if (error) {
        console.error('Failed to update admin:', error);
        throw new Error('Failed to update admin');
      }
  
      console.log('Updated admin data:', data);
      return data;
    } catch (err) {
      console.error('Internal error updating admin:', err);
      throw new Error('Failed to update admin');
    }
  }
}

  

