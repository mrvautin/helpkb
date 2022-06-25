module.exports = {
    distDir: process.env.BUILD_DIR,
    webpack: (config, { dev, isServer }) => {
        if (!dev && !isServer) {
            Object.assign(config.resolve.alias, {
                react: 'preact/compat',
                'react-dom/test-utils': 'preact/test-utils',
                'react-dom': 'preact/compat',
            })
        }
        return config
    },
    async rewrites() {
        return [
            {
                source: '/api/:path*',
                destination: `${process.env.BASE_API_URL}/api/:path*` // Proxy to Backend
            }
        ]
    }
}