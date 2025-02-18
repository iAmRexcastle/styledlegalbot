const path = require('path');

module.exports = {
  webpack: (config) => {
    // Ensure the "~" alias points to the "src" folder
    config.resolve.alias['~'] = path.join(__dirname, 'src');
    return config;
  },
};
