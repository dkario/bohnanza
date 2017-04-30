module.exports = {
  extends: 'airbnb',
  rules: {
    'import/no-extraneous-dependencies': ['error', { devDependencies: ['../src/**/*.spec.js', '../scripts/**/*.js'] }]
  }
};
