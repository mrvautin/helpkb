import { getServerSideSitemapIndexLegacy } from 'next-sitemap';
const prisma = require('../../lib/prisma');

export const getServerSideProps = async ctx => {
    const pages = [];
    const baseUrl = process.env.HOST_NAME;

    // Get our articles from the DB
    const articles = await prisma.articles.findMany({
        where: {
            published: true,
        },
    });
    articles.forEach(article => {
        pages.push(`${baseUrl}/article/${article.url}`);
    });

    // Get our categories from the DB
    const categories = await prisma.categories.findMany();
    categories.forEach(category => {
        pages.push(`${baseUrl}/category/${category.url}`);
    });

    // Add other pages
    pages.push(`${baseUrl}/`);

    return getServerSideSitemapIndexLegacy(ctx, pages);
};

// eslint-disable-next-line @typescript-eslint/no-empty-function
export default function SitemapIndex() {}
