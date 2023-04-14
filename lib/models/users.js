/* eslint-disable import/no-anonymous-default-export */
import { DataTypes } from 'sequelize';

import { db } from '../db';

const sequelize = db();

export const UserModel = sequelize.define(
    "users", {
        id: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        enabled: {
            type: DataTypes.BOOLEAN,
            allowNull: true
        },
        admin: {
            type: DataTypes.BOOLEAN,
            allowNull: true
        },
        owner: {
            type: DataTypes.BOOLEAN,
            allowNull: true
        }
    }
);

export default {
    UserModel,
};