import { fileURLToPath, URL } from 'node:url';
import Vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';
import Vuetify, { transformAssetUrls } from 'vite-plugin-vuetify';
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js';
export default defineConfig({ base: 'https://microfrontend-e-commerce-account-or.vercel.app/', resolve: { alias: { '@': fileURLToPath(new URL('src', import.meta.url)) } }, plugins: [Vue({ template: { transformAssetUrls } }), Vuetify({ autoImport: true, styles: { configFile: 'src/styles/settings.scss' } }), cssInjectedByJsPlugin()], define: { 'process.env': {} }, build: { lib: { entry: 'src/mfe/beauty-account.ts', formats: ['es'], fileName: () => 'beauty-account.js' }, outDir: 'dist/mfe', emptyOutDir: false } });
