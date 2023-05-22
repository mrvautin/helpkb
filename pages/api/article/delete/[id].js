const { getUserSession } = require('../../../../lib/auth');
const prisma = require('../../../../lib/prisma');

export default async function handler(req, res) {
    if (req.method !== 'DELETE') {
        res.status(405).send({ message: 'Only DELETE requests allowed' });
        return;
    }

    // Check user session
    const session = await getUserSession(req, res);
    if (!session || !session.user) {
        res.status(401).json({ message: 'Access denied' });
        return;
    }

    // Check permissions
    if (session.user.admin !== true) {
        return res.status(401).json({
            error: 'Access denied',
        });
    }

    // Check for article
    try {
        const article = await prisma.articles.findFirst({
            where: {
                id: req.query.id,
            },
        });

        if (!article) {
            return res.status(400).json({
                error: 'Article not found',
            });
        }
    } catch (ex) {
        return res.status(400).json({
            error: 'Article not found',
        });
    }

    // Run DB query
    try {
        await prisma.articles.delete({
            where: {
                id: req.query.id,
            },
        });
        return res.json('success');
    } catch (ex) {
        return res.status(400).json({
            error: 'Unable to delete article',
        });
    }
}
