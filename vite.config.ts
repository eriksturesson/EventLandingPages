import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import viteTsconfigPaths from 'vite-tsconfig-paths';
// https://vitejs.dev/config/
export default defineConfig({
   plugins: [react(), viteTsconfigPaths()],
   //root: './src',
   base: '',
   build: {
      outDir: 'dist',
      emptyOutDir: true,
      rollupOptions: {
         input: {
            main: 'index.html',
         },
      },
      minify: 'terser', // se till att terser används
      terserOptions: {
         compress: {
            drop_console: true, // tar bort alla console.log, debug, info osv i produktion
         },
      },
   },
   server: {
      // this ensures that the browser opens upon server start
      open: true,
      // this sets a default port to 3000
      port: 3002,
   },
   assetsInclude: [
      '**/*.jpg',
      '**/*.JPG',
      '**/*.jpeg',
      '**/*.JPEG',
      '**/*.png',
      '**/*.PNG',
      '**/*.gif',
      '**/*.GIF',
      '**/*.svg',
      '**/*.SVG',
      '**/*.webp',
      '**/*.WEBP',
   ],
   // build: {
   //    assetsDir: 'assets', // Specify the directory where assets will be output
   // },
});
