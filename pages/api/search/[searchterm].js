import { db } from '../../../lib/db';
import { Op } from 'sequelize';

// DB models
import { ArticleModel } from '../../../lib/models/articles';

export default async function handler(req, res) {
    // Run DB query
    const searchTerm = req.query.searchterm.toLowerCase();
    const articles = await ArticleModel.findAll({
        where: {
            [Op.or]: {
                title: db().where(db().fn('LOWER', db().col('title')), 'LIKE', `%${searchTerm}%`),
                content: db().where(db().fn('LOWER', db().col('content')), 'LIKE', `%${searchTerm}%`)
            },
            published: true
        },
        order: [
            [ 'publishedDate', 'DESC' ]
        ],
        limit: 10,
        raw: true
    });

    // Return search data
    return res.json(articles);
};
