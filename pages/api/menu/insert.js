const { v4: uuidv4 } = require('uuid');
const { Op } = require('sequelize');
// DB models
import { MenuModel } from '../../../lib/models/menus';

export default async function handler(req, res) {
    // Check for existing menu
    const duplicateMenuCheck = await MenuModel.count({
        where: {
            [Op.or]: {
                name: req.body.name,
                url: req.body.url
            }
        }
    });

    if(duplicateMenuCheck > 0){
        return res.status(400).json({
            error: 'Another menu with that name or Url exists. Please pick a different name or Url.'
        });
    }

    // Get existing
    const menu = await MenuModel.findAll({
        order: [
            [ 'order', 'ASC' ]
        ],
        raw: true
    });

    const order = menu.length + 1;

    // Insert into DB
    const id = uuidv4();
    try{
        await MenuModel.create({
            id: id,
            name: req.body.name,
            url: req.body.url,
            order: order
        });
        return res.json('success');
    }catch(ex){
        console.log('ex', ex);
        return res.status(400).json({
            error: 'Unable to create menu'
        });
    }
};