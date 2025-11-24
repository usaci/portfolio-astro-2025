// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';

import cloudflare from '@astrojs/cloudflare';

// https://astro.build/config
export default defineConfig({
  integrations: [react()],
  output: "server",
  adapter: cloudflare(),
  vite: {
    define: {
        'process.env.MY_SECRET_ENV': JSON.stringify(process.env.MY_SECRET_ENV),
    },
},
});