const express = require('express');
const { db } = require('../lib/db');
const dedent = require('dedent');
const { SitemapStream } = require('sitemap');
const { createGzip } = require('zlib');
const fs = require('fs');
const path = require('path');
const router = express.Router();

// DB models
const ArticleModel = require('../models/articles');
const CategoryModel = require('../models/categories');

router.get('/files/:imgname', (req, res) => {
    const imagePath = path.join(__dirname, '..', '..', 'ui', 'public', 'uploads', req.params.imgname);
    try{
        if (fs.existsSync(imagePath)) {
            res.sendFile(imagePath);
        }else{
            res.sendStatus(404);
        }
    }catch (err) {
        res.sendStatus(404);
    }
});

router.get('/robots.txt', (req, res) => {
    res.type('txt');

    const robots = `
    User-agent: Googlebot
    Disallow: /admin/
    Disallow: /_next/

    User-agent: *
    Allow: /

    Sitemap: ${process.env.BASE_URL}/sitemap.xml
    `
    return res.send(dedent(robots));
});

// Serve our sitemap
router.get('/sitemap.xml', async(req, res) => {
    res.header('Content-Type', 'application/xml');
    res.header('Content-Encoding', 'gzip');

    try{
        const smStream = new SitemapStream({ hostname: process.env.BASE_URL })
        const pipeline = smStream.pipe(createGzip())

        // Write the homepage
        smStream.write({ url: '', changefreq: 'daily', priority: 0.7 })

        // Get our articles from the DB
        const articles = await ArticleModel.findAll({
            where: {
                published: true
            }
        });

        // Loop articles and write the page
        articles.forEach((article) => {
            smStream.write({ url: `/article/${article.url}`, changefreq: 'daily', priority: 0.7 })
        });

        // Get categories from the db
        const categories = await CategoryModel.findAll({
            order: [
                [ 'order', 'ASC' ]
            ],
            raw: true
        });

        // Loop categories and add the URL
        categories.forEach((category) => {
            smStream.write({ url: `/category/${category.url}`, changefreq: 'daily', priority: 0.7 })
        });

        // End the stream
        smStream.end();
        // stream write the response
        pipeline.pipe(res).on('error', (e) => { throw e });
    }catch(e){
        console.error(e);
        return res.status(500).end();
    }
});

module.exports = router;
