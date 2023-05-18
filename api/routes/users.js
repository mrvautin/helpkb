const express = require('express');
const { restrict } = require('../lib/auth');
const { convertBool } = require('../lib/data');
const prisma = require('../lib/prisma');
const { checkUpdatePermissions, checkDeletePermissions } = require('../lib/auth');
const router = express.Router();

router.get('/api/users', restrict, async(req, res) => {
    // Run DB query
    const users = await prisma.users.findMany({
        orderBy: [
            { created_at: 'desc' }
        ]
    });

    // Return search data
    return res.json(users);
});

router.get('/api/user/:id', restrict, async(req, res) => {
    // Run DB query
    const user = await prisma.users.findFirst({
        where: {
            id: req.params.id
        }
    });

    // Return search data
    return res.json(user);
});

router.put('/api/user/save', restrict, async(req, res) => {
    // Check required fields
    const requiredFields = [
        'id',
        'email',
        'name',
        'enabled',
        'admin',
    ];
    for(const requiredField of requiredFields){
        if(typeof req.body[requiredField] === undefined){
            return res.status(400).json({
                error: `Missing required field: ${requiredField}`
            });
        }
    }

    // Check for existing user
    const duplicateUserCheck = await prisma.users.count({
        where: {
            NOT: {
                id: req.body.id
            },
            email: req.body.email
        }
    });
    if(duplicateUserCheck.duplicateCount > 0){
        return res.status(400).json({
            error: 'Another user with that email exists. Please pick a different email address.'
        });
    }

    // Proposed changes
    const proposedUser = {
        name: req.body.name,
        email: req.body.email,
        enabled: convertBool(req.body.enabled),
        admin: convertBool(req.body.admin)
    };

    // Get user in current state
    const userBefore = await prisma.users.findFirst({
        where: {
            id: req.body.id
        }
    });

    // Check if user has permission
    const permissions = checkUpdatePermissions(req.user, userBefore, proposedUser);
    if(!permissions.allowed){
        return res.status(401).json({
            error: permissions.message
        });
    }

    // Update DB
    try{
        await prisma.users.update({
            data: {
                name: req.body.name,
                email: req.body.email,
                enabled: convertBool(req.body.enabled),
                admin: convertBool(req.body.admin)
            },
            where: {
                id: req.body.id
            }
        });

        const userAfter = await prisma.users.findFirst({
            where: {
                id: req.body.id
            }
        });
        return res.json(userAfter);
    }catch(ex){
        return res.status(400).json({
            error: 'Unable to save user'
        });
    }
});

router.put('/api/user/insert', restrict, async (req, res) => {
    // Check for existing user
    const duplicateUserCheck = await prisma.users.count({
        where: {
            email: req.body.email
        }
    });
    if(duplicateUserCheck > 0){
        return res.status(400).json({
            error: 'Another user with that email exists. Please pick a different email address.'
        });
    }

    // Insert into DB
    try{
        await prisma.users.create({
            data: {
                name: req.body.name,
                email: req.body.email,
                enabled: true,
                admin: false,
                owner: false
            }
        });
        return res.json('success');
    }catch(ex){
        return res.status(400).json({
            error: 'Unable to create user'
        });
    }
});

router.delete('/api/user/delete/:id', restrict, async (req, res) => {
    // Get user in current state
    const userBefore = await prisma.users.findFirst({
        where: {
            id: req.params.id
        }
    });

    // Check if user has permission
    const permissions = checkDeletePermissions(req.user, userBefore);
    if(!permissions.allowed){
        return res.status(401).json({
            error: permissions.message
        });
    }

    // Run DB query
    const user = await prisma.users.delete({
        where: {
            id: req.params.id
        }
    });

    if(Object.keys(user).length > 0){
        return res.json('success');
    }else{
        return res.status(400).json({
            error: 'Unable to delete user'
        });
    }
});

module.exports = router;
