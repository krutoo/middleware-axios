module.exports = api => api.env('test')
  ? {
    presets: [
      ['@babel/preset-env', {
        targets: { node: 'current' },
      }],
    ],
  }
  : {
    presets: [
      '@babel/preset-modules'
    ],
  };

