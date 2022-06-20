const restrict = (req, res, next) => {
    checkUser(req, res, next);
};

const checkUser = async (req, res, next) => {
    // Check for user
    if(req.user){
        return next();
    }
    res.status(401).json({ message: 'Access denied' });
};

const checkUpdatePermissions = (currentUser, beforeUpdateUser, updatedUser) => {
    // Owner can do what they like.
    if(currentUser.owner === true){
        return {
            allowed: true
        };
    }

    // If current user is not an admin, can't do anything
    if(currentUser.admin !== true){
        return {
            allowed: false,
            message: 'Access denied'
        };
    }

    // If current user is admin and updated user is being downgraded
    if(currentUser.admin === true && beforeUpdateUser.admin === true && updatedUser.admin !== true){
        return {
            allowed: false,
            message: 'Only owner can remove admin flag.'
        };
    }

    // If current user is admin and updated user is being disabled
    if(currentUser.admin === true && beforeUpdateUser.admin === true && updatedUser.enabled === false){
        return {
            allowed: false,
            message: 'Only owner can disable another admin.'
        };
    }

    // If current user is admin and trying to update an admins email address 
    if(currentUser.admin === true && beforeUpdateUser.admin === true){
        if(beforeUpdateUser.email !== updatedUser.email){
            return {
                allowed: false,
                message: 'Only owner can change another admins email address.'
            };
        }
    }

    // Default
    return {
        allowed: false,
        message: 'Access denied'
    };
}

const checkDeletePermissions = (currentUser, beforeUpdateUser) => {
    // Owner can do what they like.
    if(currentUser.owner === true){
        return {
            allowed: true
        };
    }

    // Cannot can delete the owner
    if(beforeUpdateUser.owner === true){
        return {
            allowed: false,
            message: 'Access denied'
        };
    }

    // If current user is not an admin, can't delete
    if(currentUser.admin !== true){
        return {
            allowed: false,
            message: 'Access denied'
        };
    }

    // If both users are admins
    if(currentUser.admin === true && beforeUpdateUser.admin === true){
        return {
            allowed: false,
            message: 'Access denied'
        };
    }

    // Default
    return {
        allowed: true
    };
}

module.exports = {
    restrict,
    checkUpdatePermissions,
    checkDeletePermissions
};