const {
    getUserSession,
    checkUpdatePermissions,
} = require('../../../../lib/auth');
const prisma = require('../../../../lib/prisma');
const { convertBool } = require('../../../../lib/data');

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

    // Check required fields
    const requiredFields = ['id', 'email', 'name', 'enabled', 'admin'];
    for (const requiredField of requiredFields) {
        if (typeof req.body[requiredField] === 'undefined') {
            return res.status(400).json({
                error: `Missing required field: ${requiredField}`,
            });
        }
    }

    // Check for existing user
    const duplicateUserCheck = await prisma.users.count({
        where: {
            NOT: {
                id: req.body.id,
            },
            email: req.body.email,
        },
    });
    if (duplicateUserCheck.duplicateCount > 0) {
        return res.status(400).json({
            error: 'Another user with that email exists. Please pick a different email address.',
        });
    }

    // Proposed changes
    const proposedUser = {
        name: req.body.name,
        email: req.body.email,
        enabled: convertBool(req.body.enabled),
        admin: convertBool(req.body.admin),
    };

    // Get user in current state
    const userBefore = await prisma.users.findFirst({
        where: {
            id: req.body.id,
        },
    });

    // Check if user has permission
    const permissions = checkUpdatePermissions(
        session.user,
        userBefore,
        proposedUser,
    );
    if (!permissions.allowed) {
        return res.status(401).json({
            error: permissions.message,
        });
    }

    console.log('body', req.body);
    console.log('test', convertBool(req.body.enabled));

    // Update DB
    try {
        await prisma.users.update({
            data: {
                name: req.body.name,
                email: req.body.email,
                enabled: convertBool(req.body.enabled),
                admin: convertBool(req.body.admin),
            },
            where: {
                id: req.body.id,
            },
        });

        const userAfter = await prisma.users.findFirst({
            where: {
                id: req.body.id,
            },
        });
        return res.json(userAfter);
    } catch (ex) {
        return res.status(400).json({
            error: 'Unable to save user',
        });
    }
}
