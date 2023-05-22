import { testApiHandler } from 'next-test-api-route-handler';
import getArticle from '../../pages/api/article/[article]';
import getArticleEdit from '../../pages/api/article/edit/[id]';
import deleteArticle from '../../pages/api/article/delete/[id]';
import insertArticle from '../../pages/api/article/insert/index';
import updateArticle from '../../pages/api/article/save/index';
import type { PageConfig } from 'next';
import { setupData, generateContentString } from '../data';

let testData;
beforeEach(async () => {
    testData = await setupData();
});

it('Get article', async () => {
    const handler: typeof getArticle & { config?: PageConfig } = getArticle;
    await testApiHandler({
        handler,
        paramsPatcher: (params) => (params.article = testData.articles[0].url),
        test: async ({ fetch }) => {
            const res = await fetch({ method: 'GET' });
            const data = await res.json();
            expect(res.status).toEqual(200);
            expect(data.id).toEqual(testData.articles[0].id);
        },
    });
});

it('Get article Edit', async () => {
    const handler: typeof getArticleEdit & { config?: PageConfig } = getArticleEdit;
    await testApiHandler({
        handler,
        paramsPatcher: (params) => (params.id = testData.articles[0].id),
        test: async ({ fetch }) => {
            const res = await fetch({ method: 'GET' });
            const data = await res.json();
            expect(res.status).toEqual(200);
            expect(data.id).toEqual(testData.articles[0].id);
        },
    });
});

it('Delete article', async () => {
    const handler: typeof deleteArticle & { config?: PageConfig } = deleteArticle;
    await testApiHandler({
        handler,
        paramsPatcher: (params) => (params.id = testData.articles[0].id),
        test: async ({ fetch }) => {
            const res = await fetch({ method: 'DELETE' });
            const data = await res.json();
            expect(res.status).toEqual(200);
            expect(data).toEqual('success');
        },
    });
});

it('Delete non-existent article', async () => {
    const handler: typeof deleteArticle & { config?: PageConfig } = deleteArticle;
    await testApiHandler({
        handler,
        paramsPatcher: (params) => (params.id = '22836c92-a665-48f7-93c1-15600d719e04'),
        test: async ({ fetch }) => {
            const res = await fetch({ method: 'DELETE' });
            const data = await res.json();
            expect(res.status).toEqual(400);
            expect(data.error).toEqual('Article not found');
        },
    });
});

it('Insert Article', async () => {
    const handler: typeof insertArticle & { config?: PageConfig } = insertArticle;

    let newArticle = {
        url: 'a-new-article-url',
        title: 'A new article title',
        description: 'Hello world SEO description',
        content: 'Hello world SEO description',
        published: true,
        category: 'General',
        pinned: false
    };
    newArticle.content = generateContentString(newArticle);

    await testApiHandler({
        handler,
        test: async ({ fetch }) => {
            const res = await fetch({ method: 'PUT', body: JSON.stringify(newArticle) });
            const data = await res.json();
            expect(res.status).toEqual(200);
            expect(data).toHaveProperty('articleId');
        },
    });
});

it('Insert Article duplicate URL', async () => {
    const handler: typeof insertArticle & { config?: PageConfig } = insertArticle;

    let newArticle = {
        url: 'test-article',
        title: 'Test Article',
        description: 'Hello world SEO description',
        content: 'Hello world SEO description',
        published: true,
        category: 'General',
        pinned: false
    };
    newArticle.content = generateContentString(newArticle);

    await testApiHandler({
        handler,
        test: async ({ fetch }) => {
            const res = await fetch({ method: 'PUT', body: JSON.stringify(newArticle) });
            const data = await res.json();
            expect(res.status).toEqual(400);
            expect(data.error).toEqual('Another article with that URL exists. Please pick another URL.');
        },
    });
});

it('Insert Article missing content', async () => {
    const handler: typeof insertArticle & { config?: PageConfig } = insertArticle;

    let newArticle = {
        url: 'a-new-article-url',
        title: 'A new article title',
        description: 'Hello world SEO description',
        published: true,
        pinned: false
    };

    await testApiHandler({
        handler,
        test: async ({ fetch }) => {
            const res = await fetch({ method: 'PUT', body: JSON.stringify(newArticle) });
            const data = await res.json();
            expect(res.status).toEqual(400);
            expect(data.error).toEqual('Missing or invalid content supplied.');
        },
    });
});

it('Insert Article Invalid content', async () => {
    const handler: typeof insertArticle & { config?: PageConfig } = insertArticle;

    let newArticle = {
        url: 'a-new-article-url',
        title: 'A new article title',
        description: 'Hello world SEO description',
        content: 'This is invalid content matter',
        published: true,
        pinned: false
    };

    await testApiHandler({
        handler,
        test: async ({ fetch }) => {
            const res = await fetch({ method: 'PUT', body: JSON.stringify(newArticle) });
            const data = await res.json();
            expect(res.status).toEqual(400);
            expect(data.error).toEqual('Parameter "title" missing from matter. Check "title" is set correctly');
        },
    });
});

it('Update Article', async () => {
    const handler: typeof updateArticle & { config?: PageConfig } = updateArticle;

    let newArticleValues = {
        id: testData.articles[0].id,
        url: 'a-new-url-value',
        title: 'A new title',
        description: 'New description',
        content: '',
        published: true,
        category: 'General',
        pinned: false
    };
    newArticleValues.content = generateContentString(newArticleValues);

    await testApiHandler({
        handler,
        test: async ({ fetch }) => {
            const res = await fetch({ method: 'PUT', body: JSON.stringify(newArticleValues) });
            const data = await res.json();
            expect(res.status).toEqual(200);
            expect(data.id).toEqual(newArticleValues.id);
            expect(data.url).toEqual(newArticleValues.url);
            expect(data.title).toEqual(newArticleValues.title);
        },
    });
});

it('Update Article missing content', async () => {
    const handler: typeof updateArticle & { config?: PageConfig } = updateArticle;

    let newArticle = {
        url: 'a-new-article-url',
        title: 'A new article title',
        description: 'Hello world SEO description',
        published: true,
        pinned: false
    };

    await testApiHandler({
        handler,
        test: async ({ fetch }) => {
            const res = await fetch({ method: 'PUT', body: JSON.stringify(newArticle) });
            const data = await res.json();
            expect(res.status).toEqual(400);
            expect(data.error).toEqual('Missing or invalid content supplied.');
        },
    });
});

it('Update Article Invalid content', async () => {
    const handler: typeof updateArticle & { config?: PageConfig } = updateArticle;

    let newArticle = {
        url: 'a-new-article-url',
        title: 'A new article title',
        description: 'Hello world SEO description',
        content: 'This is invalid content matter',
        published: true,
        pinned: false
    };

    await testApiHandler({
        handler,
        test: async ({ fetch }) => {
            const res = await fetch({ method: 'PUT', body: JSON.stringify(newArticle) });
            const data = await res.json();
            expect(res.status).toEqual(400);
            expect(data.error).toEqual('Parameter "title" missing from matter. Check "title" is set correctly');
        },
    });
});