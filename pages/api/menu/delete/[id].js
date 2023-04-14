// DB models
import { MenuModel } from '../../../lib/models/menus';

export default async function handler(req, res) {
    // Check for menu
    const menu = await MenuModel.findOne({
        where: {
            id: req.params.id
        },
        raw: true
    });
    if(!menu){
        return res.status(400).json({
            error: 'Menu not found'
        });
    }

    // Remove the menu
    const menuDelete = await MenuModel.destroy({
        where: {
            id: req.params.id
        }
    });

    // Get the updated menu
    const menusUpdated = await MenuModel.findAll({
        order: [
            [ 'order', 'DESC' ]
        ],
        raw: true
    });

    // Update the order
    for (var i = 0; i < menusUpdated.length; i++) {
        const newOrder = i + 1;
        await MenuModel.update({ order: newOrder }, {
            where: {
                id: menusUpdated[i].id
            }
        });
    }

    if(menuDelete > 0){
        return res.json('success');
    }else{
        return res.status(400).json({
            error: 'Unable to delete menu'
        });
    }
};
