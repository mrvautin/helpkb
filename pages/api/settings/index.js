// DB models
import { SettingModel } from '../../../lib/models/settings';

export default async function handler(req, res) {
    // Run DB query
    const settings = await SettingModel.findOne({
        where: {
            id: 1
        },
        raw: true
    });

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
}
