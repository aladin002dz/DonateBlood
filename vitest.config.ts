import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    include: ['**/*.{test,spec}.{ts,tsx}'],
    exclude: ['node_modules', '.next', 'tests/e2e'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'tests/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/mockData',
        '**/coverage/**',
        'tests/e2e/',
        '.next/',
      ],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(process.cwd(), './'),
      'next-intl/server': path.resolve(process.cwd(), './tests/mocks/next-intl-server.ts'),
      'next-intl/navigation': path.resolve(process.cwd(), './tests/mocks/next-intl-navigation.ts'),
      'next-intl/routing': path.resolve(process.cwd(), './tests/mocks/next-intl-routing.ts'),
      'next-intl': path.resolve(process.cwd(), './tests/mocks/next-intl.ts'),
    },
  },
});

