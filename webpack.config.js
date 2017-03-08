let webpack = require('webpack');

module.exports = {
  devtool: 'source-map',
  entry: './src/bc-phone-number.js',
  output: {
    filename: 'dist/bc-phone-number.js',
    library: 'bc-phone-number',
    libraryTarget: 'umd'
  },
  externals: {
    'bc-countries': 'bc-countries',
    'angular': true,
    'angular-ui-bootstrap': true,
    'digits-trie': true
  },
  resolve: {
    mainFields: ['webpack', 'browser', 'main'],
  },
  module: {
    rules: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel-loader',
      options: {
        presets: [
          'es2015'
        ]
      }
    }, {
      test: /\.html$/,
      use: [{
        loader: 'html-loader',
        options: {
          minimize: true
        }
      }]
    }, {
      test: /\.css$/,
      use: ['style-loader', 'css-loader'],
    }, {
      test: /\.(eot|svg|ttf|woff|woff2)$/,
      use: ['file-loader?name=fonts/[name].[ext]']
    }, {
      test: /\.png$/,
      use: ['file-loader?name=images/[name].[ext]']
    }]
  }
};
