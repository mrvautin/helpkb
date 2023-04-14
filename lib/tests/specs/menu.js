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

test('[DELETE] Delete a menu', async t => {
    const user = g.testData.users[0].email;
    await login(user);

    const res = await g.request
        .delete(`/api/menu/delete/${g.testData.menu[0].id}`)
        .expect(200);
    
    t.deepEqual(res.body, 'success');
});

test('[PUT] Insert a menu', async t => {
    const user = g.testData.users[0].email;
    await login(user);

    const res = await g.request
        .put(`/api/menu/insert`)
        .send({
            name: 'New menu',
            url: 'https://example.com'
        })
        .expect(200);

    t.deepEqual(res.body, 'success');
});

test('[DELETE] Delete a non existent menu', async t => {
    const user = g.testData.users[0].email;
    await login(user);

    const res = await g.request
        .delete(`/api/menu/delete/invalid-menu-id`)
        .expect(400);

    t.deepEqual(res.body.error, 'Menu not found');
});