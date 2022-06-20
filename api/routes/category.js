const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { db } = require('../lib/db');
const { Op } = require('sequelize');
const { restrict } = require('../lib/auth');
const router = express.Router();

// DB models
const ArticleModel = require('../models/articles');
const CategoryModel= require('../models/categories');

router.get('/api/category/:category', async(req, res) => {
    let categoryParam = req.params.category;
    // Get category
    const category = await CategoryModel.findOne({
        where: {
            url: categoryParam
        },
        raw: true
    });

    // Run DB query
    const articles = await ArticleModel.findAll({
        where: {
            [Op.and]: [
                { published: true },
                db().where(
                    db().fn('lower', db().col('category')), 
                    db().fn('lower', category.name),
                )
            ]
        },
        order: [
            [ 'pinned', 'DESC' ],
            [ 'publishedDate', 'DESC' ]
        ],
        raw: true
    });

    // Return category articles
    return res.json(articles);
});

router.get('/api/categories', async(req, res) => {
    // Get the categories from the db
    const [categories] = await db().query(
        `SELECT count(articles.id) as count, categories.name, categories.url, categories.id, categories.order
        FROM categories
        LEFT JOIN articles 
        ON categories.name = articles.category 
        GROUP BY categories.name, categories.id, categories.order, categories.url
        ORDER BY categories.order`
    );

    if(!categories){
        return res.status(404).json({
            error: '404 - Not found'
        });
    }

    // Return categories
    res.json(categories);
});

router.put('/api/category/sort', async(req, res) => {
    // Update the order
    for (var i = 0; i < req.body.length; i++) {
        const newOrder = i + 1;
        await CategoryModel.update({ order: newOrder }, {
            where: {
                id: req.body[i].id
            }
        });
    }

    // Return response
    res.json('success');
});

router.put('/api/category/insert', restrict, async (req, res) => {
    // Check for existing category
    const duplicateCategoryCheck = await CategoryModel.count({
        where: {
            [Op.or]: {
                name: req.body.name,
                url: req.body.url
            }
        }
    });
    if(duplicateCategoryCheck > 0){
        return res.status(400).json({
            error: 'Another category with that name or Url exists. Please pick a different name or Url.'
        });
    }

    // Get existing
    const categories = await CategoryModel.findAll({
        order: [
            [ 'order', 'ASC' ]
        ],
        raw: true
    });

    const order = categories.length + 1;

    // Insert into DB
    const id = uuidv4();
    try{
        await CategoryModel.create({
            id: id,
            name: req.body.name,
            url: req.body.url,
            enabled: true,
            order: order
        });
        return res.json('success');
    }catch(ex){
        console.log('ex', ex);
        return res.status(400).json({
            error: 'Unable to create category'
        });
    }
});

router.delete('/api/category/delete/:id', restrict, async (req, res) => {
    // Check for category
    const category = await CategoryModel.findOne({
        where: {
            id: req.params.id
        },
        raw: true
    });
    if(!category){
        return res.status(400).json({
            error: 'Category not found'
        });
    }

    // Remove the category
    const categoryDelete = await CategoryModel.destroy({
        where: {
            id: req.params.id
        }
    });

    // Get the updated categories
    const categories = await CategoryModel.findAll({
        order: [
            [ 'order', 'ASC' ]
        ],
        raw: true
    });

    // Update the order
    for (var i = 0; i < categories.length; i++) {
        const newOrder = i + 1;
        await CategoryModel.update({ order: newOrder }, {
            where: {
                id: categories[i].id
            }
        });
    }

    if(categoryDelete > 0){
        return res.json('success');
    }else{
        return res.status(400).json({
            error: 'Unable to delete category'
        });
    }
});

module.exports = router;
