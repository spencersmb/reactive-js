import webpack from 'webpack';
import path from 'path';
import ExtractTextPlugin from 'extract-text-webpack-plugin';

const GLOBALS = {
  'process.env.NODE_ENV': JSON.stringify('production')
};



const ROOT_PATH = path.resolve(__dirname);
export default {
  debug: true, // enables displaying debug info
  devtool: 'source-map',
  noInfo: false, // webpack will display a list of all the files its bundling
  entry: [
    path.resolve(__dirname, 'src/index') // targets index.js - must be placed last in the array
  ],
  target: 'web', //could target node here if our server was serving an app
  output: {
    path: __dirname + '/dist', // Note: Physical files are only output by the production build task `npm run build`.
    publicPath: '/',
    filename: 'bundle.js'
  },
  resolve: {
    alias: {
      applicationStyles$: path.resolve(ROOT_PATH, 'src/styles/app.scss')
    },
    extensions: ['', '.js']
  },
  devServer: {
    contentBase: './dist'
  },
  plugins: [
   new webpack.optimize.OccurenceOrderPlugin(),
   new webpack.DefinePlugin(GLOBALS),
   // new ExtractTextPlugin('styles.css'),
   new webpack.optimize.DedupePlugin(),
   new webpack.optimize.UglifyJsPlugin({
     sourceMap: true,
     compress: {
      warnings: true
     }
   })
  ],
  module: {
    loaders: [
      {test: /\.js$/, include: path.join(__dirname, 'src'), loaders: ['babel']},
      {test: /(\.css)$/, loader: ExtractTextPlugin.extract("css?sourceMap")},
      {test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: 'file'},
      {test: /\.(woff|woff2)$/, loader: 'url?prefix=font/&limit=5000'},
      {test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&mimetype=application/octet-stream'},
      {test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&mimetype=image/svg+xml'}
    ]
  }
};
