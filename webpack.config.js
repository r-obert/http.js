const path = require('path');

module.exports = {
  entry: './src/window-global.js',
  mode: 'production',
  target: ['web', 'es5'],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'http-client.min.js'
  },
};
