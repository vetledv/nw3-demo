import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import codegen from 'vite-plugin-graphql-codegen';
import path from 'path';
import config from './graphql-codegen';

//TODO: figure out @graphql-codegen/client-preset-swc-plugin

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), codegen({ config })],
  resolve: {
    alias: {
      '~': path.resolve(__dirname, './src/'),
    },
  },
});
