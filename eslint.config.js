import { defineConfig, globalIgnores } from 'eslint/config';
import tseslint from 'typescript-eslint';
import importPlugin from 'eslint-plugin-import';

export default defineConfig(
  globalIgnores(['apps/**/dist/**/*', 'eslint.config.js']),

  {
    files: ['./apps/**/*.ts'],
    extends: [tseslint.configs.base, importPlugin.flatConfigs.recommended, importPlugin.flatConfigs.typescript],
    languageOptions: {
      parserOptions: {
        projectService: {
          allowDefaultProject: ['*.js'],
        },
        tsconfigRootDir: import.meta.dirname,
      },
    },
    settings: {
      'import/node-version': '22.13.0',
      'import/resolver': { typescript: true, node: true },
    },
    rules: {
      'import/extensions': ['error', { '.js': 'always' }],
      'import/enforce-node-protocol-usage': ['error', 'always'],
      'import/order': ['error', { 'newlines-between': 'always' }],
      'import/consistent-type-specifier-style': ['error', 'prefer-inline'],
    },
  },
);
