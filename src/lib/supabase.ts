import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please click "Connect to Supabase" button to set up your connection.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  },
  global: {
    headers: {
      'X-Client-Info': 'travel-platform@1.0.0'
    }
  }
});

// Add error handling for failed requests
supabase.handleFailedRequest = async (error: any) => {
  console.error('Supabase request failed:', error);
  // Implement retry logic if needed
  return null;
};

// Add connection status check with retries
export const checkConnection = async (retries = 3): Promise<boolean> => {
  for (let i = 0; i < retries; i++) {
    try {
      const { data, error } = await supabase
        .from('destinations')
        .select('count')
        .limit(1)
        .single();
      
      if (error) throw error;
      return true;
    } catch (err) {
      console.error('Supabase connection check failed:', err);
      if (i === retries - 1) return false;
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
  return false;
};