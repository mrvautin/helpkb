const prisma = require('../../lib/prisma');

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        res.status(405).send({ message: 'Only GET requests allowed' });
        return;
    }
    // Run DB query
    const settings = await prisma.settings.findFirst();

    // Check for settings
    if (!settings) {
        return res.json({
            error: '404 - Not found',
        });
    }

    // Add user email
    if (req.user) {
        settings.userEmail = req.user.email;
    }

    // Return settings
    return res.json(settings);
}
