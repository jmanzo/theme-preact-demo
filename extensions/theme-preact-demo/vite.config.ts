import preact from '@preact/preset-vite';
import { defineConfig } from 'vite';
import shopify from 'vite-plugin-shopify';

export default defineConfig({
  plugins: [shopify(), preact()],
  server: {
    cors: {
      origin: [/^https?:\/\/(?:(?:[^:]+\.)?localhost|127\.0\.0\.1|\[::1\])(?::\d+)?$/, /\.myshopify\.com$/],
    },
  },
});
