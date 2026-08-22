import { defineConfig } from 'vite';

export default defineConfig({
  // GitHub Pages serves project sites below /<repository-name>/.
  // The deploy workflow supplies that path at build time; local development stays at /.
  base: process.env.VITE_BASE_PATH ?? '/',
});
