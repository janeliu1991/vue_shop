module.exports = {
    root: true,
    env: {
        node: true
    },
    'extends': [
        'plugin:vue/essential',
        '@vue/standard'
    ],
    rules: {
        'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        'no-trailing-spaces': 0,
        'no-multiple-empty-lines': 0,
        'indent': 0,
        'spaced-comment': 0,
        'import/first': 0,
        'eqeqeq': 0,
        'eol-last': 0
    },
    parserOptions: {
        parser: 'babel-eslint'
    }
}