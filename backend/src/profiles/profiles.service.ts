import { Injectable } from '@nestjs/common';
import { supabaseClient } from '../config/supabase';

@Injectable()
export class ProfilesService {
  async getProfiles(id:string) {
    const { data, error } = await supabaseClient
      .from('Profiles')
      .select('*')
      .eq('userId',id)
      .single();

    if (error) throw new Error('Failed to fetch profiles');
    return data;
  }

  
}
