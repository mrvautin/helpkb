import { v4 as uuidv4 } from 'uuid';
import { Op } from 'sequelize';

// DB models
import { CategoryModel } from '../../../lib/models/categories';

export default async function handler(req, res) {
    // Check for existing category
    const duplicateCategoryCheck = await CategoryModel.count({
        where: {
            [Op.or]: {
                name: req.body.name,
                url: req.body.url
            }
        }
    });
    if(duplicateCategoryCheck > 0){
        return res.status(400).json({
            error: 'Another category with that name or Url exists. Please pick a different name or Url.'
        });
    }

    // Get existing
    const categories = await CategoryModel.findAll({
        order: [
            [ 'order', 'ASC' ]
        ],
        raw: true
    });

    const order = categories.length + 1;

    // Insert into DB
    const id = uuidv4();
    try{
        await CategoryModel.create({
            id: id,
            name: req.body.name,
            url: req.body.url,
            enabled: true,
            order: order
        });
        return res.json('success');
    }catch(ex){
        console.log('ex', ex);
        return res.status(400).json({
            error: 'Unable to create category'
        });
    }
};