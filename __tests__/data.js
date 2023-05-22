const fs = require('fs');
const path = require('path');
const prisma = require('../lib/prisma');
const data = require('./setup/test-data.json');

const generateContentString = (data) => {
    let articleContent = fs.readFileSync(
        path.join(__dirname, 'setup', 'articlecontent.md'),
        'utf-8',
    );
    articleContent = articleContent.replace(
        /^title:.*$/gm,
        `title: ${data.title}`,
    );
    articleContent = articleContent.replace(
        /^url:.*$/gm,
        `url: ${data.url}`,
    );
    articleContent = articleContent.replace(
        /^description:.*$/gm,
        `description: ${data.description}`,
    );
    articleContent = articleContent.replace(
        /^category:.*$/gm,
        `category: ${data.category}`,
    );
    return articleContent;
}

const setupData = async () => {
    if (process.env.NODE_ENV === 'test') {
        // Delete data
        await prisma.settings.deleteMany({});
        await prisma.users.deleteMany({});
        await prisma.articles.deleteMany({});
        await prisma.categories.deleteMany({});
        await prisma.menus.deleteMany({});

        // Insert settings
        await prisma.settings.create({
            data: data.settingsData,
        });

        // Insert Users
        for (const user of data.usersData) {
            await prisma.users.create({
                data: {
                    email: user.email,
                    name: user.name,
                    enabled: user.enabled,
                    admin: user.admin,
                    owner: user.owner,
                },
            });
        }

        // Insert Categories
        let categoryOrder = 1;
        for (const category of data.categoriesData) {
            await prisma.categories.create({
                data: {
                    name: category.name,
                    url: category.url,
                    order: categoryOrder,
                    enabled: category.enabled,
                },
            });
            categoryOrder++;
        }

        // Insert Menu
        let menuOrder = 1;
        for (const menu of data.menuData) {
            await prisma.menus.create({
                data: {
                    name: menu.name,
                    url: menu.url,
                    order: menuOrder,
                },
            });
            menuOrder++;
        }

        // Insert Articles
        for (const article of data.articlesData) {
            let articleContent = fs.readFileSync(
                path.join(__dirname, 'setup', 'articlecontent.md'),
                'utf-8',
            );
            articleContent = articleContent.replace(
                /^title:.*$/gm,
                `title: ${article.title}`,
            );
            articleContent = articleContent.replace(
                /^url:.*$/gm,
                `url: ${article.url}`,
            );
            articleContent = articleContent.replace(
                /^description:.*$/gm,
                `description: ${article.description}`,
            );
            articleContent = articleContent.replace(
                /^category:.*$/gm,
                `category: ${article.category}`,
            );

            // Run DB query
            await prisma.articles.create({
                data: {
                    url: article.url,
                    title: article.title,
                    content: articleContent,
                    category: article.category,
                    published: article.published,
                    publishedDate: new Date().toISOString(),
                    pinned: article.pinned,
                    views: article.views,
                },
            });
        }

        // Get our data
        data.settings = await prisma.settings.findFirst();
        data.users = await prisma.users.findMany();
        data.articles = await prisma.articles.findMany();
        data.categories = await prisma.categories.findMany();
        data.menu = await prisma.menus.findMany();
    }

    if (process.env.NODE_ENV !== 'test') {
        console.log('Test data complete');
    }

    return data;
};

module.exports = {
    setupData,
    generateContentString
};
