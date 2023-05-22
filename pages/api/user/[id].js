const { getUserSession } = require('../../../lib/auth');
const prisma = require('../../../lib/prisma');

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        res.status(405).send({ message: 'Only GET requests allowed' });
        return;
    }

    // Check user session
    const session = await getUserSession(req, res);
    if (!session || !session.user) {
        res.status(401).json({ message: 'Access denied' });
        return;
    }

    // Run DB query
    const user = await prisma.users.findFirst({
        where: {
            id: req.query.id,
        },
    });

    // Return search data
    return res.json(user);
}
