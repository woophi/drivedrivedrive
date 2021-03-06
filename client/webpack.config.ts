import * as path from 'path';
import * as webpack from 'webpack';
import { Configuration as wdsConfiguration } from 'webpack-dev-server';
// import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import * as MiniCssExtractPlugin from 'mini-css-extract-plugin';
import TsCheckerPlugin = require('fork-ts-checker-webpack-plugin');
const HappyPack = require('happypack');

const isProduction = process.argv.find(a => a === '-p');
const threadPool = HappyPack.ThreadPool({ size: TsCheckerPlugin.ONE_CPU_FREE, id: 'kek' });

const devServer: wdsConfiguration = {
  port: 3001,
  https: true,
  disableHostCheck: true,
  headers: { 'Access-Control-Allow-Origin': '*' },
  contentBase: path.resolve(__dirname, '../server/public')
};

const config = {
  devServer,
  entry: {
    'lib.es6': './src/es6.js',
    'lib.glyphs': './glyphs/glyphs.js',
    'app.drive': './src/ui/app/app.tsx'
  },
  output: {
    libraryTarget: 'this',
    path: path.resolve(__dirname, '../server/public/'),
    filename: 'js/[name].js',
    publicPath: '/',
    chunkFilename: 'js/[name].js?[hash]',
    pathinfo: !isProduction
  },
  resolve: {
    alias: {
      src: path.resolve(__dirname, './src/'),
      core: path.resolve(__dirname, './src/core'),
      ui: path.resolve(__dirname, './src/ui'),
      tslib: path.resolve(__dirname, './node_modules/tslib')
    },
    extensions: ['.js', '.jsx', '.ts', '.tsx']
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        loader: 'happypack/loader?id=ts',
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader'
        ]
      },
      {
        test: /\.(png|gif|jpg|jpeg)$/,
        loader: 'file-loader?name=img/[name].[ext]?[md5:hash:base62]'
      },
      {
        test: /fonts[\\/].*\.(woff|woff2|eot|ttf|svg)$/,
        loader: 'file-loader?name=fonts/[name].[ext]?[md5:hash:base62]'
      },
      {
        test: /\.mp3$/,
        loader: 'file-loader?name=sounds/[name].[ext]?[md5:hash:base62]'
      },
      {
        test: /\.(mov|mp4)$/,
        loader: 'file-loader?name=videos/[name].[ext]?[md5:hash:base62]',
      },
      {
        test: /\.json$/,
        loader: 'happypack/loader?id=json',
        exclude: /node_modules/,
        type: 'javascript/auto'
      },
    ]
  },
  externals: {},
  devtool: isProduction ? false : 'cheap-module-source-map',
  plugins: [
    new webpack.DllReferencePlugin({
      context: __dirname,
      manifest: require('../server/public/lib.base-manifest.json')
    }),
    // new BundleAnalyzerPlugin({
    //   analyzerMode: 'static',
    //   generateStatsFile: true,
    //   openAnalyzer: false
    // }),
    new MiniCssExtractPlugin({
      filename: "css/[name].css",
      chunkFilename: "css/[id].css"
    }),
    new webpack.IgnorePlugin(/\blocale.*/, /\bmoment\b/),

    new TsCheckerPlugin({
      checkSyntacticErrors: true,
      async: false,
      silent: false,
      memoryLimit: 2048,
      watch: ['./src']
    }),
    new HappyPack({
      id: 'ts',
      threadPool,
      loaders: [
        {
          loader: 'ts-loader',
          options: {
            happyPackMode: true
          }
        }
      ]
    }),
    new HappyPack({
      id: 'css',
      loaders: ['css-loader?sourceMap&minimize&-autoprefixer&safe'],
      threadPool
    }),
    new HappyPack({
      id: 'json',
      loaders: ['json-loader'],
      threadPool
    })
  ].filter(Boolean)
};

export default config;
