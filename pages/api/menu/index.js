// DB models
import { MenuModel } from '../../../lib/models/menus';

export default async function handler(req, res) {
    // Get the menu from the db
    const menu = await MenuModel.findAll({
        order: [
            [ 'order', 'ASC' ]
        ],
        raw: true
    });

    if(!menu){
        return res.status(404).json({
            error: '404 - Not found'
        });
    }

    // Return menu
    res.json(menu);
};
