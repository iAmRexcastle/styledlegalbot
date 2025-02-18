const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
	webpack: (config) => {
		// Map the "~" alias to the "src" directory
		config.resolve.alias['~'] = path.join(__dirname, 'src');
		return config;
	},
};

module.exports = nextConfig;
