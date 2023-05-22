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

    // Check for menu
    try {
        const menu = await prisma.menus.findFirst({
            where: {
                id: req.query.id,
            },
        });
        if (!menu) {
            return res.status(400).json({
                error: 'Menu not found',
            });
        }
    } catch (ex) {
        return res.status(400).json({
            error: 'Menu not found',
        });
    }

    // Remove the menu
    const menuDelete = await prisma.menus.delete({
        where: {
            id: req.query.id,
        },
    });

    // Get the updated menu
    const menusUpdated = await prisma.menus.findMany({
        orderBy: [{ order: 'desc' }],
    });

    // Update the order
    for (var i = 0; i < menusUpdated.length; i++) {
        const newOrder = i + 1;
        await prisma.menus.update({
            where: {
                id: menusUpdated[i].id,
            },
            data: {
                order: newOrder,
            },
        });
    }

    if (menuDelete) {
        return res.json('success');
    }
    return res.status(400).json({
        error: 'Unable to delete menu',
    });
}
