const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { Op } = require('sequelize');
const { restrict } = require('../lib/auth');
const router = express.Router();

// DB models
const MenuModel = require('../models/menus');

router.get('/api/menu', async(req, res) => {
    // Get the menu from the db
    const menu = await MenuModel.findAll({
        order: [
            [ 'order', 'ASC' ]
        ],
        raw: true
    });

    if(!menu){
        return res.status(404).json({
            error: '404 - Not found'
        });
    }

    // Return menu
    res.json(menu);
});

router.put('/api/menu/sort', async(req, res) => {
    // Update the order
    for (var i = 0; i < req.body.length; i++) {
        const newOrder = i + 1;
        await MenuModel.update({ order: newOrder }, {
            where: {
                id: req.body[i].id
            }
        });
    }

    // Return response
    res.json('success');
});

router.put('/api/menu/insert', restrict, async (req, res) => {
    // Check for existing menu
    const duplicateMenuCheck = await MenuModel.count({
        where: {
            [Op.or]: {
                name: req.body.name,
                url: req.body.url
            }
        }
    });

    if(duplicateMenuCheck > 0){
        return res.status(400).json({
            error: 'Another menu with that name or Url exists. Please pick a different name or Url.'
        });
    }

    // Get existing
    const menu = await MenuModel.findAll({
        order: [
            [ 'order', 'ASC' ]
        ],
        raw: true
    });

    const order = menu.length + 1;

    // Insert into DB
    const id = uuidv4();
    try{
        await MenuModel.create({
            id: id,
            name: req.body.name,
            url: req.body.url,
            order: order
        });
        return res.json('success');
    }catch(ex){
        console.log('ex', ex);
        return res.status(400).json({
            error: 'Unable to create menu'
        });
    }
});

router.delete('/api/menu/delete/:id', restrict, async (req, res) => {
    // Check for menu
    const menu = await MenuModel.findOne({
        where: {
            id: req.params.id
        },
        raw: true
    });
    if(!menu){
        return res.status(400).json({
            error: 'Menu not found'
        });
    }

    // Remove the menu
    const menuDelete = await MenuModel.destroy({
        where: {
            id: req.params.id
        }
    });

    // Get the updated menu
    const menusUpdated = await MenuModel.findAll({
        order: [
            [ 'order', 'DESC' ]
        ],
        raw: true
    });

    // Update the order
    for (var i = 0; i < menusUpdated.length; i++) {
        const newOrder = i + 1;
        await MenuModel.update({ order: newOrder }, {
            where: {
                id: menusUpdated[i].id
            }
        });
    }

    if(menuDelete > 0){
        return res.json('success');
    }else{
        return res.status(400).json({
            error: 'Unable to delete menu'
        });
    }
});

module.exports = router;
