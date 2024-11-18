import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/coog-zoo/' // Replace <REPO_NAME> with your GitHub repo name
});