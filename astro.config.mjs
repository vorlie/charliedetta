import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
    routes: {
        '/*': './src/pages/404.astro', 
      },
      experimental: {
        redirects: true
      },
      redirects: {
        '/discord': 'https://discord.gg/NMxKTbQcDZ'
      }
});
