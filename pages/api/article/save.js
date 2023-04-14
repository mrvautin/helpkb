import { validateMatter, convertBool } from '../../../lib/data';
import { Op } from 'sequelize';

// DB models
import { ArticleModel } from '../../../lib/models/articles';

export default async function handler(req, res) {
    // Validate post matter
    const parsedMatter = validateMatter(req.body.content);
    
    // If validation error, return error
    if(parsedMatter.matterError){
        return res.status(400).json({
            error: parsedMatter.matterError
        }); 
    }

    // Setup data
    const data = {};
    data.title = parsedMatter.data.title;
    data.url = parsedMatter.data.url;
    data.published = convertBool(parsedMatter.data.published);
    data.category = parsedMatter.data.category ? parsedMatter.data.category : 'General';
    data.pinned = convertBool(parsedMatter.data.pinned);
    try{
        data.publishedDate = new Date(parsedMatter.data.date).toISOString();
    }catch(ex){
        return res.status(400).json({
            error: 'Invalid format of "date" in article meta data'
        }); 
    }

    // Check for existing
    const duplicateUrlCheck = await ArticleModel.count({
        where: {
            id: {
                [Op.ne]: req.body.id
            },
            url: data.url
        }
    });
    if(duplicateUrlCheck > 0){
        return res.status(400).json({
            error: 'Another article with that URL exists. Please pick another URL.'
        });
    }

    // Update DB
    try{
        await ArticleModel.update({
            title: data.title,
            content: req.body.content,
            url: data.url,
            published: convertBool(data.published),
            category: data.category,
            pinned: data.pinned,
            publishedDate: data.publishedDate
        }, {
            where: {
                id: req.body.id
            }
        });

        // Get updated article
        const updatedArticle = await ArticleModel.findOne({
            where: {
                id: req.body.id
            }
        });
        return res.json(updatedArticle);
    }catch(ex){
        return res.status(400).json({
            error: 'Unable to save data'
        });
    }
}
