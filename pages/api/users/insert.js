const { v4: uuidv4 } = require('uuid');

// DB models
import { UserModel } from '../../../lib/models/users';

export default async function handler(req, res) {
    // Check for existing user
    const duplicateUserCheck = await UserModel.count({
        where: {
            email: req.body.email
        }
    });
    if(duplicateUserCheck > 0){
        return res.status(400).json({
            error: 'Another user with that email exists. Please pick a different email address.'
        });
    }

    // Insert into DB
    const id = uuidv4();
    try{
        await UserModel.create({
            id: id,
            name: req.body.name,
            email: req.body.email,
            enabled: true,
            admin: false,
            owner: false
        });
        return res.json('success');
    }catch(ex){
        return res.status(400).json({
            error: 'Unable to create user'
        });
    }
}
