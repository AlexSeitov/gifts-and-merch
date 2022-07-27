import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import FileIncludeWebpackPlugin from 'file-include-webpack-plugin';

export default {
  mode: 'development',
  entry: ['./src/scripts/index.js', './src/styles/main.scss'],
  output: {
    filename: 'js/bundle.min.js',
    path: path.resolve('dist')
  },
  devServer: {
    static: path.resolve('src'),
    historyApiFallback: true,
    compress: true,
    port: 3000,
    open: true
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      {
        test: /\.(scss|css)$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
      },
      {
        test: /\.(jpg|jpeg|png|gif)$/i,
        type: 'asset/resource'
      }
    ]
  },
  plugins: [
    new FileIncludeWebpackPlugin({
      source: './src/html/'
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './src/html/index.html'
    }),

    new MiniCssExtractPlugin({
      linkType: 'text/css',
      filename: 'css/main.styles.css'
    })
  ]
};
