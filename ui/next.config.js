module.exports = {
    distDir: process.env.BUILD_DIR,
    async rewrites() {
        return [
            {
                source: '/api/:path*',
                destination: `${process.env.BASE_API_URL}/api/:path*` // Proxy to Backend
            }
        ]
    }
}