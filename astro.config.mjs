// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';

// CISC480 Senior Capstone — Individual Portfolio
// Deployed as a GitHub project page under FlamingMachTurtle.
// Live URL: https://flamingmachturtle.github.io/cisc480-portfolio/
export default defineConfig({
  site: 'https://flamingmachturtle.github.io',
  base: '/cisc480-portfolio/',
  output: 'static',
  trailingSlash: 'ignore',
  integrations: [react()],
});