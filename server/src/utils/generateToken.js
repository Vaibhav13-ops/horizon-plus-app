const jwt = require('jsonwebtoken');

const generateToken = (id,role) => {
    console.log("The secret key is :", process.env.JWT_SECRET)
    return jwt.sign({id,role}, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

module.exports = generateToken;