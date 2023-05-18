const express = require('express');
const prisma = require('../lib/prisma');
const { restrict } = require('../lib/auth');
const router = express.Router();

router.get('/api/category/:category', async(req, res) => {
    let categoryParam = req.params.category;
    // Get category
    const category = await prisma.categories.findFirst({
        where: {
            url: categoryParam
        }
    });

    if(!category){
        return res.status(404).json({
            error: '404 - Not found'
        });
    }

    // Run DB query
    const articles = await prisma.articles.findMany({
        where: {
            published: true,
            category: {
                equals: category.name,
                mode: 'insensitive'
            }
        },
        orderBy: [
            { pinned: 'desc' },
            { publishedDate: 'desc' }
        ],
    });

    // Return category articles
    return res.json({
        articles,
        category
    });
});

router.get('/api/categories', async(req, res) => {
    // Get the categories from the db
    const categories = await prisma.$queryRaw`SELECT count(articles.id)::int as count, categories.name, categories.url, categories.id, categories.order
    FROM categories
    LEFT JOIN articles 
    ON categories.name = articles.category 
    GROUP BY categories.name, categories.id, categories.order, categories.url
    ORDER BY categories.order`

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
        await prisma.categories.update({
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

router.put('/api/category/insert', restrict, async (req, res) => {
    // Check for existing category
    const duplicateCategoryCheck = await prisma.categories.count({
        where: {
            OR: [
                { name: req.body.name },
                { url: req.body.url },
            ]
        }
    });
    if(duplicateCategoryCheck > 0){
        return res.status(400).json({
            error: 'Another category with that name or Url exists. Please pick a different name or Url.'
        });
    }

    // Get existing
    const categories = await prisma.categories.findMany({
        orderBy: {
            order: 'asc'
        }
    });

    const order = categories.length + 1;

    // Insert into DB
    try{
        await prisma.categories.create({
            data: {
                name: req.body.name,
                url: req.body.url,
                enabled: true,
                order: order
            }
        });
        return res.json('success');
    }catch(ex){
        return res.status(400).json({
            error: 'Unable to create category'
        });
    }
});

router.delete('/api/category/delete/:id', restrict, async (req, res) => {
    // Check for category
    try{
        const category = await prisma.categories.findFirst({
            where: {
                id: req.params.id
            }
        });
        if(!category){
            return res.status(400).json({
                error: 'Category not found'
            });
        }
    }catch(ex){
        return res.status(400).json({
            error: 'Category not found'
        });
    }

    // Remove the category
    const categoryDelete = await prisma.categories.delete({
        where: {
            id: req.params.id
        }
    });

    // Get the updated categories
    const categories = await prisma.categories.findMany({
        orderBy: {
            order: 'asc'
        }
    });

    // Update the order
    for (var i = 0; i < categories.length; i++) {
        const newOrder = i + 1;
        await prisma.categories.update({
            where: {
                id: categories[i].id
            },
            data: {
                order: newOrder
            }
        });
    }

    // Respond
    if(categoryDelete){
        return res.json('success');
    }else{
        console.log('in here ex', categoryDelete);
        return res.status(400).json({
            error: 'Unable to delete category'
        });
    }
});

module.exports = router;
