const { readEnv } = require('../api/lib/env');
const env = readEnv();

module.exports = {
    distDir: process.env.BUILD_DIR,
    generateBuildId: async () => {
        return 'buildId'
    },
    webpack: (config, { dev, isServer }) => {
        if (!dev && !isServer) {
            Object.assign(config.resolve.alias, {
                react: 'preact/compat',
                'react-dom/test-utils': 'preact/test-utils',
                'react-dom': 'preact/compat',
            })
        }
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