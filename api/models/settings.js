const { DataTypes } = require('sequelize');

 const { db } = require('../lib/db');
const sequelize = db();

const Setting = sequelize.define(
    "settings", {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
        },
        websiteName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        websiteDescription: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        welcomeMessage: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        searchPlaceholder: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        dateFormat: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        showArticleDetails: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
        },
        baseUrl: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        indexType: {
            type: DataTypes.STRING,
            allowNull: true,
        }
    },
    {}
);

module.exports = Setting;