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

test('[POST] Test fake login', async t => {
    const email = g.testData.users[0].email;
    const res = await login(email);
    t.deepEqual(res.email, email);
});

test('[GET] Test secured route with login', async t => {
    const user = g.testData.users[0].email;
    await login(user);

    const res = await g.request
        .get(`/api/users`)
        .expect(200);

    t.deepEqual(res.body.length > 0, true);
});

test('[GET] Test secured route without login', async t => {
    const res = await g.request
        .get(`/api/users`)
        .expect(401);

    t.deepEqual(res.body.message, 'Access denied');
});

test('[GET] Test logon with enabled set to false', async t => {
    const email = g.testData.users[3].email;
    const res = await login(email);
    t.deepEqual(res.message, 'Access denied');
});