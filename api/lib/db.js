const Sequelize = require('sequelize');
const dbConfig = require('../dbConfig');

const db = () => {
    const config = dbConfig.get();
    const sequelize = new Sequelize(
        process.env.DB_NAME,
        process.env.DB_USERNAME,
        process.env.DB_PASSWORD,
        config
    );

    return sequelize;
};

module.exports = {
    db
};
