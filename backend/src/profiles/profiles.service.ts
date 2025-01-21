import { Injectable } from '@nestjs/common';
import { supabaseClient } from '../config/supabase';

@Injectable()
export class ProfilesService {
  async getAllProfiles(filters: {role?: string, userId?: string }) {
  try {

    
    let query = supabaseClient
      .from('Profiles')
      .select('*'); 
    if (filters.role) {
      query = query.eq('role', filters.role);
    }
    if (filters.userId) {
      query = query.eq('userId', filters.userId);
    }


    const { data, error } = await query;

    if (error) {
      console.error('Supabase query error:', error);
      throw new Error(`Supabase query error: ${error.message}`);
    }


    return data;
  } catch (err) {
    console.error('Internal error fetching profiles:', err);
    throw new Error('Failed to fetch profiles');
  }
}

async getProfileById(filters: { id: string }) {
  try {

    
    const { data, error } = await supabaseClient
      .from('Profiles')
      .select('*')
      .eq('id', filters.id)  

    if (error) {
      console.error('Supabase query error:', error);
      throw new Error(`Supabase query error: ${error.message}`);
    }

    return data;
  } catch (err) {
    console.error('Internal error fetching profile:', err);
    throw new Error('Failed to fetch profile');
  }
}

  async createProfile(profile: any) {

  
    const { data, error } = await supabaseClient
      .from('Profiles')
      .insert([profile]);
  
    if (error) {
      console.error('Failed to create profile:', error);
      throw new Error('Failed to create profile');
    }
  
  
    return data;
  }
  async deleteProfile(profileId: string) {

  
    const { data, error } = await supabaseClient
      .from('Profiles')
      .delete()
      .eq('id',profileId)
  
    if (error) {
      console.error('Failed to delete profile:', error);
      throw new Error('Failed to delete profile');
    }
  

    return data;
  }

  async updateProfile(profileId: string, updatedData: any) {
    try {


  
      const { data, error } = await supabaseClient
        .from('Profiles')
        .update(updatedData)
        .eq('id', profileId);
  
      if (error) {
        console.error('Failed to update profile:', error);
        throw new Error('Failed to update profile');
      }
  

      return data;
    } catch (err) {
      console.error('Internal error updating profile:', err);
      throw new Error('Failed to update profile');
    }
  }
}

  


  


  

