const path = require('path');

module.exports = {
  mode: 'development',

  entry: path.join(__dirname, 'src', 'index.tsx'),
  resolve: {
    extensions: [
      '.ts',
      '.tsx',
      '.js',
      '.jsx'
    ]
  },

  watch: true,
  watchOptions: {
    ignored: [
      './node_modules/',
      './build/',
      './.husky/',
      './.vscode/',
      './*.json',
      './*.js',
      './build/index.html'
    ]
  },
  
  output: {
    path: path.join(__dirname, 'build'),
    publicPath: '/build/',
    filename: 'bundle.js',
    chunkFilename: '[name].js'
  },
  devtool: 'source-map',

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'babel-loader',
        include: [
          path.resolve(__dirname, 'src')
        ],
        exclude: [
          path.resolve(__dirname, 'node_modules')
        ],
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: false // необходимо для того, чтобы css классы не переименовывались
            }
          }
        ],
        include: [
          path.resolve(__dirname, 'src')
        ],
      }
    ]
  },
};