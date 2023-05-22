const prisma = require('../../../lib/prisma');
const { convertBool } = require('../../../lib/data');
const { getUserSession } = require('../../../lib/auth');

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

    const settings = await prisma.settings.findFirst();

    // Update the db
    const settingsUpdated = await prisma.settings.update({
        data: {
            websiteName: req.body.websiteName,
            websiteDescription: req.body.websiteDescription,
            welcomeMessage: req.body.welcomeMessage,
            searchPlaceholder: req.body.searchPlaceholder,
            baseUrl: req.body.baseUrl,
            dateFormat: req.body.dateFormat || 'dd/MM/yyyy',
            showArticleDetails: convertBool(req.body.showArticleDetails),
            indexType: req.body.indexType || 'recent',
        },
        where: {
            id: settings.id,
        },
    });

    // Return settings
    return res.status(200).send(settingsUpdated);
}
