const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  entry: './src/index.js',
  mode: 'production',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
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
        test: /\.(png|jpg|jpeg|svg|gif|webp)$/,
        include: [
            path.resolve(__dirname, '/public')
        ],
        use: [{
            loader: 'file-loader',
            options: {
                name: '[name].[ext]',
            }
        }]
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
};
