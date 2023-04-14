// DB models
import { ArticleModel } from '../../../../lib/models/articles';

export default async function handler(req, res) {
    // Run DB query
    const articles = await ArticleModel.findAll({
        order: [
            [ 'pinned', 'DESC' ],
            [ 'publishedDate', 'DESC' ]
        ],
        limit: parseInt(req.query.num)
    });

    // Return search data
    return res.json(articles);
};
