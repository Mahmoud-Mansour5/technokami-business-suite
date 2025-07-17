import { defineConfig } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig({
  base: './',
  build: {
    outDir: 'dist'
  },
  plugins: [
    viteStaticCopy({
      targets: [
        { src: 'invoices.html', dest: '' },
        { src: 'inventory.html', dest: '' },
        { src: 'pos.html', dest: '' },
        { src: 'logo.jpg', dest: '' }
      ]
    })
  ]
});
