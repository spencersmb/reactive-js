import webpack from 'webpack';
import path from 'path';
import autoprefixer from 'autoprefixer';

const ROOT_PATH = path.resolve(__dirname);
export default {
  devtool: 'inline-source-map',
  entry: [
    'eventsource-polyfill', // necessary for hot reloading with IE
    'webpack-hot-middleware/client?reload=true', // note that it reloads the page if hot module reloading fails.
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
      // App: path.resolve(ROOT_PATH, 'src/components/app.js'),
      // About: path.resolve(ROOT_PATH, 'src/components/about/aboutPage.js'),
      // Courses: path.resolve(ROOT_PATH, 'src/components/course/coursesPage.js'),
      // ManageCourses: path.resolve(ROOT_PATH, 'src/components/course/ManageCoursePage.js'),
      // Header: path.resolve(ROOT_PATH, 'src/components/common/header.js'),
      // Home: path.resolve(ROOT_PATH, 'src/components/home/homePage.js'),
      // Routes: path.resolve(ROOT_PATH, 'src/routes.js'),
      // courseActions: path.resolve(ROOT_PATH, 'src/actions/courseActions.js')
    },
    extensions: ['.js']
  },
  devServer: {
    contentBase: path.resolve(__dirname, 'src'),
    debug: true, // enables displaying debug info
    noInfo: false // webpack will display a list of all the files its bundling
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()

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
