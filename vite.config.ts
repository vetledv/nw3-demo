import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import codegen from 'vite-plugin-graphql-codegen';
import path from 'path';
import codegenConfig from './codegen';

//TODO: figure out @graphql-codegen/client-preset-swc-plugin

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), codegen({ config: codegenConfig })],
  resolve: {
    alias: {
      '~': path.resolve(__dirname, './src/'),
    },
  },
});
