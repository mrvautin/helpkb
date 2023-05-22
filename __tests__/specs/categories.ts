import { testApiHandler } from 'next-test-api-route-handler';
import getCategories from '../../pages/api/categories';
import getCategory from '../../pages/api/category/[category]';
import deleteCategory from '../../pages/api/category/delete/[id]';
import insertCategory from '../../pages/api/category/insert/index';
import type { PageConfig } from 'next';
import { setupData } from '../data';

let testData;
beforeEach(async () => {
    testData = await setupData();
});

it('Get categories', async () => {
    const handler: typeof getCategories & { config?: PageConfig } =
        getCategories;
    await testApiHandler({
        handler,
        test: async ({ fetch }) => {
            const res = await fetch({ method: 'GET' });
            const data = await res.json();
            expect(res.status).toEqual(200);
            expect(data.length).toBeGreaterThan(0);
        },
    });
});

it('Get single category', async () => {
    const handler: typeof getCategory & { config?: PageConfig } = getCategory;
    await testApiHandler({
        handler,
        paramsPatcher: params => (params.category = testData.categories[0].url),
        test: async ({ fetch }) => {
            const res = await fetch({ method: 'GET' });
            const data = await res.json();
            expect(res.status).toEqual(200);
            expect(data.category.id).toEqual(testData.categories[0].id);
        },
    });
});

it('Delete Category', async () => {
    const handler: typeof deleteCategory & { config?: PageConfig } =
        deleteCategory;
    await testApiHandler({
        handler,
        paramsPatcher: params => (params.id = testData.categories[0].id),
        test: async ({ fetch }) => {
            const res = await fetch({ method: 'DELETE' });
            const data = await res.json();
            expect(res.status).toEqual(200);
            expect(data).toEqual('success');
        },
    });
});

it('Delete non-existent Category', async () => {
    const handler: typeof deleteCategory & { config?: PageConfig } =
        deleteCategory;
    await testApiHandler({
        handler,
        paramsPatcher: params =>
            (params.id = '22836c92-a665-48f7-93c1-15600d719e04'),
        test: async ({ fetch }) => {
            const res = await fetch({ method: 'DELETE' });
            const data = await res.json();
            expect(res.status).toEqual(400);
            expect(data.error).toEqual('Category not found');
        },
    });
});

it('Insert Category', async () => {
    const handler: typeof insertCategory & { config?: PageConfig } =
        insertCategory;

    const newCategory = {
        name: 'New category name',
        url: 'new-category-name',
        enabled: true,
    };

    await testApiHandler({
        handler,
        test: async ({ fetch }) => {
            const res = await fetch({
                method: 'PUT',
                body: JSON.stringify(newCategory),
            });
            const data = await res.json();
            expect(res.status).toEqual(200);
            expect(data).toEqual('success');
        },
    });
});

it('Insert Duplicate Category Name', async () => {
    const handler: typeof insertCategory & { config?: PageConfig } =
        insertCategory;

    const newCategory = {
        name: 'General',
        url: 'some-new-url',
        enabled: true,
    };

    await testApiHandler({
        handler,
        test: async ({ fetch }) => {
            const res = await fetch({
                method: 'PUT',
                body: JSON.stringify(newCategory),
            });
            const data = await res.json();
            expect(res.status).toEqual(400);
            expect(data.error).toEqual(
                'Another category with that name or Url exists. Please pick a different name or Url.',
            );
        },
    });
});

it('Insert Duplicate Category Url', async () => {
    const handler: typeof insertCategory & { config?: PageConfig } =
        insertCategory;

    const newCategory = {
        name: 'Some new name',
        url: 'general',
        enabled: true,
    };

    await testApiHandler({
        handler,
        test: async ({ fetch }) => {
            const res = await fetch({
                method: 'PUT',
                body: JSON.stringify(newCategory),
            });
            const data = await res.json();
            expect(res.status).toEqual(400);
            expect(data.error).toEqual(
                'Another category with that name or Url exists. Please pick a different name or Url.',
            );
        },
    });
});
