import path from 'path';
// (import removed)

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    // Set up the "@" alias to point to the "src" folder
    config.resolve.alias['@'] = path.join(__dirname, 'src');

    // Add a rule to load SVGs with SVGR
    config.module.rules.push({
      test: /\.svg$/,
      issuer: { and: [/\.(js|ts)x?$/] },
      use: ['@svgr/webpack'],
    });

    return config;
  },
  // You can add other Next.js configuration here if needed.
};

const sentryWebpackPluginOptions = {
  org: "mti-firm",
  project: "javascript-nextjs",
  silent: !process.env.CI,
  widenClientFileUpload: true,
  reactComponentAnnotation: { enabled: true },
  tunnelRoute: "/monitoring",
  hideSourceMaps: true,
  disableLogger: true,
  automaticVercelMonitors: true,
};

export default withSentryConfig(nextConfig, sentryWebpackPluginOptions);