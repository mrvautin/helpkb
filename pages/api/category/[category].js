import { db } from '../../../lib/db';
import { Op } from 'sequelize';

// DB models
import { CategoryModel } from '../../../lib/models/categories';
import { ArticleModel } from '../../../lib/models/articles';

export default async function handler(req, res) {
    const categoryParam = req.query.category;
    // Get category
    const category = await CategoryModel.findOne({
        where: {
            url: categoryParam
        },
        raw: true
    });

    if(!category){
        return res.status(404).json({
            error: '404 - Not found'
        });
    }

    // Run DB query
    const articles = await ArticleModel.findAll({
        where: {
            [Op.and]: [
                { published: true },
                db().where(
                    db().fn('lower', db().col('category')), 
                    db().fn('lower', category.name),
                )
            ]
        },
        order: [
            [ 'pinned', 'DESC' ],
            [ 'publishedDate', 'DESC' ]
        ],
        raw: true
    });

    // Return category articles
    return res.json({
        articles,
        category
    });
};
