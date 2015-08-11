var webpack = require('webpack');

module.exports = function(config) {
  config.set({
    singleRun: true,
    basePath: '',
    browsers: ['Chrome'],
    frameworks: ['jasmine'],
    files: ['components/*.js', 'libs/*.js'],

    plugins: [
      'karma-webpack',
      'karma-jasmine',
      'karma-chrome-launcher',
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