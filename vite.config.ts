import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
// https://vitejs.dev/config/
export default defineConfig({
    base: '/character-sheet/',
    plugins: [react(), VitePWA({ registerType: 'autoUpdate' })],
    css: {
        preprocessorOptions: {
            less: {
                math: 'always',
                rootpath: './',
            } as Less.Options,
        },
    },
    resolve: {
        alias: {
            '@components': path.resolve(__dirname, './src/components'),
            '@assets': path.resolve(__dirname, './src/assets'),
        },
    },
    build: {
        rollupOptions: {
            output: {
                manualChunks: {
                    react: ['react', 'react-dom/client', 'react-dom/server'],
                },
            },
        },
    },
});
