const { getUserSession } = require('../../../../lib/auth');
const prisma = require('../../../../lib/prisma');
const { checkDeletePermissions } = require('../../../../lib/auth');

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

    // Get user in current state
    const userBefore = await prisma.users.findFirst({
        where: {
            id: req.query.id,
        },
    });

    // Check if user exists
    if (!userBefore) {
        res.status(400).json({ error: 'User not found' });
        return;
    }

    // Check if user has permission
    const permissions = checkDeletePermissions(session.user, userBefore);
    if (!permissions.allowed) {
        return res.status(401).json({
            error: permissions.message,
        });
    }

    // Run DB query
    const user = await prisma.users.delete({
        where: {
            id: req.query.id,
        },
    });

    if (Object.keys(user).length > 0) {
        return res.json('success');
    }
    return res.status(400).json({
        error: 'Unable to delete user',
    });
}
