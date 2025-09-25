module.exports = {
  presets: [
    [
      '@babel/preset-env',
      { targets: { node: 'current' }, modules: 'commonjs' },
    ],
    ['@babel/preset-react', { runtime: 'classic' }],
  ],
  plugins: [
    ['@babel/plugin-transform-class-properties', { loose: true }],
    ['@babel/plugin-transform-object-rest-spread', { loose: true }],
  ],
};

