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

    // Check for category
    try {
        const category = await prisma.categories.findFirst({
            where: {
                id: req.query.id,
            },
        });
        if (!category) {
            return res.status(400).json({
                error: 'Category not found',
            });
        }
    } catch (ex) {
        return res.status(400).json({
            error: 'Category not found',
        });
    }

    // Remove the category
    const categoryDelete = await prisma.categories.delete({
        where: {
            id: req.query.id,
        },
    });

    // Get the updated categories
    const categories = await prisma.categories.findMany({
        orderBy: {
            order: 'asc',
        },
    });

    // Update the order
    for (var i = 0; i < categories.length; i++) {
        const newOrder = i + 1;
        await prisma.categories.update({
            where: {
                id: categories[i].id,
            },
            data: {
                order: newOrder,
            },
        });
    }

    // Respond
    if (categoryDelete) {
        return res.json('success');
    }
    console.log('in here ex', categoryDelete);
    return res.status(400).json({
        error: 'Unable to delete category',
    });
}
