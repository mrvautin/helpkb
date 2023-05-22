const prisma = require('../../../lib/prisma');

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        res.status(405).send({ message: 'Only GET requests allowed' });
        return;
    }

    // Run DB query
    const searchParam = req.query.param.toLowerCase();

    const articles = await prisma.articles.findMany({
        where: {
            OR: [
                {
                    title: {
                        search: searchParam,
                    },
                },
                {
                    content: {
                        search: searchParam,
                    },
                },
            ],
            published: true,
        },
        orderBy: {
            publishedDate: 'desc',
        },
    });

    // Return search data
    return res.json(articles);
}
