import { v4 as uuidv4 } from 'uuid';
import { validateMatter, convertBool } from '../../../lib/data';

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
    data.content = req.body.content;
    data.views = 0;
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
            url: data.url
        }
    });
    if(duplicateUrlCheck > 0){
        return res.status(400).json({
            error: 'Another article with that URL exists. Please pick another URL.'
        });
    }

    // Insert into DB
    try{
        const id = uuidv4();
        await ArticleModel.create({
            id: id,
            url: data.url,
            title: data.title,
            content: data.content,
            published: convertBool(data.published),
            category: data.category,
            publishedDate: data.publishedDate,
            views: data.views
        });
        return res.json({
            articleId: id
        });
    }catch(ex){
        return res.status(400).json({
            error: 'Unable to save data'
        });
    }
}
