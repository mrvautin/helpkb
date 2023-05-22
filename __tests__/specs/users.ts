import { testApiHandler } from 'next-test-api-route-handler';
import getUsers from '../../pages/api/users/index';
import insertUser from '../../pages/api/user/insert/index';
import deleteUser from '../../pages/api/user/delete/[id]';
import type { PageConfig } from 'next';
import { setupData } from '../data';
import _ from 'lodash';

let testData;
beforeEach(async () => {
    testData = await setupData();
});

it('Get Users', async () => {
    const handler: typeof getUsers & { config?: PageConfig } = getUsers;
    await testApiHandler({
        handler,
        test: async ({ fetch }) => {
            const res = await fetch({ method: 'GET' });
            const data = await res.json();
            const userId = testData.users[0].id;
            const user = _.find(data, { id: userId });
            expect(res.status).toEqual(200);
            expect(data.length).toBeGreaterThan(0);
            expect(user.id).toEqual(userId);
            expect(data[0]).toHaveProperty('id');
        },
    });
});

it('Delete User', async () => {
    const handler: typeof deleteUser & { config?: PageConfig } = deleteUser;
    await testApiHandler({
        handler,
        paramsPatcher: params => (params.id = testData.users[0].id),
        test: async ({ fetch }) => {
            const res = await fetch({ method: 'DELETE' });
            const data = await res.json();
            expect(res.status).toEqual(200);
            expect(data).toEqual('success');
        },
    });
});

it('Delete non-existent User', async () => {
    const handler: typeof deleteUser & { config?: PageConfig } = deleteUser;
    await testApiHandler({
        handler,
        paramsPatcher: params =>
            (params.id = '22836c92-a665-48f7-93c1-15600d719e04'),
        test: async ({ fetch }) => {
            const res = await fetch({ method: 'DELETE' });
            const data = await res.json();
            expect(res.status).toEqual(400);
            expect(data.error).toEqual('User not found');
        },
    });
});

it('Insert User', async () => {
    const handler: typeof insertUser & { config?: PageConfig } = insertUser;

    const newUser = {
        email: 'timmy.jones@outlook.com',
        name: 'Timmy Jones',
        enabled: true,
        admin: false,
        owner: false,
    };

    await testApiHandler({
        handler,
        test: async ({ fetch }) => {
            const res = await fetch({
                method: 'PUT',
                body: JSON.stringify(newUser),
            });
            const data = await res.json();
            expect(res.status).toEqual(200);
            expect(data).toEqual('success');
        },
    });
});

it('Insert Duplicate user', async () => {
    const handler: typeof insertUser & { config?: PageConfig } = insertUser;

    const newUser = {
        email: 'owner@test.com',
        name: 'Jim Smith',
        enabled: true,
        admin: false,
        owner: false,
    };
    await testApiHandler({
        handler,
        test: async ({ fetch }) => {
            const res = await fetch({
                method: 'PUT',
                body: JSON.stringify(newUser),
            });
            const data = await res.json();
            expect(res.status).toEqual(400);
            expect(data.error).toEqual(
                'Another user with that email exists. Please pick a different email address.',
            );
        },
    });
});

it('Update user', async () => {
    const handler: typeof insertUser & { config?: PageConfig } = insertUser;

    const newUser = {
        email: 'owner@test.com',
        name: 'Jim Smith',
        enabled: true,
        admin: false,
        owner: false,
    };
    await testApiHandler({
        handler,
        test: async ({ fetch }) => {
            const res = await fetch({
                method: 'PUT',
                body: JSON.stringify(newUser),
            });
            const data = await res.json();
            expect(res.status).toEqual(400);
            expect(data.error).toEqual(
                'Another user with that email exists. Please pick a different email address.',
            );
        },
    });
});
