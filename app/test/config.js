var webpack = require('webpack');

module.exports = function(config) {
  config.set({
    plugins: [
      require('karma-webpack'),
      require('karma-chrome-launcher'),
      require('karma-jasmine'),
      require('karma-phantomjs-launcher'),
    ],

    basePath: '',
    frameworks: ['tap'],
    frameworks: ['jasmine'],
    files: ['app.js'],

    preprocessors: {
      'app.js': ['webpack']
    },

    webpack: {
      node: {
        fs: 'empty'
      },
    },

    webpackMiddleware: {
      noInfo: true
    },

    reporters: ['dots'],

    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Chrome'],
    singleRun: false
  })
};