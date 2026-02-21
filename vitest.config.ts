import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  test: {
    globals: true,
    include: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
    coverage: {
      provider: 'v8',
      include: [
        'src/domain/**',
        'src/server/**',
        'src/usecases/**',
        'src/integrations/**',
      ],
      exclude: [
        'src/server/seed/**',
        'src/server/db/client.ts',
        'src/server/db/queries.ts',
        'src/server/db/types.ts',
        'src/domain/types.ts',
        'src/domain/analysis/types.ts',
        'src/integrations/collectors/types.ts',
      ],
      thresholds: {
        statements: 70,
        branches: 60,
        functions: 70,
        lines: 70,
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
