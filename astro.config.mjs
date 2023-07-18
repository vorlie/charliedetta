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
        '/discord': 'https://discord.gg/NMxKTbQcDZ',
        '/r/github': 'https://github.com/vorlie',
        '/r/youtube':'https://youtube.com/@vve1_',
        '/r/ugg':'https://u.gg/lol/profile/eun1/the%20mighty%20dio/overview'
      }
});
