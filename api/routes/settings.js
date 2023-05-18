const express = require('express');
const { restrict } = require('../lib/auth');
const { convertBool } = require('../lib/data');
const prisma = require('../lib/prisma');
const router = express.Router();

router.get('/api/settings', async (req, res) => {
    // Run DB query
    const settings = await prisma.settings.findFirst();

    // Check for settings
    if(!settings){
        return res.json({
            error: '404 - Not found'
        });
    }

    // Add user email
    if(req.user){
        settings.userEmail = req.user.email;
    }

    // Return settings
    return res.json(settings);
});

router.put('/api/settings/save', restrict, async(req, res) => {
    const settings = await prisma.settings.findFirst();

    // Update the db
    const settingsUpdated = await prisma.settings.update({
        data: {
            websiteName: req.body.websiteName,
            websiteDescription: req.body.websiteDescription,
            welcomeMessage: req.body.welcomeMessage,
            searchPlaceholder: req.body.websitsearchPlaceholdereName,
            baseUrl: req.body.baseUrl,
            dateFormat: req.body.dateFormat || 'dd/MM/yyyy',
            showArticleDetails: convertBool(req.body.showArticleDetails),
            indexType: req.body.indexType || 'recent'
        },
        where: {
            id: settings.id
        }
    });

    // Return settings
    return res.status(200).send(settingsUpdated);
});

module.exports = router;
