const webpack = require('webpack');

module.exports = {
  resolve: {
    fallback: {
      // fix for `dotenv` library
      fs: false,
      // fix for `dotenv` library
      path: false,
      // fix for `dotenv` library
      os: false,
    }
  }
};
