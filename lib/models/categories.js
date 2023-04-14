/* eslint-disable import/no-anonymous-default-export */
import { DataTypes } from 'sequelize';

import { db } from '../db';

const sequelize = db();

export const CategoryModel = sequelize.define(
    "categories", {
        id: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        url: {
            type: DataTypes.STRING,
            allowNull: false
        },
        order: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        enabled: {
            type: DataTypes.BOOLEAN,
            allowNull: true
        }
    }
);

export default {
    CategoryModel,
};