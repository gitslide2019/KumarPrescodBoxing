module.exports = {
  root: true,
  extends: [
    'react-app',
    'react-app/jest',
  ],
  rules: {
    // Custom rules
    'no-console': 'warn',
    'no-var': 'error',
    'prefer-const': 'error',
    'eqeqeq': ['error', 'always', { 'null': 'ignore' }],
    'no-unused-expressions': 'error',
    'no-param-reassign': 'error',
    
    // React specific rules
    'react/jsx-curly-brace-presence': ['warn', { props: 'never', children: 'never' }],
    'react/self-closing-comp': ['warn', { component: true, html: true }],
    'react/no-array-index-key': 'warn',
  },
};