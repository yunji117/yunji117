import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { validateSupabaseConfig } from './src/lib/supabaseConfig';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', 'VITE_');
  const error = validateSupabaseConfig(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY);
  if (error) throw new Error(error);

  return {
    plugins: [react()],
    // Vercel serves this site from the domain root. GitHub Pages overrides
    // this with --base=/yunji117/ in its workflow.
    base: '/',
    build: { outDir: 'dist' },
  };
});
