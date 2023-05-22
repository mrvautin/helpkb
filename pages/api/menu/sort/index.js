const { getUserSession } = require('../../../../lib/auth');
const prisma = require('../../../../lib/prisma');

export default async function handler(req, res) {
    if (req.method !== 'PUT') {
        res.status(405).send({ message: 'Only PUT requests allowed' });
        return;
    }

    // Check user session
    const session = await getUserSession(req, res);
    if (!session || !session.user) {
        res.status(401).json({ message: 'Access denied' });
        return;
    }

    // Update the order
    for (var i = 0; i < req.body.length; i++) {
        const newOrder = i + 1;
        await prisma.menus.update({
            where: {
                id: req.body[i].id,
            },
            data: {
                order: newOrder,
            },
        });
    }

    // Return response
    res.json('success');
}
