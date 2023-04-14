// DB models
import { ArticleModel } from '../../../../lib/models/articles';

export default async function handler(req, res) {
    // Run DB query
    const article = await ArticleModel.findOne({
        where: {
            id: req.query.id
        }
    });

    // Check for article found and return 404 if not
    if(!article){
        return res.json({
            error: '404 - Not found'
        });
    }

    // Return article data
    res.json(article);
};
