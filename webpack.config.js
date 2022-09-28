const path = require('path')

module.exports = {
  entry: './src/plugin.js',
  output: {
    path: path.resolve(__dirname, './'),
    filename: 'code.js',
  },
  watch: true,
  mode: 'production',
}
