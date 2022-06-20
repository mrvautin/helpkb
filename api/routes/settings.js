const express = require('express');
const { restrict } = require('../lib/auth');
const { convertBool } = require('../lib/data');
const router = express.Router();

// DB models
const SettingModel = require('../models/settings');


router.get('/api/settings', async (req, res) => {
    // Run DB query
    const settings = await SettingModel.findOne({
        where: {
            id: 1
        }
    });

    // Check for settings
    if(!settings){
        return res.json({
            error: '404 - Not found'
        });
    }

    // Return settings
    return res.json(settings);
});

router.put('/api/settings/save', restrict, async(req, res) => {
    // Update the db
    await SettingModel.update({
        websiteName: req.body.websiteName,
        websiteDescription: req.body.websiteDescription,
        welcomeMessage: req.body.welcomeMessage,
        searchPlaceholder: req.body.websitsearchPlaceholdereName,
        baseUrl: req.body.baseUrl,
        dateFormat: req.body.dateFormat || 'dd/MM/yyyy',
        showArticleDetails: convertBool(req.body.showArticleDetails),
        indexType: req.body.indexType || 'recent'
    }, {
        where: {
            id: 1
        }
    });

    // Get new settings
    const settings = await SettingModel.findOne({
        where: {
            id: 1
        }
    });

    // Return settings
    return res.status(200).send(settings);
});

module.exports = router;
