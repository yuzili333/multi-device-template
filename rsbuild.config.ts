import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import { UnoCSSRspackPlugin } from '@unocss/webpack/rspack';

export default defineConfig({
  plugins: [pluginReact()],
  source: {
    entry: {
      index: './src/main.tsx'
    },
    define: {
      __APP_NAME__: JSON.stringify('multi-device-template')
    }
  },
  html: {
    title: 'Multi Device Template'
  },
  resolve: {
    alias: {
      '@': './src'
    }
  },
  tools: {
    rspack: {
      plugins: [UnoCSSRspackPlugin()]
    }
  },
  server: {
    port: 3000
  }
});
