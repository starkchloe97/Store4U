import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { fileURLToPath, URL } from 'node:url';
// Vite loads this config in Node before resolve.alias is active,
// so config-level imports must use a filesystem-relative path.
import { SITE_NAME, SITE_URL } from './src/config/siteInfo.js';

export default defineConfig({
  plugins: [vue(), {
    name: 'site-info-html',
    transformIndexHtml(html) {
      return html.replaceAll('__SITE_NAME__', SITE_NAME).replaceAll('__SITE_URL__', SITE_URL);
    }
  }],

  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },

  appType: 'spa',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('/node_modules/vue-router/')) return 'router';
          if (id.includes('/node_modules/vue/') || id.includes('/node_modules/@vue/')) return 'vue';
        }
      }
    }
  }
});
