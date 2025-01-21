import { Injectable } from '@nestjs/common';
import { supabaseClient } from '../config/supabase';

@Injectable()
export class AdminsService {
  async getAllAdmins() {
    try {

      
      const { data, error } = await supabaseClient
        .from('Admin')
        .select('*');  // Pas de filtre

      if (error) {
        console.error('Supabase query error:', error);
        throw new Error(`Supabase query error: ${error.message}`);
      }
      return data;
    } catch (err) {
      console.error('Internal error fetching admins:', err);
      throw new Error('Failed to fetch admins');
    }
  }

  async getAdminById(filters: { id: string }) {
    try {

      
      const { data, error } = await supabaseClient
        .from('Admin')
        .select('*')
        .eq('id', filters.id) 
        .single()

      if (error) {
        console.error('Supabase query error:', error);
        throw new Error(`Supabase query error: ${error.message}`);
      }
      return data;
    } catch (err) {
      console.error('Internal error fetching admin:', err);
      throw new Error('Failed to fetch admin');
    }
  }
  
  async createAdmin(admin: any) {
  
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
      throw new Error('Erreur lors de l\'insertion dans la table Student');
    }

    return { userResponse, data };
  }

  async deleteAdmin(admin: any) {

  
    const { data, error } = await supabaseClient
      .from('Admin')
      .delete()
      .eq('id',admin.id)
  
    if (error) {
      console.error('Failed to delete admin:', error);
      throw new Error('Failed to delete admin');
    }
  

    return data;
  }

  async updateAdmin(adminId: string, updatedData: any) {
    try {


  
      const { data, error } = await supabaseClient
        .from('Admin')
        .update(updatedData)
        .eq('id', adminId);
  
      if (error) {
        console.error('Failed to update admin:', error);
        throw new Error('Failed to update admin');
      }
  

      return data;
    } catch (err) {
      console.error('Internal error updating admin:', err);
      throw new Error('Failed to update admin');
    }
  }
}

  

