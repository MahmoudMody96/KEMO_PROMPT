import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist', 'node_modules', 'server/node_modules']),

  // --- Browser code ---
  {
    files: ['src/**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2022,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    rules: {
      // Without eslint-plugin-react, JSX references don't count as "uses", so
      // a PascalCase component received as a prop and rendered as <Icon /> looks
      // unused. Allowing capitalised names covers that; `_name` is the opt-out
      // for everything else.
      'no-unused-vars': ['error', {
        varsIgnorePattern: '^[A-Z_]',
        argsIgnorePattern: '^(_|[A-Z])',
        caughtErrors: 'none',
      }],
      // Context files intentionally export both a provider and its hook.
      // Splitting them would buy nothing but an extra import everywhere.
      'react-refresh/only-export-components': ['warn', {
        allowConstantExport: true,
        allowExportNames: [
          'useAppContext', 'useAuth', 'useToast',
          'getTextDir', 'getTextAlign', 'getFlexDir',
          'translations', 'getOptions', 'isAdmin',
        ],
      }],
    },
  },

  // --- Server code (Vercel functions + Express dev proxy) ---
  {
    files: ['api/**/*.js', 'server/**/*.js'],
    extends: [js.configs.recommended],
    languageOptions: {
      ecmaVersion: 2022,
      globals: { ...globals.node },
      parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
    },
    rules: {
      'no-unused-vars': ['error', { argsIgnorePattern: '^_', caughtErrors: 'none' }],
    },
  },

  // --- Build tooling ---
  {
    files: ['*.config.js'],
    languageOptions: { globals: { ...globals.node } },
  },
])
