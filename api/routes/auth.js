const express = require('express');
const qs = require('qs');
const axios = require('axios');
const prisma = require('../lib/prisma');
const router = express.Router();

router.get('/api/session', (req, res) => {
    // Check for session
    if(!req.user){
        res.status(200).send({error: 'No valid session'});
        return;
    }
    res.status(200).send(req.user);
    return;
});

router.get('/api/logout', async (req, res) => {
    try{
        await req.session.destroy();
    }catch(ex){}
    delete req.user;
    res.status(200).send({message: 'No valid session'})
});

// Get the github access token
router.get('/api/auth/github/authenticate/:code', async (req, res) => {
    const code = req.params.code;
    const oauth = {
        tokenUrl: 'https://github.com/login/oauth/access_token',
        clientId: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_SECRET,
        redirectUri: `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/auth/github`
    };
    const payload = qs.stringify({
        code,
        client_id: oauth.clientId,
        client_secret: oauth.clientSecret,
        grant_type: 'authorization_code',
        scope: 'read:user'
    });
    const resp = await axios.post(oauth.tokenUrl, payload, { headers: { 'content-type': 'application/x-www-form-urlencoded;charset=utf-8' } });
    const respData = qs.parse(resp.data);
    return res.json({
        token: respData.access_token
    });
});

// Valdiate github access token
router.post('/api/auth/github', async (req, res) => {
    const githubtoken = req.body.token;
    const githubUser = await axios.get('https://api.github.com/user', { headers: { Authorization: `token ${githubtoken}` }});
    const githubUserData =  githubUser.data;

    // Check for user
    const user = await prisma.users.findFirst({
        where: {
            email: githubUserData.email,
            enabled: true
        }
    });

    // If found, return user
    if(user && user.email){
        // Set the session
        req.session.userId = user.id;
        req.session.userEmail = user.email;

        // return the user
        return res.json(user);
    }

    // Check if admin exists
    const admin = await prisma.users.findFirst({
        where: {
            admin: true
        }
    });

    // If admin exists, return error as user unrecognised
    if(admin === true){
        return res.status(200).json({
            error: 'denied'
        });
    }else{
        // No admin exists, insert new admin user
        await prisma.users.create({
            data: {
                email: githubUserData.email,
                name: githubUserData.name,
                enabled: true,
                admin: true,
                owner: true
            }
        });
        req.session.userEmail = githubUserData.email;
        return res.json({
            id: id,
            name: githubUserData.name,
            email: githubUserData.email,
            enabled: true,
            admin: true,
            owner: true
        })
    }
});

module.exports = router;
