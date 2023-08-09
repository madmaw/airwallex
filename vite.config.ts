import { defineConfig } from 'vite';
import sassDts from 'vite-plugin-sass-dts';
import tsconfigPaths from 'vite-tsconfig-paths';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [sassDts({
    // NOTE: these settings don't appear to work (windows issue?)
    sourceDir: path.resolve(__dirname, './src'),
    outputDir: path.resolve(__dirname, './gen'),
  }), tsconfigPaths()],
  test: {
    environment: 'happy-dom',
  },
});