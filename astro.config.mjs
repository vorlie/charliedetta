import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
    routes: {
        '/*': './src/pages/404.astro',
        '/search': './src/pages/search.astro',
        '/materialdetta':'./src/pages/materialdetta.astro',
        '/nodc-materialdetta':'./src/pages/nodc-materialdetta.astro',
        '/login':'./src/pages/login.astro',
        '/darling-in-the-franxx': './src/pages/darling-in-the-franxx.astro',
        '/charlotte':'./src/pages/charlotte.astro',
        '/anime':'./src/pages/anime.astro'
      },
      redirects: {
        '/discord': 'https://discord.gg/NMxKTbQcDZ',
        '/r/github': 'https://github.com/vorlie',
        '/r/youtube':'https://youtube.com/@vve1_',
        '/r/faceit':'https://www.faceit.com/en/players/vorlie',
        '/vxrlie/invite':'https://discord.com/oauth2/authorize?client_id=1060061912710258699&permissions=10309465402486&scope=bot%20applications.commands'
      }
});
