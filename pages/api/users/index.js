// DB models
import { UserModel } from '../../../lib/models/users';

export default async function handler(req, res) {
    // Run DB query
    const users = await UserModel.findAll({
        order: [
            [ 'createdAt', 'DESC' ]
        ],
        raw: true
    });

    // Return search data
    return res.json(users);
}
