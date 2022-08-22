import {defineConfig} from 'vite';
import {createHtmlPlugin} from 'vite-plugin-html';

export default defineConfig({
    build: {
        minify: true
    },
    plugins: [createHtmlPlugin({
        minify: true
    })]
});
