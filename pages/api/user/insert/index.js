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

    // Check for existing user
    const duplicateUserCheck = await prisma.users.count({
        where: {
            email: req.body.email,
        },
    });
    if (duplicateUserCheck > 0) {
        return res.status(400).json({
            error: 'Another user with that email exists. Please pick a different email address.',
        });
    }

    // Insert into DB
    try {
        await prisma.users.create({
            data: {
                name: req.body.name,
                email: req.body.email,
                enabled: true,
                admin: false,
                owner: false,
            },
        });
        return res.json('success');
    } catch (ex) {
        return res.status(400).json({
            error: 'Unable to create user',
        });
    }
}
