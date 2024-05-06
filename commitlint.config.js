module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'build',
        'ci',
        'chore',
        'docs',
        'feature',
        'fix',
        'perf',
        'refactor',
        'enhancement',
        'revert',
        'style',
        'test',
      ],
    ],
  },
};
