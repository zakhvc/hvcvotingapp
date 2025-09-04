import { createClient } from '@supabase/supabase-js';

// These placeholders will be replaced by your GitHub Actions workflow during deployment.
const supabaseUrl = 'https://gyiyfjadblcfdbkcsjly.supabase.co';
const supabaseAnonKey = 'sb_publishable_CEVYsQmguKa6hLbhE5zYuQ_O9_xVBPi';

if (supabaseUrl === 'https://gyiyfjadblcfdbkcsjly.supabase.co' || supabaseAnonKey === 'sb_publishable_CEVYsQmguKa6hLbhE5zYuQ_O9_xVBPi') {
  // This error will only show if the placeholders were not replaced,
  // for example, when running locally without a .env file or a similar setup.
  // For deployment, the GitHub Action will handle this.
  throw new Error('Supabase URL and Anon Key placeholders not replaced. Check your deployment workflow.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
