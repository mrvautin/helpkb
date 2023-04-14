import { db } from '../../../lib/db';

export default async function handler(req, res) {
    // Get the categories from the db
    const [categories] = await db().query(
        `SELECT count(articles.id) as count, categories.name, categories.url, categories.id, categories.order
        FROM categories
        LEFT JOIN articles 
        ON categories.name = articles.category 
        GROUP BY categories.name, categories.id, categories.order, categories.url
        ORDER BY categories.order`
    );

    if(!categories){
        return res.status(404).json({
            error: '404 - Not found'
        });
    }

    // Return categories
    res.json(categories);
};
