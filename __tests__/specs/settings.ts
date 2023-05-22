import { testApiHandler } from 'next-test-api-route-handler';
import getSettings from '../../pages/api/settings';
import saveSettings from '../../pages/api/settings/save';
import type { PageConfig } from 'next';
import { setupData } from '../data';

beforeEach(async () => {
    await setupData();
});

it('Get Settings', async () => {
    const handler: typeof getSettings & { config?: PageConfig } = getSettings;
    await testApiHandler({
        handler,
        test: async ({ fetch }) => {
            const res = await fetch({ method: 'GET' });
            const data = await res.json();
            expect(res.status).toEqual(200);
            expect(data).toHaveProperty('id');
            expect(data).toHaveProperty('websiteName');
            expect(data).toHaveProperty('websiteDescription');
        },
    });
});

it('Save settings', async () => {
    const handler: typeof saveSettings & { config?: PageConfig } = saveSettings;

    const updatedSettings = {
        websiteName: 'supportMe',
        websiteDescription: 'updated website desc',
        welcomeMessage: 'Welcome to supportMe!',
        searchPlaceholder: 'Search supportMe...',
        baseUrl: 'http://localhost:3000',
        dateFormat: 'dd/MM/yyyy',
        showArticleDetails: true,
        indexType: 'categories',
    };

    await testApiHandler({
        handler,
        test: async ({ fetch }) => {
            const res = await fetch({
                method: 'PUT',
                body: JSON.stringify(updatedSettings),
            });
            const data = await res.json();
            expect(res.status).toEqual(200);
            expect(data).toHaveProperty('id');
            expect(data.websiteName).toEqual(updatedSettings.websiteName);
            expect(data.websiteDescription).toEqual(
                updatedSettings.websiteDescription,
            );
            expect(data.welcomeMessage).toEqual(updatedSettings.welcomeMessage);
            expect(data.searchPlaceholder).toEqual(
                updatedSettings.searchPlaceholder,
            );
        },
    });
});
