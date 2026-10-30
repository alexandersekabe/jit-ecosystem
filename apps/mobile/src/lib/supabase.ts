import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

// Replace with your project details
const SUPABASE_URL = 'https://asxtwtznijsgyolsgbhy.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_OUwB0ZJfnw10v9019GMgBw__Er835o6';


export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});