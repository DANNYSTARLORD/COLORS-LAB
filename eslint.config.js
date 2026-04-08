import js from '@eslint/js';

export default [
  { ignores: ['public/js/md5.js'] },
  js.configs.recommended,
  {
    languageOptions: { globals: { document: 'readonly', window: 'readonly', XMLHttpRequest: 'readonly', JSON: 'readonly', Date: 'readonly', parseInt: 'readonly', define: 'readonly', module: 'readonly' } },
    rules: { 'no-unused-vars': 'off', 'no-undef': 'off', 'no-empty': 'off', 'no-useless-escape': 'off', 'no-constant-condition': 'off' }
  }
];