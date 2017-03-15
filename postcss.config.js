module.exports = {
  plugins: [
    require('autoprefixer')({
      browsers: ['last 4 versions', '> 2%', 'android 4', 'opera 12']
    })
  ]
};