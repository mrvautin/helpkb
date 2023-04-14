const {
    serial: test
} = require('ava');
const {
    runBefore,
    setupData,
    g,
    login,
    logout
} = require('../helper');

test.before(async () => {
    await runBefore();
});

test.beforeEach(async() => {
    g.testData = await setupData();
    await logout();
});

test('[GET] Get article', async t => {
    const article = g.testData.articles[0];
    const res = await g.request
        .get(`/api/article/${article.url}`)
        .expect(200);

    t.deepEqual(res.body.url, article.url);
    t.deepEqual(res.body.title, article.title);
    t.deepEqual(res.body.published, article.published);
});

test('[GET] Try get unpublished article', async t => {
    const article = g.testData.articles[2];
    const res = await g.request
        .get(`/api/article/${article.url}`)
        .expect(404);

    t.deepEqual(res.status, 404);
});

test('[GET] Search for article', async t => {
    const res = await g.request
        .get(`/api/search/test`)
        .expect(200);

    res.body.forEach((result) =>{
        t.deepEqual(
            result.title.toLowerCase().includes('test') ||
            result.content.toLowerCase().includes('test')
            , true
        );
    })
});

test('[GET] Search for article which is unpublished', async t => {
    const res = await g.request
        .get(`/api/search/unpublished`)
        .expect(200);
    t.deepEqual(res.body.length, 0);
});

test('[GET] Get recent 10 articles', async t => {
    const res = await g.request
        .get(`/api/search/count/10`)
        .expect(200);
    
    t.deepEqual(res.body.length > 0, true);
});

test('[DELETE] Delete an article as an owner user', async t => {
    const user = g.testData.users[0].email;
    await login(user);

    const res = await g.request
        .delete(`/api/article/delete/${g.testData.articles[0].id}`)
        .expect(200);
    
    t.deepEqual(res.body, 'success');
});

test('[DELETE] Delete an article as an admin user', async t => {
    const user = g.testData.users[1].email;
    await login(user);

    const res = await g.request
        .delete(`/api/article/delete/${g.testData.articles[0].id}`)
        .expect(200);
    
    t.deepEqual(res.body, 'success');
});

test('[DELETE] Delete an article as a regular user', async t => {
    const user = g.testData.users[2].email;
    await login(user);

    const res = await g.request
        .delete(`/api/article/delete/${g.testData.articles[0].id}`)
        .expect(401);

    t.deepEqual(res.body.error, 'Access denied');
});

test('[DELETE] Delete a non existent article', async t => {
    const user = g.testData.users[0].email;
    await login(user);

    const res = await g.request
        .delete(`/api/article/delete/invalid-article-id`)
        .expect(400);

    t.deepEqual(res.body.error, 'Article not found');
});

test('[PUT] Update an article', async t => {
    const user = g.testData.users[0].email;
    await login(user);

    const contentChangedTitle = g.testData.articles[0].content.replace(/^title:.*$/gm, `title: Changed title`);

    const res = await g.request
        .put(`/api/article/save`)
        .send({
            id: g.testData.articles[0].id,
            content: contentChangedTitle
        })
        .expect(200);

    t.deepEqual(res.body.title, 'Changed title');
});
