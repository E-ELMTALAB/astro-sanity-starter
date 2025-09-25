import { defineConfig } from 'astro/config';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import sanity from '@sanity/astro';
import { sanityConfig } from './src/utils/sanity-client';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://astro.build/config
export default defineConfig({
    image: {
        domains: ['cdn.sanity.io']
    },
    integrations: [react(), sanity(sanityConfig)],
    vite: {
        resolve: {
            alias: {
                '@telegram-shop': path.join(__dirname, 'apps', 'telegram-shop')
            }
        },
        plugins: [tailwindcss()],
        server: {
            hmr: { path: '/vite-hmr/' },
            allowedHosts: ['.netlify.app']
        }
    },
    server: {
        port: 3000
    }
});
