const prisma = require('../../../lib/prisma');

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        res.status(405).send({ message: 'Only GET requests allowed' });
        return;
    }

    // Run DB query
    const article = await prisma.articles.findFirst({
        where: {
            url: req.query.article,
            published: true,
        },
    });

    // Check if article found and return 404 if not
    if (!article) {
        return res.status(404).json({
            error: '404 - Not found',
        });
    }

    // Update view count if not logged in
    let viewCount = article.views !== null ? article.views : 0;
    viewCount++;
    await prisma.articles.update({
        where: {
            id: article.id,
        },
        data: {
            views: viewCount,
        },
    });

    // Return article data
    return res.json(article);
}
