import { defineConfig, mergeConfig } from 'vitest/config';
import viteConfig from './vite.config';

export default mergeConfig(viteConfig, defineConfig({
  test: {
    // Força o Vitest a procurar arquivos de teste apenas dentro da pasta src
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    // Ignora explicitamente as pastas do Playwright
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/playwright/**',
      '**/playwright-report/**',
      '**/.playwright-mcp/**'
    ],
  },
}));
