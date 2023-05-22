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
    async redirects() {
        return [
            {
                source: '/admin',
                destination: '/api/auth/signin',
                permanent: true,
            },
            {
                source: '/login',
                destination: '/api/auth/signin',
                permanent: true,
            },
        ];
    },
    experimental: {
        forceSwcTransforms: true,
    }
}