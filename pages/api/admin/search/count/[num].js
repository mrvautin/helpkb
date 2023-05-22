const prisma = require('../../../../../lib/prisma');

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        res.status(405).send({ message: 'Only GET requests allowed' });
        return;
    }

    // Run DB query
    const articles = await prisma.articles.findMany({
        orderBy: [{ pinned: 'desc' }, { publishedDate: 'desc' }],
        take: parseInt(req.query.num),
    });

    // Return search data
    return res.json(articles);
}
