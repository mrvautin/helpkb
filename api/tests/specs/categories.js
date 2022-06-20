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

test('[GET] Get category', async t => {
    const category = g.testData.categories[0];
    const res = await g.request
        .get(`/api/category/${category.url}`)
        .expect(200);

    t.deepEqual(res.body[0].category, category.name);
});

test('[DELETE] Delete a category', async t => {
    const user = g.testData.users[0].email;
    await login(user);

    const res = await g.request
        .delete(`/api/category/delete/${g.testData.categories[0].id}`)
        .expect(200);
    
    t.deepEqual(res.body, 'success');
});

test('[PUT] Insert a category', async t => {
    const user = g.testData.users[0].email;
    await login(user);

    const res = await g.request
        .put(`/api/category/insert`)
        .send({
            name: 'New category',
            url: 'new-category',
            enabled: true
        })
        .expect(200);

    t.deepEqual(res.body, 'success');
});

test('[DELETE] Delete a non existent category', async t => {
    const user = g.testData.users[0].email;
    await login(user);

    const res = await g.request
        .delete(`/api/category/delete/invalid-category-id`)
        .expect(400);

    t.deepEqual(res.body.error, 'Category not found');
});

test('[GET] Aggregate categories', async t => {
    const user = g.testData.users[0].email;
    await login(user);

    const res = await g.request
        .get(`/api/categories`)
        .expect(200);

    t.deepEqual(res.body.length > 0, true);
});