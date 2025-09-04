import { createClient } from '@supabase/supabase-js';

// These are special placeholders. The deployment script will replace them with your secret keys.
const supabaseUrl = '__SUPABASE_URL__';
const supabaseAnonKey = '__SUPABASE_ANON_KEY__';

// This check runs in the browser. If the placeholders were not replaced,
// it will show a helpful error message on the screen instead of a blank page.
if (supabaseUrl.startsWith('__') || supabaseAnonKey.startsWith('__')) {
  document.body.innerHTML = `
    <div style="font-family: sans-serif; padding: 2rem; text-align: center; background: #FFFBEB; color: #B45309; border: 1px solid #FBBF24; margin: 1rem; border-radius: 0.5rem;">
      <h1>Configuration Error</h1>
      <p>The application cannot connect to the database because the API keys are missing.</p>
      <p>If you are the owner of this site, please check your GitHub Actions deployment workflow and repository secrets.</p>
    </div>
  `;
  throw new Error('Supabase URL and/or Anon Key were not replaced during the build process.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
