import { createServer } from 'http';
// import { apiResolver } from 'next/dist/server/api-utils';
import { apiResolver } from 'next/dist/server/api-utils';
import supertest from 'supertest';

/**
 * @type {import("next").NextApiHandler} handler
 */
export function testClient(handler) {
    const serverRequestListener = async (req, res) => {
        return apiResolver(req, res, undefined, handler, {}, undefined);
    };

    const server = createServer(serverRequestListener);
    return supertest(server);
}
