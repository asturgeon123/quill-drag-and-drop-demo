const HtmlWebpackPlugin = require('html-webpack-plugin');
const InlineSourceWebpackPlugin = require('inline-source-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: './src/index.js', // path to your main js file, check this is correct
  output: {
    path: __dirname + '/dist',
    filename: 'bundle.js'
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'src/index.html' // input html file
    }),
    new InlineSourceWebpackPlugin({
      compress: false,
      rootpath: './src',
      noAssetMatch: 'warn',
    })
  ],
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
            plugins: ['@babel/plugin-proposal-class-properties']
          }
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  }
};