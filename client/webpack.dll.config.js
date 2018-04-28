/// <binding ProjectOpened='Watch - Development' />
const path = require('path');
const webpack = require('webpack');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const isProduction = process.argv.find(a => a === '-p');

module.exports = {
  entry: {
    'base': ['./src/base.js']
  },
  output: {
    libraryTarget: 'this',
    library: 'lib[name]',
    path: path.resolve(__dirname, '../server/public'),
    filename: 'js/lib.[name].js',
    chunkFilename: 'js/lib.[name].js?[hash]',
    pathinfo: !isProduction
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx']
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        options: {
          logLevel: 'warn'
        }
      }
    ]
  },
  plugins: [
    new BundleAnalyzerPlugin({
      reportFilename: 'report.dll.html',
      statsFilename: 'stats.dll.json',
      analyzerMode: 'static',
      generateStatsFile: true,
      openAnalyzer: false
    }),
    new webpack.IgnorePlugin(/\blocale.*/, /\bmoment\b/),
    new webpack.DllPlugin({
      path: path.join('../server/public/lib.[name]-manifest.json'),
      name: 'lib[name]'
    }),
  ]
};
