const { setupData } = require('../setup/data');
const supertest = require('supertest');

// Setup some global DB objects for comparison
const g = {
    request: null,
    testData: null
};

const login = async (email) => {
    const res = await g.request
        .post(`/mock/api/auth/github`)
        .send({email})

    return res.body;
};

const logout = async () => {
    const res = await g.request
        .get(`/api/logout`)
        .expect(200);

    return res.body;
};

const runBefore = async () => {
    const app = require('../app');
    g.request = supertest.agent(app);
    await new Promise(resolve => {
        app.on('appStarted', () => {
            resolve();
        });
    });
};

module.exports = {
    runBefore,
    setupData,
    g,
    login,
    logout
};
