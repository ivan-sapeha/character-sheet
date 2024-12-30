import path from 'path';
import { defineConfig } from 'vite';
import fixReactVirtualized from 'esbuild-plugin-react-virtualized';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
// https://vitejs.dev/config/

const base = '/character-sheet/';
export default defineConfig({
    optimizeDeps: {
        esbuildOptions: {
            plugins: [fixReactVirtualized],
        },
    },
    base,
    plugins: [
        react(),
        VitePWA({
            registerType: 'autoUpdate',
            manifest: {
                display: 'fullscreen',
                orientation: 'portrait-primary',
                start_url: `${base}?fullscreen=true`,
                name: 'DnD 5e Character Sheet',
                short_name: 'Character Sheet',
            },
        }),
    ],
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
