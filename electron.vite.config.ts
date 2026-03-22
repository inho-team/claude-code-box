import { resolve } from 'path';
import { defineConfig, externalizeDepsPlugin } from 'electron-vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()],
    build: {
      rollupOptions: {
        input: {
          index: resolve(__dirname, 'src/main/index.ts'),
        },
      },
    },
  },
  preload: {
    plugins: [externalizeDepsPlugin()],
    build: {
      rollupOptions: {
        input: {
          index: resolve(__dirname, 'src/preload/index.ts'),
        },
      },
    },
  },
  renderer: {
    root: resolve(__dirname, 'src/renderer'),
    plugins: [react()],
    build: {
      rollupOptions: {
        input: {
          index: resolve(__dirname, 'src/renderer/index.html'),
        },
      },
    },
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src/renderer'),
        '@app': resolve(__dirname, 'src/renderer/app'),
        '@config': resolve(__dirname, 'src/renderer/config'),
        '@entities': resolve(__dirname, 'src/renderer/entities'),
        '@features': resolve(__dirname, 'src/renderer/features'),
        '@widgets': resolve(__dirname, 'src/renderer/widgets'),
        '@shared': resolve(__dirname, 'src/renderer/shared'),
      },
    },
  },
});
