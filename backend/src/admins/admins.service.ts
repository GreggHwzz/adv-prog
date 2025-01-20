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
        .single()

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
  
    const { fname, lname, email, password, userRole } = admin;
  
    const { data: userResponse, error } = await supabaseClient.auth.signUp({
      email,
      password,
      options: {
        data: {
          userrole: userRole,
          email_verified : true,
        },
      },
    });

    if (error) {
      throw new Error(`Erreur lors de la création de l'utilisateur : ${error.message}`);
    }

    const { data, error: adminError } = await supabaseClient
      .from('Admin')
      .insert([{ fname, lname, id: userResponse.user.id }]);

    if (adminError) {
      await supabaseClient.auth.admin.deleteUser(userResponse.user.id); // pour la précision ici je delete le user si l'insertion se passe mal
      console.log("Erreur a l'insertion -> ", adminError)
      throw new Error('Erreur lors de l\'insertion dans la table Student');
    }

    return { userResponse, data };
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

  

