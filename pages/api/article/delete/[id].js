// DB models
import { ArticleModel } from '../../../../lib/models/articles';

export default async function handler(req, res) {
    // Check permissions
    if(req.user.admin !== true){
        return res.status(401).json({
            error: 'Access denied'
        });
    }

    // Check for article
    const article = await ArticleModel.findOne({
        where: {
            id: req.params.id
        },
        raw: true
    });
    if(!article){
        return res.status(400).json({
            error: 'Article not found'
        });
    }

    // Run DB query
    try{
        await ArticleModel.destroy({
            where: {
                id: req.params.id
            }
        });
        return res.json('success');
    }catch(ex){
        return res.status(400).json({
            error: 'Unable to delete article'
        });
    }
};
