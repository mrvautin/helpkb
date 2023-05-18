const express = require('express');
const router = express.Router();
const prisma = require('../lib/prisma');

router.post('/mock/api/auth/github', async(req, res) => {
    // Check for user
    const user = await prisma.users.findFirst({
        where: {
            email: req.body.email,
            enabled: true
        }
    });

    // If found, return user
    if(user && user.email){
        // Set the session
        req.session.userId = user.id;
        req.session.userEmail = user.email;

        req.user = user;

        // return the user
        res.json(user);
        return;
    }
    return res.status(400).json({
        message: 'Access denied'
    });
});

module.exports = router;
