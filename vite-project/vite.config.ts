import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill'

export default defineConfig({
  server: {
    hmr: {
    overlay: false,
    },
    host: true
    },
  plugins: [react()],
  optimizeDeps: {
    // exclude: ['js-big-decimal'],
    esbuildOptions: {
      define: {
        global: "globalThis",
      },
      plugins: [
        NodeGlobalsPolyfillPlugin({
            buffer: true,
        })
    ]
    },
  },
  resolve: {
    alias: {
     // process: "process/browser",
      stream: "stream-browserify",
      util: "util",
    },

  },
});