const { getUserSession } = require('../../../../lib/auth');
const prisma = require('../../../../lib/prisma');
const { validateMatter, convertBool } = require('../../../../lib/data');

export default async function handler(req, res) {
    if (req.method !== 'PUT') {
        res.status(405).send({ message: 'Only PUT requests allowed' });
        return;
    }

    // Check user session
    const session = await getUserSession(req, res);
    if (!session || !session.user) {
        res.status(401).json({ message: 'Access denied' });
        return;
    }

    // Parse body if needed
    if (typeof req.body === 'string') {
        req.body = JSON.parse(req.body);
    }

    // Check for content
    if (!req.body.content) {
        return res.status(400).json({
            error: 'Missing or invalid content supplied.',
        });
    }

    // Validate post matter
    const parsedMatter = validateMatter(req.body.content);

    // If validation error, return error
    if (parsedMatter.matterError) {
        return res.status(400).json({
            error: parsedMatter.matterError,
        });
    }

    // Setup data
    const data = {};
    data.title = parsedMatter.data.title;
    data.url = parsedMatter.data.url;
    data.published = convertBool(parsedMatter.data.published);
    data.category = parsedMatter.data.category
        ? parsedMatter.data.category
        : 'General';
    data.pinned = convertBool(parsedMatter.data.pinned);
    data.content = req.body.content;
    data.views = 0;
    try {
        data.publishedDate = new Date(parsedMatter.data.date).toISOString();
    } catch (ex) {
        return res.status(400).json({
            error: 'Invalid format of "date" in article meta data',
        });
    }

    // Check for existing
    const duplicateUrlCheck = await prisma.articles.count({
        where: {
            url: data.url,
        },
    });
    if (duplicateUrlCheck > 0) {
        return res.status(400).json({
            error: 'Another article with that URL exists. Please pick another URL.',
        });
    }

    // Insert into DB
    try {
        const article = await prisma.articles.create({
            data: {
                url: data.url,
                title: data.title,
                content: data.content,
                published: convertBool(data.published),
                category: data.category,
                publishedDate: data.publishedDate,
                views: data.views,
                pinned: false,
            },
        });

        return res.json({
            articleId: article.id,
        });
    } catch (ex) {
        return res.status(400).json({
            error: 'Unable to save data',
        });
    }
}
