const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const Sequelize = require('sequelize');
const dbConfig = require('../dbConfig');

const setupData = async() => {
    // DB models
    const UserModel = require('../models/users');
    const ArticleModel = require('../models/articles');
    const CategoryModel = require('../models/categories');
    const MenuModel = require('../models/menus');
    const SettingModel = require('../models/settings');

    let data = JSON.parse(fs.readFileSync(path.join(__dirname, 'test-data.json'), 'utf-8'));
    try{
        // Startup DB
        const config = dbConfig.get();
        const db = new Sequelize(
            process.env.DB_NAME,
            process.env.DB_USERNAME,
            process.env.DB_PASSWORD,
            config
        );
        
        // Connect
        await db.authenticate();

        // Setup DB models
        let dbForce = false;
        if(process.env.NODE_ENV === 'test'){
            dbForce = true;
        }
        await UserModel.sync({ alter: true, force: dbForce });
        await ArticleModel.sync({ alter: true, force: dbForce });
        await CategoryModel.sync({ alter: true, force: dbForce });
        await MenuModel.sync({ alter: true, force: dbForce });
        await SettingModel.sync({ alter: true, force: dbForce });
    }catch(ex){
        console.log('EX setting up test data', ex);
        process.exit(2);
    }

    if(process.env.NODE_ENV === 'test'){
        // Delete data
        await UserModel.destroy({truncate: true});
        await ArticleModel.destroy({truncate: true});
        await CategoryModel.destroy({truncate: true});
        await MenuModel.destroy({truncate: true});

        // Insert Users
        for(const user of data.usersData){
            const id = uuidv4();
            await UserModel.create({
                id: id,
                email: user.email,
                name: user.name,
                enabled: user.enabled,
                admin: user.admin,
                owner: user.owner
            });
        };

        // Insert Categories
        let categoryOrder = 1;
        for(const category of data.categoriesData){
            const id = uuidv4();
            await CategoryModel.create({
                id: id,
                name: category.name,
                url: category.url,
                order: categoryOrder,
                enabled: category.enabled
            });
            categoryOrder++;
        };

        // Insert Menu
        let menuOrder = 1;
        for(const menu of data.menuData){
            const id = uuidv4();
            await MenuModel.create({
                id: id,
                name: menu.name,
                url: menu.url,
                order: menuOrder
            });
            menuOrder++;
        };

        // Insert Articles
        for(const article of data.articlesData){
            let articleContent = fs.readFileSync(path.join(__dirname, 'articlecontent.md'), 'utf-8');
            articleContent = articleContent.replace(/^title:.*$/gm, `title: ${article.title}`);
            articleContent = articleContent.replace(/^url:.*$/gm, `url: ${article.url}`);
            articleContent = articleContent.replace(/^description:.*$/gm, `description: ${article.description}`);
            articleContent = articleContent.replace(/^category:.*$/gm, `category: ${article.category}`);

            // Run DB query
            const id = uuidv4();
            await ArticleModel.create({
                id,
                url: article.url,
                title: article.title,
                content: articleContent,
                category: article.category,
                published: article.published,
                publishedDate: new Date().toISOString()
            });
        };

        // Get our data
        data.users = await UserModel.findAll({ raw: true });
        data.articles = await ArticleModel.findAll({ raw: true });
        data.categories = await CategoryModel.findAll({ raw: true });
        data.menu = await MenuModel.findAll({ raw: true });
    }

    if(process.env.NODE_ENV !== 'test'){
        console.log('Test data complete');
    }

    return data;
};

module.exports = {
    setupData
};