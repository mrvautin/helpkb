const { DataTypes } = require('sequelize');

 const { db } = require('../lib/db');
const sequelize = db();

const User = sequelize.define(
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
    },
    {}
);

module.exports = User;