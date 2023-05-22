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

    // Parse body if needed
    if (typeof req.body === 'string') {
        req.body = JSON.parse(req.body);
    }

    // Check for existing menu
    const duplicateMenuCheck = await prisma.menus.count({
        where: {
            OR: [
                {
                    name: req.body.name,
                },
                {
                    url: req.body.url,
                },
            ],
        },
    });

    if (duplicateMenuCheck > 0) {
        return res.status(400).json({
            error: 'Another menu with that name or Url exists. Please pick a different name or Url.',
        });
    }

    // Get existing
    const menu = await prisma.menus.findMany({
        orderBy: {
            order: 'asc',
        },
    });

    const order = menu.length + 1;

    // Insert into DB
    try {
        await prisma.menus.create({
            data: {
                name: req.body.name,
                url: req.body.url,
                order: order,
            },
        });
        return res.json('success');
    } catch (ex) {
        console.log('ex', ex);
        return res.status(400).json({
            error: 'Unable to create menu',
        });
    }
}
