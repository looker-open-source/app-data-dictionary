// © 2019 Google LLC.  All rights reserved.
//
// This software is subject to the Google Cloud Terms of Service, as
// modified by the "General Software Terms" of the Google Cloud Service Specific Terms, available at: https://cloud.google.com/terms/service-terms.

const commonConfig = require("./webpack.config");

module.exports = {
  ...commonConfig,
  mode: "production",
  optimization: {
    chunkIds: "named",
  },
};
