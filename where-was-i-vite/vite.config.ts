import { defineConfig } from "vite";
import path from "path";

// Vite 설정
export default defineConfig({
  // 빌드 설정
  build: {
    // 번들링할 파일들
    rollupOptions: {
      input: {
        // content.js
        content: path.resolve(__dirname, "src/content.js"),
        // background.js
        background: path.resolve(__dirname, "src/background.js"),
      },
      output: {
        // 각 파일을 별도로 빌드하도록 설정
        entryFileNames: "[name].js",
        chunkFileNames: "[name]-[hash].js",
        assetFileNames: "[name]-[hash].[ext]",
      },
    },
    // 최소화 (옵션에 따라 true/false)
    minify: "esbuild",
  },

  // 경로 alias 설정 (필요한 경우만 추가)
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
});
