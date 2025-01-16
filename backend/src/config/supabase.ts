import * as dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();  // Charge les variables d'environnement

export const supabaseUrl = process.env.SUPABASE_URL;
export const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase URL and Anonymous Key must be provided.');
}

export const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);

