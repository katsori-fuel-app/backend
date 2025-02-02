import { FlatCompat } from '@eslint/eslintrc';
import path from 'path';
import { fileURLToPath } from 'url';
import js from '@eslint/js';
import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import prettierPlugin from 'eslint-plugin-prettier';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
    baseDirectory: __dirname,
});

export default [
    js.configs.recommended,
    ...compat.extends(
        'plugin:prettier/recommended',
        'plugin:@typescript-eslint/recommended',
    ),
    {
        ignores: ['dist', 'migrations'],
    },
    {
        files: [
            'src/**/*.ts',
            'src/**/*.tsx',
            'src/**/*.js',
            'eslint.config.js',
            'sequelize-cli-config.js',
        ],
        plugins: {
            '@typescript-eslint': tsPlugin,
            prettier: prettierPlugin,
        },
        rules: {
            'prettier/prettier': [
                'error',
                { endOfLine: 'auto', trailingWhitespace: 'none' },
            ],
        },
        languageOptions: {
            parser: tsParser,
        },
    },
    /** Overrides */
    {
        files: ['sequelize-cli-config.js', 'migrations'],
        rules: {
            '@typescript-eslint/no-require-imports': 'off',
            'no-undef': 'off',
        },
    },
];
