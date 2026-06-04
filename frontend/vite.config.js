import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.js',
    css: false,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],   // lcov is what SonarQube reads
      reportsDirectory: './coverage',
      exclude: [
        'src/test/**',
        'src/main.jsx',
        'vite.config.js',
      ],
    },
  },
})