import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
    routes: {
        '/*': './src/pages/404.astro',
        '/search': './src/pages/search.astro',
        '/oneevv':'./src/pages/oneevv.astro'
      },
      experimental: {
        redirects: true
      },
      redirects: {
        '/discord': 'https://discord.gg/NMxKTbQcDZ',
        '/r/github': 'https://github.com/vorlie',
        '/r/youtube':'https://youtube.com/@vve1_',
        '/r/ugg':'https://u.gg/lol/profile/eun1/the%20mighty%20dio/overview',
        '/oneevv/invite':'https://discord.com/api/oauth2/authorize?client_id=1060061912710258699&permissions=10311612919030&scope=bot%20applications.commands',
        '/r/github/sourcecode':'https://github.com/vorlie/1evv'
      }
});
