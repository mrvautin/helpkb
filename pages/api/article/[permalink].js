// DB models
import { ArticleModel } from '../../../lib/models/articles';

export default async function handler(req, res) {
    // Run DB query
    const article = await ArticleModel.findOne({
        where: {
            url: req.query.permalink,
            published: true
        },
        raw: true
    });

    // Check if article found and return 404 if not
    if(!article){
        return res.status(404).json({
            error: '404 - Not found'
        });
    }

    // Update view count if not logged in
    if(!req.user){
        let viewCount = article.views !== null ? article.views : 0;
        viewCount++;
        await ArticleModel.update({ views: viewCount }, {
            where: {
                id: article.id
            }
        });
    }

    // Return article data
    return res.json(article);
};
