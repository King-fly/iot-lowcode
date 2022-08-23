import {defineConfig} from 'vite';
import {
    serverPlugin
    // @ts-ignore
} from '@d/vite-plugin-server';

export default defineConfig({
    plugins: [serverPlugin()],
    build: {
        minify: true
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
