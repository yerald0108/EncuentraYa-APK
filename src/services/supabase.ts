import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SUPABASE_URL = 'https://orekrsfzkkvlddyzqjox.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9yZWtyc2Z6a2t2bGRkeXpxam94Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE0NzcxNjgsImV4cCI6MjA5NzA1MzE2OH0.uYF-MaNy9Xcekj8CXVSaGkDaPtnNjPQSVQPF5oxEhXM';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    persistSession: true,
    detectSessionInUrl: false,
    autoRefreshToken: true,
  },
});