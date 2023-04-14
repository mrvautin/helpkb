// DB models
import { MenuModel } from '../../../lib/models/menus';

export default async function handler(req, res) {
    // Update the order
    for (var i = 0; i < req.body.length; i++) {
        const newOrder = i + 1;
        await MenuModel.update({ order: newOrder }, {
            where: {
                id: req.body[i].id
            }
        });
    }

    // Return response
    res.json('success');
};
