const prisma = require('../../../lib/prisma');

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        res.status(405).send({ message: 'Only GET requests allowed' });
        return;
    }
    // Get the menu from the db
    const menu = await prisma.menus.findMany({
        orderBy: {
            order: 'asc',
        },
    });

    if (!menu) {
        return res.status(404).json({
            error: '404 - Not found',
        });
    }

    // Return menu
    res.json(menu);
}
