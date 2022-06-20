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

test('[POST] Delete a user as an owner', async t => {
    const user = g.testData.users[0].email;
    await login(user);

    const res = await g.request
        .delete(`/api/user/delete/${g.testData.users[1].id}`)
        .expect(200);

    t.deepEqual(res.body, 'success');
});

test('[POST] Delete an owner', async t => {
    const user = g.testData.users[1].email;
    await login(user);

    const res = await g.request
        .delete(`/api/user/delete/${g.testData.users[0].id}`)
        .expect(401);

    t.deepEqual(res.body.error, 'Access denied');
});

test('[POST] Delete an admin as an admin', async t => {
    const user = g.testData.users[1].email;
    await login(user);

    const res = await g.request
        .delete(`/api/user/delete/${g.testData.users[3].id}`)
        .expect(401);

    t.deepEqual(res.body.error, 'Access denied');
});

test('[POST] Delete a regular user as a non admin', async t => {
    const user = g.testData.users[2].email;
    await login(user);

    const res = await g.request
        .delete(`/api/user/delete/${g.testData.users[3].id}`)
        .expect(401);

    t.deepEqual(res.body.error, 'Access denied');
});

test('[POST] Delete a regular user as an admin', async t => {
    const user = g.testData.users[1].email;
    await login(user);

    const res = await g.request
        .delete(`/api/user/delete/${g.testData.users[2].id}`)
        .expect(200);

    t.deepEqual(res.body, 'success');
});

test('[PUT] Update a regular user as an admin', async t => {
    const user = g.testData.users[0].email;
    await login(user);

    const newName = 'Test Name';
    const res = await g.request
        .put(`/api/user/save`)
        .send({
            id: g.testData.users[2].id,
            email: g.testData.users[2].email,
            name: newName,
            enabled: true,
            admin: true
        })
        .expect(200);

    t.deepEqual(res.body.id, g.testData.users[2].id);
    t.deepEqual(res.body.name, newName);
});

test('[put] Downgrade a admin user as an admin', async t => {
    const user = g.testData.users[1].email;
    await login(user);

    const res = await g.request
        .put(`/api/user/save`)
        .send({
            id: g.testData.users[3].id,
            email: g.testData.users[3].email,
            name: g.testData.users[3].name,
            enabled: g.testData.users[3].enabled,
            admin: false
        })
        .expect(401);

    t.deepEqual(res.body.error, 'Only owner can remove admin flag.');
});

test('[put] Downgrade a admin user as an owner', async t => {
    const user = g.testData.users[0].email;
    await login(user);

    const res = await g.request
        .put(`/api/user/save`)
        .send({
            id: g.testData.users[1].id,
            email: g.testData.users[1].email,
            name: g.testData.users[1].name,
            enabled: g.testData.users[1].enabled,
            admin: false
        })
        .expect(200);

    t.deepEqual(res.body.id, g.testData.users[1].id);
    t.deepEqual(res.body.admin, false);
});
