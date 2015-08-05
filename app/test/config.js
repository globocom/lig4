var webpack = require('webpack');

module.exports = function(config) {
  config.set({
    singleRun: true,
    basePath: '',
    browsers: ['Chrome'],
    frameworks: ['jasmine'],
    files: ['components/*.js', 'libs/*.js'],

    plugins: [
      require('karma-webpack'),
      require('karma-chrome-launcher'),
      require('karma-jasmine'),
    ],

    preprocessors: {
      'components/*.js': ['webpack'],
      'libs/*.js': ['webpack'],
    },

    webpackMiddleware: {
      noInfo: true
    },
  });
};