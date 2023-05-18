const express = require('express');
const { restrict } = require('../lib/auth');
const prisma = require('../lib/prisma');
const router = express.Router();

router.get('/api/menu', async(req, res) => {
    // Get the menu from the db
    const menu = await prisma.menus.findMany({
        orderBy: {
            order: 'asc',
        }
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
        await prisma.menus.update({
            where: {
                id: req.body[i].id
            },
            data: {
                order: newOrder 
            }
        });
    }

    // Return response
    res.json('success');
});

router.put('/api/menu/insert', restrict, async (req, res) => {
    // Check for existing menu
    const duplicateMenuCheck = await prisma.menus.count({
        where: {
            name: req.body.name,
            url: req.body.url
        }
    });

    if(duplicateMenuCheck > 0){
        return res.status(400).json({
            error: 'Another menu with that name or Url exists. Please pick a different name or Url.'
        });
    }

    // Get existing
    const menu = await prisma.menus.findMany({
        orderBy: {
            order: 'asc'
        }
    });

    const order = menu.length + 1;

    // Insert into DB
    try{
        await prisma.menus.create({
            data: {
                name: req.body.name,
                url: req.body.url,
                order: order
            }
        });
        return res.json('success');
    }catch(ex){
        return res.status(400).json({
            error: 'Unable to create menu'
        });
    }
});

router.delete('/api/menu/delete/:id', restrict, async (req, res) => {
    // Check for menu
    try{
        const menu = await prisma.menus.findFirst({
            where: {
                id: req.params.id
            }
        });
        if(!menu){
            return res.status(400).json({
                error: 'Menu not found'
            });
        }
    }catch(ex){
        return res.status(400).json({
            error: 'Menu not found'
        });
    }

    // Remove the menu
    const menuDelete = await prisma.menus.delete({
        where: {
            id: req.params.id
        }
    });

    // Get the updated menu
    const menusUpdated = await prisma.menus.findMany({
        orderBy: [
            { order: 'desc' }
        ]
    });

    // Update the order
    for (var i = 0; i < menusUpdated.length; i++) {
        const newOrder = i + 1;
        await prisma.menus.update({
            where: {
                id: menusUpdated[i].id
            },
            data: {
                order: newOrder
            }
        });
    }

    if(menuDelete){
        return res.json('success');
    }else{
        return res.status(400).json({
            error: 'Unable to delete menu'
        });
    }
});

module.exports = router;
