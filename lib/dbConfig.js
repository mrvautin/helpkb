export const dbConfig = {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    dialect: 'postgres',
    logging: (process.env.DB_LOGGING === 'true'),
    pool: { maxConnections: 5, maxIdleTime: 30 },
    language: 'en'
}