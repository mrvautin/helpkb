const axios = require('axios');
axios.defaults.withCredentials = true;
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../pages/api/auth/[...nextauth]';

const getUserSession = async (req, res) => {
    // Return fake session in test
    if (process.env.NODE_ENV === 'test') {
        return {
            user: {
                name: 'Jim Smith',
                email: 'hi@markmoffat.com',
                image: 'https://avatars.githubusercontent.com/u/299398?v=4',
                id: 'ae5f2373-4c26-43f4-8cc6-e6c2c18dfc2e',
                enabled: true,
                admin: true,
                owner: true,
                created_at: '2023-05-19T12:29:53.614Z',
            },
        };
    }
    // Get user session
    return await getServerSession(req, res, authOptions);
};

const checkUpdatePermissions = (currentUser, beforeUpdateUser, updatedUser) => {
    // Owner can do what they like.
    if (currentUser.owner === true) {
        return {
            allowed: true,
        };
    }

    // If current user is not an admin, can't do anything
    if (currentUser.admin !== true) {
        return {
            allowed: false,
            message: 'Access denied',
        };
    }

    // If current user is admin and updated user is being downgraded
    if (
        currentUser.admin === true &&
        beforeUpdateUser.admin === true &&
        updatedUser.admin !== true
    ) {
        return {
            allowed: false,
            message: 'Only owner can remove admin flag.',
        };
    }

    // If current user is admin and updated user is being disabled
    if (
        currentUser.admin === true &&
        beforeUpdateUser.admin === true &&
        updatedUser.enabled === false
    ) {
        return {
            allowed: false,
            message: 'Only owner can disable another admin.',
        };
    }

    // If current user is admin and trying to update an admins email address
    if (currentUser.admin === true && beforeUpdateUser.admin === true) {
        if (beforeUpdateUser.email !== updatedUser.email) {
            return {
                allowed: false,
                message: 'Only owner can change another admins email address.',
            };
        }
    }

    // Default
    return {
        allowed: false,
        message: 'Access denied',
    };
};

const checkDeletePermissions = (currentUser, beforeUpdateUser) => {
    // Owner can do what they like.
    if (currentUser.owner === true) {
        return {
            allowed: true,
        };
    }

    // Cannot can delete the owner
    if (beforeUpdateUser.owner === true) {
        return {
            allowed: false,
            message: 'Access denied',
        };
    }

    // If current user is not an admin, can't delete
    if (currentUser.admin !== true) {
        return {
            allowed: false,
            message: 'Access denied',
        };
    }

    // If both users are admins
    if (currentUser.admin === true && beforeUpdateUser.admin === true) {
        return {
            allowed: false,
            message: 'Access denied',
        };
    }

    // Default
    return {
        allowed: true,
    };
};

module.exports = {
    getUserSession,
    checkUpdatePermissions,
    checkDeletePermissions,
};
