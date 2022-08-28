import {defineConfig} from 'vite';
import {createHtmlPlugin} from 'vite-plugin-html';

import {
    serverPlugin
    // @ts-ignore
} from '@d/vite-plugin-server';

import vue from '@vitejs/plugin-vue';

export default defineConfig({
    plugins: [vue(), serverPlugin(), createHtmlPlugin({
        minify: true
    })],
    build: {
        minify: true
    },
    resolve: {
        alias: {
            vue: 'vue/dist/vue.esm-bundler.js'
        }
    },
    server: {
        proxy: {
            '/api': {
                target: 'http://127.0.0.1:8089',
                // @ts-ignore
                chargeOrigin: true
            }
        }
    }
});
