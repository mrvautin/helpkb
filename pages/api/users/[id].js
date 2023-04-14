// DB models
import { UserModel } from '../../../lib/models/users';

export default async function handler(req, res) {
   // Run DB query
   const user = await UserModel.findOne({
        where: {
            id: req.query.id
        },
        raw: true
    });

    // Return search data
    return res.json(user);
}
