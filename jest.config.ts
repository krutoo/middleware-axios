import type { Config } from 'jest';

export default {
  setupFilesAfterEnv: ['./.jest/setup.ts'],
  transform: {
    '^.+\\.(t|j)sx?$': '@swc/jest',
  },
} satisfies Config;
