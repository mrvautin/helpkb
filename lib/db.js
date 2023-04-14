/* eslint-disable import/no-anonymous-default-export */
import { Sequelize } from 'sequelize';
import { dbConfig } from '../lib/dbConfig';

export function db() {
    return new Sequelize(
        process.env.DB_NAME,
        process.env.DB_USERNAME,
        process.env.DB_PASSWORD,
        dbConfig
    );
};

export default {
    db,
};