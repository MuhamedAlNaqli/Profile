// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  output: 'static',
  integrations: [
    tailwind({
      // Use our custom CSS file with @tailwind directives
      applyBaseStyles: false,
    }),
  ],
});
