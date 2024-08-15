import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';

export default defineConfig({
  html: {
    scriptLoading: 'module',
  },
  plugins: [pluginReact()],
  source: {
    alias: {
      'middleware-axios': '../src/index.ts',
    },
  },
});
