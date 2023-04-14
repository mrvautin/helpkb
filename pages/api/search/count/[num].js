// DB models
import { ArticleModel } from '../../../../lib/models/articles';

export default async function handler(req, res) {
    let limit = parseInt(req.query.num);
    if(limit > process.env.ARTICLE_LIMIT_RETURNED || 20){
        limit = process.env.ARTICLE_LIMIT_RETURNED || 20;
    }

    // Run DB query
    const articles = await ArticleModel.findAll({
        where: {
            published: true
        },
        order: [
            [ 'pinned', 'DESC' ],
            [ 'publishedDate', 'DESC' ]
        ],
        limit: limit,
        raw: true
    });

    // Return search data
    return res.json(articles);
};
