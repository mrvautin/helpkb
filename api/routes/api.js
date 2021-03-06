const express = require('express');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const { db } = require('../lib/db');
const { validateMatter, convertBool } = require('../lib/data');
const { restrict } = require('../lib/auth');
const { Op } = require('sequelize');
const router = express.Router();

// DB models
const ArticleModel = require('../models/articles');

router.get('/api/article/:articleurl', async(req, res) => {
    // Run DB query
    const article = await ArticleModel.findOne({
        where: {
            url: req.params.articleurl,
            published: true
        },
        raw: true
    });

    // Check if article found and return 404 if not
    if(!article){
        return res.status(404).json({
            error: '404 - Not found'
        });
    }

    // Update view count if not logged in
    if(!req.user){
        let viewCount = article.views !== null ? article.views : 0;
        viewCount++;
        await ArticleModel.update({ views: viewCount }, {
            where: {
                id: article.id
            }
        });
    }

    // Return article data
    return res.json(article);
});

router.get('/api/search/:searchparam', async(req, res) => {
    // Run DB query
    const searchParam = req.params.searchparam.toLowerCase();
    const articles = await ArticleModel.findAll({
        where: {
            [Op.or]: {
                title: db().where(db().fn('LOWER', db().col('title')), 'LIKE', `%${searchParam}%`),
                content: db().where(db().fn('LOWER', db().col('content')), 'LIKE', `%${searchParam}%`)
            },
            published: true
        },
        order: [
            [ 'publishedDate', 'DESC' ]
        ],
        limit: 10,
        raw: true
    });

    // Return search data
    return res.json(articles);
});

router.get('/api/search/count/:num', async(req, res) => {
    let limit = parseInt(req.params.num);
    if(limit > process.env.ARTICLE_LIMIT_RETURNED || 20){
        limit = process.env.ARTICLE_LIMIT_RETURNED || 20;
    }

    // Run DB query
    const articles = await ArticleModel.findAll({
        where: {
            published: true
        },
        order: [
            [ 'pinned', 'DESC' ],
            [ 'publishedDate', 'DESC' ]
        ],
        limit: limit,
        raw: true
    });

    // Return search data
    return res.json(articles);
});

router.get('/api/admin/search/count/:num', restrict, async(req, res) => {
    // Run DB query
    const articles = await ArticleModel.findAll({
        order: [
            [ 'pinned', 'DESC' ],
            [ 'publishedDate', 'DESC' ]
        ],
        limit: parseInt(req.params.num)
    });

    // Return search data
    return res.json(articles);
});

router.get('/api/article/edit/:id', restrict, async(req, res) => {
    // Run DB query
    const article = await ArticleModel.findOne({
        where: {
            id: req.params.id
        }
    });

    // Check for article found and return 404 if not
    if(!article){
        return res.json({
            error: '404 - Not found'
        });
    }

    // Return article data
    res.json(article);
});

router.put('/api/article/insert', restrict, async(req, res) => {
    // Validate post matter
    const parsedMatter = validateMatter(req.body.content);

     // If validation error, return error
     if(parsedMatter.matterError){
        return res.status(400).json({
            error: parsedMatter.matterError
        }); 
    }

    // Setup data
    const data = {};
    data.title = parsedMatter.data.title;
    data.url = parsedMatter.data.url;
    data.published = convertBool(parsedMatter.data.published);
    data.category = parsedMatter.data.category ? parsedMatter.data.category : 'General';
    data.pinned = convertBool(parsedMatter.data.pinned);
    data.content = req.body.content;
    data.views = 0;
    try{
        data.publishedDate = new Date(parsedMatter.data.date).toISOString();
    }catch(ex){
        return res.status(400).json({
            error: 'Invalid format of "date" in article meta data'
        }); 
    }

    // Check for existing
    const duplicateUrlCheck = await ArticleModel.count({
        where: {
            url: data.url
        }
    });
    if(duplicateUrlCheck > 0){
        return res.status(400).json({
            error: 'Another article with that URL exists. Please pick another URL.'
        });
    }

    // Insert into DB
    try{
        const id = uuidv4();
        await ArticleModel.create({
            id: id,
            url: data.url,
            title: data.title,
            content: data.content,
            published: convertBool(data.published),
            category: data.category,
            publishedDate: data.publishedDate,
            views: data.views
        });
        return res.json({
            articleId: id
        });
    }catch(ex){
        return res.status(400).json({
            error: 'Unable to save data'
        });
    }
});

router.put('/api/article/save', restrict, async (req, res) => {
    // Validate post matter
    const parsedMatter = validateMatter(req.body.content);
    
    // If validation error, return error
    if(parsedMatter.matterError){
        return res.status(400).json({
            error: parsedMatter.matterError
        }); 
    }

    // Setup data
    const data = {};
    data.title = parsedMatter.data.title;
    data.url = parsedMatter.data.url;
    data.published = convertBool(parsedMatter.data.published);
    data.category = parsedMatter.data.category ? parsedMatter.data.category : 'General';
    data.pinned = convertBool(parsedMatter.data.pinned);
    try{
        data.publishedDate = new Date(parsedMatter.data.date).toISOString();
    }catch(ex){
        return res.status(400).json({
            error: 'Invalid format of "date" in article meta data'
        }); 
    }

    // Check for existing
    const duplicateUrlCheck = await ArticleModel.count({
        where: {
            id: {
                [Op.ne]: req.body.id
            },
            url: data.url
        }
    });
    if(duplicateUrlCheck > 0){
        return res.status(400).json({
            error: 'Another article with that URL exists. Please pick another URL.'
        });
    }

    // Update DB
    try{
        await ArticleModel.update({
            title: data.title,
            content: req.body.content,
            url: data.url,
            published: convertBool(data.published),
            category: data.category,
            pinned: data.pinned,
            publishedDate: data.publishedDate
        }, {
            where: {
                id: req.body.id
            }
        });

        // Get updated article
        const updatedArticle = await ArticleModel.findOne({
            where: {
                id: req.body.id
            }
        });
        return res.json(updatedArticle);
    }catch(ex){
        return res.status(400).json({
            error: 'Unable to save data'
        });
    }
});

router.delete('/api/article/delete/:id', restrict, async (req, res) => {
    // Check permissions
    if(req.user.admin !== true){
        return res.status(401).json({
            error: 'Access denied'
        });
    }

    // Check for article
    const article = await ArticleModel.findOne({
        where: {
            id: req.params.id
        },
        raw: true
    });
    if(!article){
        return res.status(400).json({
            error: 'Article not found'
        });
    }

    // Run DB query
    try{
        await ArticleModel.destroy({
            where: {
                id: req.params.id
            }
        });
        return res.json('success');
    }catch(ex){
        return res.status(400).json({
            error: 'Unable to delete article'
        });
    }
});

router.post('/api/file/upload', restrict, async(req, res) => {
    try{
        const file = req.files.image;
        if(!file) {
            res.status(400).send({
                message: 'No file uploaded'
            });
        }
        const allowedTypes = [
            'image/jpeg',
            'image/png',
            'image/jpg',
            'image/gif',
            'image/bmp'
        ];
        if(!allowedTypes.includes(file.mimetype)){
            res.status(400).send({
                message: 'File type not supported'
            });
        }

        // Move the file
        try{
            const uploads = path.join(__dirname, '..', '..', 'ui', 'public', 'uploads');
            const fileName = file.name.replace(/\s+/g, '-');
            const filePath = path.join(uploads, fileName);
            let urlPath = `/files/${fileName}`;
            if(process.env.NODE_ENV !== 'production'){
                urlPath = `${process.env.BASE_API_URL}/files/${fileName}`
            }
            fs.renameSync(file.tempFilePath, filePath);
            fs.chmodSync(filePath, 0o755);

            res.status(200).send({
                hash: file.md5,
                name: fileName,
                url: urlPath
            });
        }catch(ex){
            console.log('Moving uploaded file failed', ex);
            return res.status(400).send({
                message: 'File upload unsuccessful'
            });
        }
    }catch(ex){
        console.log('File upload failed', ex);
        return res.status(400).send({
            message: 'File upload unsuccessful'
        });
    }
});

module.exports = router;
