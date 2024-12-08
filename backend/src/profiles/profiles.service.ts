import { Injectable } from '@nestjs/common';
import { supabaseClient } from '../config/supabase';

@Injectable()
export class ProfilesService {
  async getProfiles() {
    const { data, error } = await supabaseClient
      .from('profiles')
      .select('*');

    if (error) throw new Error('Failed to fetch profiles');
    return data;
  }

  
}
