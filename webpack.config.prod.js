import webpack from 'webpack';
import path from 'path';
import ExtractTextPlugin from 'extract-text-webpack-plugin';

const GLOBALS = {
  'process.env.NODE_ENV': JSON.stringify('production')
};



const ROOT_PATH = path.resolve(__dirname);
export default {
  devtool: 'source-map',
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
    extensions: ['.js']
  },
  devServer: {
    contentBase: './dist',
    debug: true, // enables displaying debug info
    noInfo: false // webpack will display a list of all the files its bundling
  },
  plugins: [
   new webpack.optimize.OccurrenceOrderPlugin(),
   new webpack.DefinePlugin(GLOBALS),
   // new ExtractTextPlugin('styles.css'),
   new webpack.optimize.DedupePlugin(),
   new webpack.optimize.UglifyJsPlugin({
     // sourceMap: true,
     // compress: {
     //  warnings: true
     // }
   })
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        include: path.join(__dirname, 'src'),
        use: [
          {
            loader: 'babel-loader'
          }
        ],
        exclude: /node_modules/
      },
      {
        test: /(\.css)$/,
        use:[
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader'
          }
        ]
      },
      {
        test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
        use:[
          {
            loader: 'file-loader'
          }
        ]
      },
      {
        test: /\.(woff|woff2)$/,
        use:[
          {
            loader: 'url-loader',
            options: {
              prefix: 'font',
              limit: 5000
            }
          }
        ]
      },
      {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        use:[
          {
            loader: 'url-loader',
            options: {
              limit: 1000,
              mimetype: 'application/octet-stream'
            }
          }
        ]
      },
      {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        use:[
          {
            loader: 'url-loader',
            options: {
              limit: 1000,
              mimetype: 'image/svg+xml'
            }
          }
        ]
      }
    ]
  }
};
