const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// const ESLintPlugin = require('eslint-webpack-plugin');

const isDevelopment = process.env.NODE_ENV !== 'production';

module.exports = {
  entry: './src/index.ts',
  devtool: isDevelopment ? 'inline-source-map' : undefined,
  output: {
    filename: 'js/[name].[contenthash].js',
    path: path.resolve(__dirname, 'dist'),
    assetModuleFilename: 'assets/[hash][ext][query]',
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          isDevelopment ? 'style-loader' : MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader',
        ],
      },
      // {
      //   test: /\.(woff2?|ttf|otf|eot|svg)$/,
      //   exclude: /node_modules/,
      //   loader: 'file-loader',
      //   options: {
      //     name: 'assets/fonts/[path][name].[ext]',
      //   },
      // },
      {
        test: /\.png/,
        type: 'asset/resource',
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'public', 'index.html'),
    }),
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css',
    }),
    // new ESLintPlugin()
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, 'public'),
    },
    compress: true,
    port: 9000,
  },
  resolve: {
    alias: {
      '@/assets': path.resolve(__dirname, './src/assets/'),
      '@/modules': path.resolve(__dirname, './src/modules/'),
      '@/styles': path.resolve(__dirname, './src/styles/'),
      '@/config': path.resolve(__dirname, './src/config/'),
      // '@/types': path.resolve(__dirname, './src/types/'),
    },
    extensions: ['.tsx', '.ts', '.js'],
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendor',
          chunks: 'all',
        },
      },
    },
  },
};
