const prisma = require('../../../../lib/prisma');

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        res.status(405).send({ message: 'Only GET requests allowed' });
        return;
    }

    let limit = parseInt(req.params.num);
    if (limit > process.env.ARTICLE_LIMIT_RETURNED) {
        limit = process.env.ARTICLE_LIMIT_RETURNED || 20;
    }

    // Run DB query
    const articles = await prisma.articles.findMany({
        where: {
            published: true,
        },
        take: parseInt(limit),
        orderBy: [{ pinned: 'desc' }, { publishedDate: 'desc' }],
    });

    // Return search data
    return res.json(articles);
}
