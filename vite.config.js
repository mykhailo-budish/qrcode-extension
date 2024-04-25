import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    rollupOptions: {
      input: "dist/background.js",
      output: {
        file: 'dist/background.js',
        dir: undefined
      }
    },
    emptyOutDir: false
  },
})