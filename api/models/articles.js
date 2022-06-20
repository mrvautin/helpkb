const { DataTypes } = require('sequelize');

 const { db } = require('../lib/db');
const sequelize = db();

const Article = sequelize.define(
    "articles", {
        id: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true
        },
        url: {
            type: DataTypes.STRING,
            allowNull: false
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        published: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        },
        category: {
            type: DataTypes.STRING,
            allowNull: true
        },
        pinned: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
            defaultValue: false
        },
        publishedDate: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: new Date().toISOString()
        },
        views: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: 0
        }
    },
    {}
);

module.exports = Article;