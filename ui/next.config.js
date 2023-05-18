const { readEnv } = require('../api/lib/env');
const env = readEnv();

module.exports = {
    generateBuildId: async () => {
        return 'buildId'
    },
    webpack: (
        config,
        { buildId, dev, isServer, defaultLoaders, nextRuntime, webpack },
      ) => {
        // Important: return the modified config
        return config;
    },
    async rewrites() {
        return [
            {
                source: '/api/:path*',
                destination: `${env.BASE_API_URL}/api/:path*` // Proxy to Backend
            }
        ]
    },
    env
}