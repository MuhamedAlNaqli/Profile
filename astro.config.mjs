// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  output: 'static',
  site: 'https://muhamedalnaqli.github.io',
  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
  ],
  vite: {
    server: {
      allowedHosts: ['host.docker.internal'],
    },
  },
});
