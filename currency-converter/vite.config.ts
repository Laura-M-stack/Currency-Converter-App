/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

// Preprocessing (TypeScript in .svelte files) is configured in svelte.config.js.
export default defineConfig({
  plugins: [svelte()],
  base: '/Currency-Converter-App/',
  build: {
    outDir: '../docs',
    // docs/ lives outside the project root, so Vite won't clean it unless told to.
    emptyOutDir: true,
  },
  test: {
    include: ['src/**/*.test.ts'],
    environment: 'node',
  },
});
