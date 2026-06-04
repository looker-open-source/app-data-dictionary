// © 2019 Google LLC.  All rights reserved.
//
// This software is subject to the Google Cloud Terms of Service, as
// modified by the "General Software Terms" of the Google Cloud Service Specific Terms, available at: https://cloud.google.com/terms/service-terms.

const commonConfig = require('./webpack.config')

module.exports = {
  ...commonConfig,
  output: {
    ...commonConfig.output,
    publicPath: 'https://localhost:8080/',
  },
  mode: 'development',
  module: {
    rules: [
      ...commonConfig.module.rules,
      {
        test: /\.(js|jsx|ts|tsx)?$/,
        use: 'react-hot-loader/webpack',
        include: /node_modules/,
      },
    ],
  },
  devServer: {
    index: 'index.html',
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers':
        'X-Requested-With, content-type, Authorization',
    },
  },
  plugins: [...commonConfig.plugins],
}
