import prettier from 'eslint-config-prettier';

import apify from '@apify/eslint-config/ts.js';
import globals from 'globals';
import tsEslint from 'typescript-eslint';

// eslint-disable-next-line import/no-default-export
export default [
    { ignores: ['**/dist', 'eslint.config.mjs'] },
    ...apify,
    prettier,
    {
        languageOptions: {
            parser: tsEslint.parser,
            parserOptions: {
                project: 'tsconfig.json',
            },
            globals: {
                ...globals.node,
                ...globals.jest,
            },
        },
        plugins: {
            '@typescript-eslint': tsEslint.plugin,
        },
        rules: {
            'no-console': 0,
            'simple-import-sort/imports': 0,
            'simple-import-sort/exports': 0,
            'no-lonely-if': 0,
            semi: true,
            singleQuote: true,
            tabWidth: 2,
            useTabs: false,
            trailingComma: 'es5',
            printWidth: 80,
            bracketSpacing: true,
            arrowParens: 'always',
            endOfLine: 'lf',
        },
    },
];
