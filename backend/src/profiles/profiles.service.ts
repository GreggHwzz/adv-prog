import { Injectable } from '@nestjs/common';
import { supabaseClient } from '../config/supabase';

@Injectable()
export class ProfilesService {
  async getAllProfiles(filters: {role?: string, userId?: string }) {
  try {
    console.log('Attempting to fetch filtered profiles from Supabase...');
    
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

    console.log('Fetched filtered profiles:', data);
    return data;
  } catch (err) {
    console.error('Internal error fetching profiles:', err);
    throw new Error('Failed to fetch profiles');
  }
}

async getProfileById(filters: { id: string }) {
  try {
    console.log('Attempting to fetch specific profile from Supabase...');
    
    const { data, error } = await supabaseClient
      .from('Profiles')
      .select('*')
      .eq('id', filters.id)  

    if (error) {
      console.error('Supabase query error:', error);
      throw new Error(`Supabase query error: ${error.message}`);
    }
    console.log('Fetched specific profile:', data);
    return data;
  } catch (err) {
    console.error('Internal error fetching profile:', err);
    throw new Error('Failed to fetch profile');
  }
}

  async createProfile(profile: any) {
    console.log('Received profile data:', profile); 
  
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
    console.log('Received profile id:', profileId); 
  
    const { data, error } = await supabaseClient
      .from('Profiles')
      .delete()
      .eq('id',profileId)
  
    if (error) {
      console.error('Failed to delete profile:', error);
      throw new Error('Failed to delete profile');
    }
  
    console.log('Deleted profile data:', data);
    return data;
  }

  async updateProfile(profileId: string, updatedData: any) {
    try {
      console.log('Received profile ID:', profileId); 
      console.log('Updated profile data:', updatedData); // Debugging
  
      const { data, error } = await supabaseClient
        .from('Profiles')
        .update(updatedData)
        .eq('id', profileId);
  
      if (error) {
        console.error('Failed to update profile:', error);
        throw new Error('Failed to update profile');
      }
  
      console.log('Updated profile data:', data);
      return data;
    } catch (err) {
      console.error('Internal error updating profile:', err);
      throw new Error('Failed to update profile');
    }
  }
}

  


  


  

