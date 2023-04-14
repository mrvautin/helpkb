import { convertBool } from '../../../lib/data';

// DB models
import { SettingModel } from '../../../lib/models/settings';

export default async function handler(req, res) {
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
};
