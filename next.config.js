/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
};

module.exports = {
  ...nextConfig,
  webpack: (config, { isServer }) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      bufferutil: false,
      'utf-8-validate': false,
      ws: false,
    };
    config.ignoreWarnings = [
      ...(config.ignoreWarnings || []),
      {
        module: /@supabase[\\/]realtime-js[\\/]dist[\\/]main[\\/]RealtimeClient\.js$/,
        message: /Critical dependency: the request of a dependency is an expression/
      }
    ];
    return config;
  },
};
