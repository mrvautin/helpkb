import { getServerSession } from 'next-auth/next';
import { authOptions } from './auth/[...nextauth]';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        res.status(405).send({ message: 'Only GET requests allowed' });
        return;
    }

    const session = await getServerSession(req, res, authOptions);
    if (!session) {
        return res.status(200).send({
            error: 'No valid session',
        });
    }
    res.status(200).send(session);
}
