const path = require('path');

const localCssIdentName = process.env.NODE_ENV !== 'production'
  ? "[path][name]__[local]--[hash:base64:5]"
  : "[hash:base64]"

// const mustWatch = process.env.NODE_ENV !== 'production';
const mustWatch = false;

module.exports = {
  mode: process.env.NODE_ENV,

  entry: path.join(__dirname, 'src', 'index.tsx'),
  resolve: {
    extensions: [
      '.ts',
      '.tsx',
      '.js',
      '.jsx'
    ]
  },

  watch: mustWatch,
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
        use: [
          'babel-loader',
          'ts-loader'
        ],
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
              sourceMap: true,
              modules: {
                localIdentName: localCssIdentName
              }
            },
          }
        ],
        include: [
          path.resolve(__dirname, 'src')
        ],
      }
    ]
  },
};