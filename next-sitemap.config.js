/** @type {import('next-sitemap').IConfig} */
const prisma = require('./lib/prisma');

module.exports = {
    siteUrl: process.env.HOST_NAME,
    exclude: [
        '/login',
        '/admin/dashboard',
        '/admin/categories',
        '/admin/menu',
        '/admin/new',
        '/admin/settings',
        '/admin/users',
    ],
    additionalPaths: async () => {
        const pages = [];

        // Get our articles from the DB
        const articles = await prisma.articles.findMany({
            where: {
                published: true,
            },
        });
        articles.forEach(article => {
            pages.push({ loc: `/article/${article.url}` });
        });

        // Get our categories from the DB
        const categories = await prisma.categories.findMany();
        categories.forEach(category => {
            pages.push({ loc: `/category/${category.url}` });
        });
        return pages;
    },
};
