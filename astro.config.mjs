import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
    redirects: {
        '/discord': 'https://discord.gg/NMxKTbQcDZ',
        '/r/github': 'https://github.com/vorlie',
        '/r/youtube':'https://youtube.com/@vve1_',
        '/r/faceit':'https://www.faceit.com/en/players/vorlie',
        '/r/ugg':'https://u.gg/lol/profile/eun1/yae%20miko-noway/overview',
        '/vxrlie/invite':'https://discord.com/api/oauth2/authorize?client_id=1060061912710258699&permissions=10309468548118&scope=bot+applications.commands'
      }
});
