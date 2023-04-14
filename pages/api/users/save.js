import { Op } from 'sequelize';

// DB models
import { UserModel } from '../../../lib/models/users';

export default async function handler(req, res) {
    // Check required fields
    const requiredFields = [
        'id',
        'email',
        'name',
        'enabled',
        'admin',
    ];
    for(const requiredField of requiredFields){
        if(typeof req.body[requiredField] === undefined){
            return res.status(400).json({
                error: `Missing required field: ${requiredField}`
            });
        }
    }

    // Check for existing user
    const duplicateUserCheck = await UserModel.count({
        where: {
            id: {
                [Op.ne]: req.body.id
            },
            email: req.body.email
        }
    });
    if(duplicateUserCheck.duplicateCount > 0){
        return res.status(400).json({
            error: 'Another user with that email exists. Please pick a different email address.'
        });
    }

    // Proposed changes
    const proposedUser = {
        name: req.body.name,
        email: req.body.email,
        enabled: convertBool(req.body.enabled),
        admin: convertBool(req.body.admin)
    };

    // Get user in current state
    const userBefore = await UserModel.findOne({
        where: {
            id: req.body.id
        },
        raw: true
    });

    // Check if user has permission
    const permissions = checkUpdatePermissions(req.user, userBefore, proposedUser);
    if(!permissions.allowed){
        return res.status(401).json({
            error: permissions.message
        });
    }

    // Update DB
    try{
        await UserModel.update({
            name: req.body.name,
            email: req.body.email,
            enabled: convertBool(req.body.enabled),
            admin: convertBool(req.body.admin)
        }, {
            where: {
                id: req.body.id
            },
            returning: true
        });

        const userAfter = await UserModel.findOne({
            where: {
                id: req.body.id
            },
            raw: true
        });
        return res.json(userAfter);
    }catch(ex){
        return res.status(400).json({
            error: 'Unable to save user'
        });
    }
}
