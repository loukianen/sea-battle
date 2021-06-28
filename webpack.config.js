const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      favicon: './src/public/favicon.ico',
      filename: 'index.html',
      template: 'src/public/index.html',
    }),
    new MiniCssExtractPlugin(
      {
        filename: './style.css',
      },
    ),
    new CopyPlugin({
      patterns: [
        { from: "src/img", to: "img" },
        { from: "src/css", to: "css" },
        { from: "src/scripts", to: "scripts" },
      ],
    }),
  ],
  devServer: {
    contentBase: './dist',
    port: 7800,
    watchContentBase: true,
    progress: true
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/i,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
      {
        test: /\.(gif|png|jpg|jpeg)$/i,
        use: [
          {
            loader: 'file-loader',
          }
        ],
      },
      {
        test: /\.(js)$/,
        include: [
            path.resolve(__dirname, '/scripts')
        ],
        use: [{
            loader: 'file-loader',
            options: {
                name: '[name].[ext]',
            }
        }]
      },
    ],
  },
};
