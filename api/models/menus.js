const { DataTypes } = require('sequelize');

 const { db } = require('../lib/db');
const sequelize = db();

const User = sequelize.define(
    "menus", {
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
        }
    },
    {}
);

module.exports = User;