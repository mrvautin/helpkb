const prisma = require('../../../lib/prisma');

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        res.status(405).send({ message: 'Only GET requests allowed' });
        return;
    }

    const categoryParam = req.query.category;

    // Check for category param
    if (!categoryParam) {
        return res.status(404).json({
            error: '404 - Not found',
        });
    }

    // Get category
    const category = await prisma.categories.findFirst({
        where: {
            url: categoryParam,
        },
    });

    if (!category) {
        return res.status(404).json({
            error: '404 - Not found',
        });
    }

    // Run DB query
    const articles = await prisma.articles.findMany({
        where: {
            published: true,
            category: {
                equals: category.name,
                mode: 'insensitive',
            },
        },
        orderBy: [{ pinned: 'desc' }, { publishedDate: 'desc' }],
    });

    // Return category articles
    return res.json({
        articles,
        category,
    });
}
