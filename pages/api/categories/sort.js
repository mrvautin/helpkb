// DB models
const CategoryModel= require('../models/categories');

export default async function handler(req, res) {
    // Update the order
    for (var i = 0; i < req.body.length; i++) {
        const newOrder = i + 1;
        await CategoryModel.update({ order: newOrder }, {
            where: {
                id: req.body[i].id
            }
        });
    }

    // Return response
    res.json('success');
};
