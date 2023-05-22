import { testApiHandler } from 'next-test-api-route-handler';
import getMenus from '../../pages/api/menu/index';
import deleteMenu from '../../pages/api/menu/delete/[id]';
import insertMenu from '../../pages/api/menu/insert/index';
import type { PageConfig } from 'next';
import { setupData } from '../data';

let testData;
beforeEach(async () => {
    testData = await setupData();
});

it('Get Menus', async () => {
    const handler: typeof getMenus & { config?: PageConfig } = getMenus;
    await testApiHandler({
        handler,
        test: async ({ fetch }) => {
            const res = await fetch({ method: 'GET' });
            const data = await res.json();
            expect(data.length).toBeGreaterThan(0);
            expect(res.status).toEqual(200);
            expect(data[0].id).toEqual(testData.menu[0].id);
        },
    });
});

it('Delete Menu', async () => {
    const handler: typeof deleteMenu & { config?: PageConfig } = deleteMenu;
    await testApiHandler({
        handler,
        paramsPatcher: params => (params.id = testData.menu[0].id),
        test: async ({ fetch }) => {
            const res = await fetch({ method: 'DELETE' });
            const data = await res.json();
            expect(res.status).toEqual(200);
            expect(data).toEqual('success');
        },
    });
});

it('Delete non-existent Menu', async () => {
    const handler: typeof deleteMenu & { config?: PageConfig } = deleteMenu;
    await testApiHandler({
        handler,
        paramsPatcher: params =>
            (params.id = '22836c92-a665-48f7-93c1-15600d719e04'),
        test: async ({ fetch }) => {
            const res = await fetch({ method: 'DELETE' });
            const data = await res.json();
            expect(res.status).toEqual(400);
            expect(data.error).toEqual('Menu not found');
        },
    });
});

it('Insert Menu', async () => {
    const handler: typeof insertMenu & { config?: PageConfig } = insertMenu;

    const newMenu = {
        name: 'New menu name',
        url: 'https://example.com/new-menu',
    };
    await testApiHandler({
        handler,
        test: async ({ fetch }) => {
            const res = await fetch({
                method: 'PUT',
                body: JSON.stringify(newMenu),
            });
            const data = await res.json();
            expect(res.status).toEqual(200);
            expect(data).toEqual('success');
        },
    });
});

it('Insert Duplicate Menu Name', async () => {
    const handler: typeof insertMenu & { config?: PageConfig } = insertMenu;

    const newMenu = {
        name: 'Google',
        url: 'https://example.com/some-new-menu',
    };
    await testApiHandler({
        handler,
        test: async ({ fetch }) => {
            const res = await fetch({
                method: 'PUT',
                body: JSON.stringify(newMenu),
            });
            const data = await res.json();
            expect(res.status).toEqual(400);
            expect(data.error).toEqual(
                'Another menu with that name or Url exists. Please pick a different name or Url.',
            );
        },
    });
});

it('Insert Duplicate Menu Url', async () => {
    const handler: typeof insertMenu & { config?: PageConfig } = insertMenu;

    const newMenu = {
        name: 'New menu name',
        url: 'https://google.com',
    };
    await testApiHandler({
        handler,
        test: async ({ fetch }) => {
            const res = await fetch({
                method: 'PUT',
                body: JSON.stringify(newMenu),
            });
            const data = await res.json();
            expect(res.status).toEqual(400);
            expect(data.error).toEqual(
                'Another menu with that name or Url exists. Please pick a different name or Url.',
            );
        },
    });
});
