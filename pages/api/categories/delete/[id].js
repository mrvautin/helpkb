const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { db } = require('../../../lib/db');
const { Op } = require('sequelize');
const { restrict } = require('../../../lib/auth');
const router = express.Router();

// DB models
const ArticleModel = require('../models/articles');
const CategoryModel= require('../models/categories');

export default async function handler(req, res) {
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
};

router.put('/api/categories/insert', restrict, async (req, res) => {
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

router.delete('/api/categories/delete/:id', restrict, async (req, res) => {
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
