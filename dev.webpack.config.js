const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  entry: './src/index.js',
  mode: 'development',
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
      ],
    }),
  ],
  devServer: {
    contentBase: './dist',
    port: 7800,
    historyApiFallback: false,
    inline: true,
  },
  module: {
    rules: [
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
    ],
  },
};
