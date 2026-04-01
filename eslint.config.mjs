import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
});

export default [
  { ignores: ['node_modules/', 'dist/', '.expo/'] },
  ...compat.extends('expo', 'prettier'),
  {
    rules: {
      'react/react-in-jsx-scope': 'off',
    },
  },
];
