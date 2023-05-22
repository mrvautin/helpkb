const prisma = require('../../lib/prisma');

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        res.status(405).send({ message: 'Only GET requests allowed' });
        return;
    }

    // Get the categories from the db
    const categories =
        await prisma.$queryRaw`SELECT count(articles.id)::int as count, categories.name, categories.url, categories.id, categories.order
    FROM categories
    LEFT JOIN articles 
    ON categories.name = articles.category 
    GROUP BY categories.name, categories.id, categories.order, categories.url
    ORDER BY categories.order`;

    if (!categories) {
        return res.status(404).json({
            error: '404 - Not found',
        });
    }

    // Return categories
    res.json(categories);
}
